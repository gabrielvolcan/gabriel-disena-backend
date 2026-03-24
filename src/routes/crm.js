import express from 'express';
import multer from 'multer';
import Lead from '../models/Lead.js';
import transporter from '../config/email.js';
import { isAdminOrSuperAdmin } from '../middleware/auth.js';

// Multer en memoria para CSV (no guarda en disco)
const csvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos CSV'));
    }
  }
});

// Parser CSV simple — maneja comillas y comas dentro de campos
function parseCSV(text) {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];

  const parseRow = (line) => {
    const fields = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    fields.push(current.trim());
    return fields;
  };

  const headers = parseRow(lines[0]).map(h => h.toLowerCase().replace(/\s+/g, '_'));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseRow(lines[i]);
    if (values.every(v => v === '')) continue;
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = values[idx] || ''; });
    rows.push(obj);
  }
  return rows;
}

const router = express.Router();

// ─── RUTA PÚBLICA: crear lead desde portfolio ───────────────────────────────
router.post('/public/contact', async (req, res) => {
  try {
    const { name, email, phone, country, service, message } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'El nombre es obligatorio' });
    }

    if (!email && !phone) {
      return res.status(400).json({ message: 'Ingresa al menos un email o teléfono' });
    }

    const lead = new Lead({
      name: name.trim(),
      email: email?.trim() || '',
      phone: phone?.trim() || '',
      country: country || 'otro',
      service: service || 'otro',
      message: message?.trim() || '',
      source: 'portfolio',
      status: 'interesado'
    });

    await lead.save();

    // Notificar a Gabriel por email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_USER,
        subject: `🔥 Nuevo lead desde Portfolio: ${name}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d1117;color:#e2e8f0;border-radius:12px;overflow:hidden">
            <div style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:30px;text-align:center">
              <h1 style="margin:0;color:white;font-size:24px">🔥 Nuevo Lead - Portfolio</h1>
            </div>
            <div style="padding:30px">
              <p><strong>Nombre:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email || '—'}</p>
              <p><strong>Teléfono:</strong> ${phone || '—'}</p>
              <p><strong>País:</strong> ${country || '—'}</p>
              <p><strong>Servicio:</strong> ${service || '—'}</p>
              <p><strong>Mensaje:</strong> ${message || '—'}</p>
              <a href="https://gabrieldisena.com/admin" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:white;padding:14px 30px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:15px">
                Ver en Panel Admin
              </a>
            </div>
          </div>
        `
      });
    } catch (emailErr) {
      console.error('Error enviando notificación de lead:', emailErr.message);
    }

    res.status(201).json({ message: 'Mensaje enviado correctamente', leadId: lead._id });
  } catch (error) {
    console.error('Error creando lead:', error);
    res.status(500).json({ message: 'Error al enviar el mensaje' });
  }
});

// ─── RUTAS PROTEGIDAS (solo admin) ──────────────────────────────────────────

// GET todos los leads
router.get('/', isAdminOrSuperAdmin, async (req, res) => {
  try {
    const { status, source, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.error('Error obteniendo leads:', error);
    res.status(500).json({ message: 'Error al obtener leads' });
  }
});

// GET un lead por id
router.get('/:id', isAdminOrSuperAdmin, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('clientId', 'name email');
    if (!lead) return res.status(404).json({ message: 'Lead no encontrado' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener lead' });
  }
});

// POST crear lead manualmente desde admin
router.post('/', isAdminOrSuperAdmin, async (req, res) => {
  try {
    const { name, email, phone, country, service, message, source, status, notes, budget } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'El nombre es obligatorio' });

    const lead = new Lead({
      name: name.trim(),
      email: email?.trim() || '',
      phone: phone?.trim() || '',
      country: country || 'otro',
      service: service || 'otro',
      message: message?.trim() || '',
      source: source || 'directo',
      status: status || 'frio',
      notes: notes?.trim() || '',
      budget: budget?.trim() || ''
    });

    await lead.save();
    res.status(201).json(lead);
  } catch (error) {
    console.error('Error creando lead:', error);
    res.status(500).json({ message: 'Error al crear lead' });
  }
});

// PUT actualizar lead
router.put('/:id', isAdminOrSuperAdmin, async (req, res) => {
  try {
    const { name, email, phone, country, service, message, source, status, notes, budget } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, country, service, message, source, status, notes, budget },
      { new: true, runValidators: true }
    );
    if (!lead) return res.status(404).json({ message: 'Lead no encontrado' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar lead' });
  }
});

// DELETE eliminar lead
router.delete('/:id', isAdminOrSuperAdmin, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead no encontrado' });
    res.json({ message: 'Lead eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar lead' });
  }
});

// POST agregar seguimiento a un lead
router.post('/:id/followup', isAdminOrSuperAdmin, async (req, res) => {
  try {
    const { note, method, date } = req.body;
    if (!note?.trim()) return res.status(400).json({ message: 'La nota es obligatoria' });

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          followUps: {
            note: note.trim(),
            method: method || 'whatsapp',
            date: date ? new Date(date) : new Date()
          }
        }
      },
      { new: true }
    );

    if (!lead) return res.status(404).json({ message: 'Lead no encontrado' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar seguimiento' });
  }
});

// DELETE eliminar seguimiento
router.delete('/:id/followup/:followUpId', isAdminOrSuperAdmin, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $pull: { followUps: { _id: req.params.followUpId } } },
      { new: true }
    );
    if (!lead) return res.status(404).json({ message: 'Lead no encontrado' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar seguimiento' });
  }
});

// POST email marketing — enviar campaña a leads filtrados
router.post('/marketing/send', isAdminOrSuperAdmin, async (req, res) => {
  try {
    const { subject, html, targetStatus, targetService, customEmails } = req.body;

    if (!subject?.trim() || !html?.trim()) {
      return res.status(400).json({ message: 'Asunto y contenido son obligatorios' });
    }

    let recipients = [];

    if (customEmails && customEmails.length > 0) {
      recipients = customEmails.filter(e => {
        if (!e) return false;
        const addr = typeof e === 'string' ? e : e.email;
        return addr && addr.includes('@');
      });
    } else {
      const filter = { email: { $ne: '' } };
      if (targetStatus) filter.status = targetStatus;
      if (targetService) filter.service = targetService;
      const leads = await Lead.find(filter).select('email name');
      recipients = leads.filter(l => l.email).map(l => ({ email: l.email, name: l.name }));
    }

    if (recipients.length === 0) {
      return res.status(400).json({ message: 'No hay destinatarios con email registrado' });
    }

    let sent = 0;
    let failed = 0;

    for (const recipient of recipients) {
      const email = typeof recipient === 'string' ? recipient : recipient.email;
      const name = typeof recipient === 'object' ? recipient.name : email;
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: email,
          subject: subject.trim(),
          html: html.replace(/\{\{nombre\}\}/g, name)
        });
        sent++;
      } catch {
        failed++;
      }
    }

    res.json({
      message: `Campaña enviada: ${sent} exitosos, ${failed} fallidos`,
      sent,
      failed,
      total: recipients.length
    });
  } catch (error) {
    console.error('Error enviando campaña:', error);
    res.status(500).json({ message: 'Error al enviar campaña' });
  }
});

// GET estadísticas del CRM
router.get('/stats/overview', isAdminOrSuperAdmin, async (req, res) => {
  try {
    const [total, frio, interesado, potencial, cliente, cerrado] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'frio' }),
      Lead.countDocuments({ status: 'interesado' }),
      Lead.countDocuments({ status: 'potencial' }),
      Lead.countDocuments({ status: 'cliente' }),
      Lead.countDocuments({ status: 'cerrado' })
    ]);

    const bySource = await Lead.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);

    const byService = await Lead.aggregate([
      { $group: { _id: '$service', count: { $sum: 1 } } }
    ]);

    const recent = await Lead.find().sort({ createdAt: -1 }).limit(5).select('name status source createdAt');

    res.json({
      total, frio, interesado, potencial, cliente, cerrado,
      bySource, byService, recent
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
});

// POST importar leads desde CSV
router.post('/import/csv', isAdminOrSuperAdmin, csvUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No se recibió ningún archivo' });

    const text = req.file.buffer.toString('utf-8');
    const rows = parseCSV(text);

    if (rows.length === 0) {
      return res.status(400).json({ message: 'El archivo está vacío o no tiene el formato correcto' });
    }

    const validStatuses  = ['frio', 'interesado', 'potencial', 'cliente', 'cerrado', 'enviado', 'no_contactado'];
    const validServices  = ['logo', 'web', 'ambos', 'otro'];
    const validSources   = ['portfolio', 'whatsapp', 'instagram', 'referido', 'directo', 'otro'];

    const leads = [];
    const errors = [];

    rows.forEach((row, idx) => {
      const name = row.nombre || row.name || '';
      if (!name.trim()) { errors.push(`Fila ${idx + 2}: nombre vacío`); return; }

      const status  = validStatuses.includes(row.estado || row.status) ? (row.estado || row.status) : 'frio';
      const service = validServices.includes(row.servicio || row.service) ? (row.servicio || row.service) : 'otro';
      const source  = validSources.includes(row.fuente || row.source) ? (row.fuente || row.source) : 'directo';

      leads.push({
        name:    name.trim(),
        email:   (row.email || '').trim().toLowerCase(),
        phone:   (row.telefono || row.phone || '').trim(),
        country: (row.pais || row.country || 'otro').trim().toLowerCase(),
        service,
        source,
        status,
        notes:   (row.notas || row.notes || '').trim(),
        budget:  (row.presupuesto || row.budget || '').trim(),
        message: (row.mensaje || row.message || '').trim()
      });
    });

    if (leads.length === 0) {
      return res.status(400).json({ message: 'No se encontraron filas válidas', errors });
    }

    const inserted = await Lead.insertMany(leads, { ordered: false });

    res.json({
      message: `${inserted.length} leads importados correctamente`,
      imported: inserted.length,
      skipped: rows.length - inserted.length,
      errors
    });
  } catch (error) {
    console.error('Error importando CSV:', error);
    res.status(500).json({ message: 'Error al procesar el archivo', error: error.message });
  }
});

// GET descargar plantilla CSV
router.get('/import/template', isAdminOrSuperAdmin, (req, res) => {
  const template = `nombre,email,telefono,pais,servicio,fuente,estado,presupuesto,notas,mensaje
Juan Perez,juan@email.com,+54911234567,argentina,logo,instagram,interesado,$200 USD,Cliente referido por Maria,Quiere un logo moderno
Maria Lopez,maria@email.com,+5491987654,colombia,web,portfolio,potencial,$500 USD,,Necesita web para su negocio
`;
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="plantilla-leads.csv"');
  res.send('\uFEFF' + template); // BOM para que Excel lo abra bien
});

export default router;
