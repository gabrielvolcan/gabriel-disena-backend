import express from 'express';
import Project from '../models/Project.js';
import auth from '../middleware/auth.js';
import { sendPaymentConfirmationEmail } from '../config/email.js';
import PDFDocument from 'pdfkit';

const router = express.Router();

// 📊 Registrar pago de anticipo (50%)
router.post('/deposit/:projectId', auth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { paymentMethod, transactionId, currency, notes } = req.body;

    const project = await Project.findById(projectId)
      .populate('userId', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Verificar que el pago no se haya realizado ya
    if (project.paymentStatus !== 'pending_deposit') {
      return res.status(400).json({ 
        message: 'El anticipo ya fue pagado' 
      });
    }

    // Generar número de factura
    const invoiceNumber = `INV-${Date.now()}-DEP`;

    // Registrar factura de anticipo
    project.invoices.push({
      invoiceNumber,
      type: 'deposit',
      amount: project.depositAmount,
      currency: currency || 'USD',
      paidAt: new Date(),
      paymentMethod: paymentMethod || 'transferencia',
      transactionId: transactionId || '',
      notes: notes || ''
    });

    // Actualizar estado de pago y proyecto
    project.paymentStatus = 'deposit_paid';
    project.totalPaid = project.depositAmount;
    project.status = 'en-progreso';

    // Agregar notificación de pago
    project.updates.push({
      message: `✅ Pago de anticipo recibido: ${currency || 'USD'} $${project.depositAmount}. ¡Iniciamos tu proyecto!`,
      author: 'admin',
      createdAt: new Date(),
      isPaymentNotification: true
    });

    await project.save();

    console.log('✅ Anticipo registrado:', invoiceNumber);

    // Enviar email al cliente
    if (project.userId && project.userId.email) {
      await sendPaymentConfirmationEmail(
        project.userId.email,
        project.userId.name,
        project,
        'deposit',
        invoiceNumber
      );
    }

    res.json({
      message: 'Pago de anticipo registrado exitosamente',
      project,
      invoice: project.invoices[project.invoices.length - 1]
    });
  } catch (error) {
    console.error('❌ Error registrando anticipo:', error);
    res.status(500).json({ 
      message: 'Error al registrar pago',
      error: error.message 
    });
  }
});

// 📊 Registrar pago final (50%)
router.post('/final/:projectId', auth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { paymentMethod, transactionId, currency, notes } = req.body;

    const project = await Project.findById(projectId)
      .populate('userId', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Verificar que el anticipo ya fue pagado
    if (project.paymentStatus !== 'deposit_paid' && project.paymentStatus !== 'pending_final') {
      return res.status(400).json({ 
        message: 'Primero debe pagarse el anticipo' 
      });
    }

    // Verificar que el pago final no se haya realizado ya
    if (project.paymentStatus === 'fully_paid') {
      return res.status(400).json({ 
        message: 'El pago ya fue completado' 
      });
    }

    // Generar número de factura
    const invoiceNumber = `INV-${Date.now()}-FIN`;

    // Registrar factura final
    project.invoices.push({
      invoiceNumber,
      type: 'final',
      amount: project.finalAmount,
      currency: currency || 'USD',
      paidAt: new Date(),
      paymentMethod: paymentMethod || 'transferencia',
      transactionId: transactionId || '',
      notes: notes || ''
    });

    // Actualizar estado de pago y proyecto
    project.paymentStatus = 'fully_paid';
    project.totalPaid = project.price;
    project.isPaid = true;
    project.status = 'entregado';
    project.progress = 100;

    // Agregar notificación de pago
    project.updates.push({
      message: `✅ Pago final recibido: ${currency || 'USD'} $${project.finalAmount}. ¡Proyecto completado! Puedes descargar todos los archivos.`,
      author: 'admin',
      createdAt: new Date(),
      isPaymentNotification: true
    });

    await project.save();

    console.log('✅ Pago final registrado:', invoiceNumber);

    // Enviar email al cliente
    if (project.userId && project.userId.email) {
      await sendPaymentConfirmationEmail(
        project.userId.email,
        project.userId.name,
        project,
        'final',
        invoiceNumber
      );
    }

    res.json({
      message: 'Pago final registrado exitosamente',
      project,
      invoice: project.invoices[project.invoices.length - 1]
    });
  } catch (error) {
    console.error('❌ Error registrando pago final:', error);
    res.status(500).json({ 
      message: 'Error al registrar pago',
      error: error.message 
    });
  }
});

// 📄 Obtener facturas de un proyecto
router.get('/:projectId/invoices', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .select('invoices price depositAmount finalAmount paymentStatus totalPaid')
      .populate('userId', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    res.json({
      invoices: project.invoices,
      paymentStatus: project.paymentStatus,
      totals: {
        price: project.price,
        depositAmount: project.depositAmount,
        finalAmount: project.finalAmount,
        totalPaid: project.totalPaid
      }
    });
  } catch (error) {
    console.error('❌ Error obteniendo facturas:', error);
    res.status(500).json({ 
      message: 'Error al obtener facturas',
      error: error.message 
    });
  }
});

// 🆕 📥 DESCARGAR FACTURA EN PDF
router.get('/invoice/:projectId/:invoiceNumber', auth, async (req, res) => {
  try {
    const { projectId, invoiceNumber } = req.params;

    const project = await Project.findById(projectId)
      .populate('userId', 'name email country');

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Buscar la factura específica
    const invoice = project.invoices.find(
      inv => inv.invoiceNumber === invoiceNumber
    );

    if (!invoice) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }

    // Crear el documento PDF
    const doc = new PDFDocument({ 
      size: 'A4',
      margin: 50 
    });

    // Configurar headers para descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition', 
      `attachment; filename=Factura-${invoiceNumber}.pdf`
    );

    // Stream del PDF a la respuesta
    doc.pipe(res);

    // === ENCABEZADO ===
    doc
      .fontSize(28)
      .fillColor('#3b82f6')
      .text('Gabriel Diseña', 50, 50)
      .fontSize(10)
      .fillColor('#64748b')
      .text('Diseño Gráfico & Desarrollo Web', 50, 85)
      .text('gabrieldisena.com', 50, 100)
      .moveDown();

    // Línea separadora
    doc
      .strokeColor('#3b82f6')
      .lineWidth(2)
      .moveTo(50, 125)
      .lineTo(545, 125)
      .stroke();

    // === INFORMACIÓN DE FACTURA ===
    doc
      .fontSize(24)
      .fillColor('#1e293b')
      .text('FACTURA', 400, 50, { align: 'right' })
      .fontSize(10)
      .fillColor('#64748b')
      .text(`N° ${invoice.invoiceNumber}`, 400, 80, { align: 'right' })
      .text(
        `Fecha: ${new Date(invoice.paidAt).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })}`,
        400,
        95,
        { align: 'right' }
      );

    // === DATOS DEL CLIENTE ===
    doc
      .fontSize(12)
      .fillColor('#1e293b')
      .text('FACTURADO A:', 50, 160)
      .fontSize(10)
      .fillColor('#475569')
      .text(project.userId.name || 'Cliente', 50, 180)
      .text(project.userId.email || '', 50, 195)
      .text(project.userId.country || '', 50, 210);

    // === TIPO DE PAGO ===
    const paymentTypeText = invoice.type === 'deposit' 
      ? '💰 ANTICIPO (50%)' 
      : '✅ PAGO FINAL (50%)';
    
    doc
      .fontSize(12)
      .fillColor('#1e293b')
      .text('TIPO DE PAGO:', 350, 160)
      .fontSize(11)
      .fillColor(invoice.type === 'deposit' ? '#f59e0b' : '#10b981')
      .text(paymentTypeText, 350, 180);

    // === DETALLES DEL PROYECTO ===
    doc
      .fontSize(14)
      .fillColor('#1e293b')
      .text('DETALLES DEL PROYECTO', 50, 260);

    // Tabla de proyecto
    const tableTop = 290;
    
    // Header de tabla
    doc
      .fontSize(10)
      .fillColor('#ffffff')
      .rect(50, tableTop, 495, 25)
      .fillAndStroke('#3b82f6', '#3b82f6')
      .fillColor('#ffffff')
      .text('Proyecto', 60, tableTop + 8)
      .text('Tipo', 280, tableTop + 8)
      .text('Plan', 380, tableTop + 8)
      .text('Precio Total', 460, tableTop + 8);

    // Contenido de tabla
    doc
      .fontSize(10)
      .fillColor('#1e293b')
      .text(project.title, 60, tableTop + 38, { width: 200 })
      .text(project.type === 'logo' ? '🎨 Logo' : '💻 Web', 280, tableTop + 38)
      .text(project.plan.charAt(0).toUpperCase() + project.plan.slice(1), 380, tableTop + 38)
      .text(`$${project.price.toFixed(2)}`, 460, tableTop + 38);

    // Línea de separación
    doc
      .strokeColor('#e2e8f0')
      .lineWidth(1)
      .moveTo(50, tableTop + 60)
      .lineTo(545, tableTop + 60)
      .stroke();

    // === INFORMACIÓN DE PAGO ===
    const paymentTop = tableTop + 90;

    doc
      .fontSize(14)
      .fillColor('#1e293b')
      .text('INFORMACIÓN DE PAGO', 50, paymentTop);

    // Detalles de pago
    const paymentDetailsTop = paymentTop + 35;
    
    doc
      .fontSize(10)
      .fillColor('#64748b')
      .text('Método de Pago:', 50, paymentDetailsTop)
      .fillColor('#1e293b')
      .text(getPaymentMethodText(invoice.paymentMethod), 180, paymentDetailsTop);

    if (invoice.transactionId) {
      doc
        .fillColor('#64748b')
        .text('ID de Transacción:', 50, paymentDetailsTop + 20)
        .fillColor('#1e293b')
        .text(invoice.transactionId, 180, paymentDetailsTop + 20);
    }

    if (invoice.notes) {
      doc
        .fillColor('#64748b')
        .text('Notas:', 50, paymentDetailsTop + 40)
        .fillColor('#1e293b')
        .text(invoice.notes, 180, paymentDetailsTop + 40, { width: 350 });
    }

    doc
      .fillColor('#64748b')
      .text('Moneda:', 50, paymentDetailsTop + (invoice.notes ? 80 : 40))
      .fillColor('#1e293b')
      .text(invoice.currency || 'USD', 180, paymentDetailsTop + (invoice.notes ? 80 : 40));

    // === RESUMEN DE PAGO ===
    const summaryTop = 600;

    // Fondo del resumen
    doc
      .rect(320, summaryTop, 225, invoice.type === 'deposit' ? 90 : 120)
      .fillAndStroke('#f8fafc', '#e2e8f0');

    // Líneas del resumen
    doc
      .fontSize(10)
      .fillColor('#64748b')
      .text('Precio Total:', 335, summaryTop + 15)
      .text('Anticipo (50%):', 335, summaryTop + 35)
      .text('Saldo (50%):', 335, summaryTop + 55);

    doc
      .fillColor('#1e293b')
      .text(`$${project.price.toFixed(2)}`, 480, summaryTop + 15, { align: 'right' })
      .text(`$${project.depositAmount.toFixed(2)}`, 480, summaryTop + 35, { align: 'right' })
      .text(`$${project.finalAmount.toFixed(2)}`, 480, summaryTop + 55, { align: 'right' });

    if (invoice.type === 'final') {
      // Línea separadora
      doc
        .strokeColor('#cbd5e1')
        .lineWidth(1)
        .moveTo(335, summaryTop + 75)
        .lineTo(530, summaryTop + 75)
        .stroke();

      doc
        .fontSize(11)
        .fillColor('#10b981')
        .text('Total Pagado:', 335, summaryTop + 85, { bold: true })
        .text(`$${project.totalPaid.toFixed(2)}`, 480, summaryTop + 85, { align: 'right', bold: true });
    }

    // === MONTO DE ESTA FACTURA ===
    const amountBoxTop = invoice.type === 'deposit' ? summaryTop + 110 : summaryTop + 140;
    
    doc
      .rect(320, amountBoxTop, 225, 50)
      .fillAndStroke(
        invoice.type === 'deposit' ? '#fef3c7' : '#d1fae5',
        invoice.type === 'deposit' ? '#f59e0b' : '#10b981'
      );

    doc
      .fontSize(11)
      .fillColor(invoice.type === 'deposit' ? '#92400e' : '#065f46')
      .text('MONTO DE ESTA FACTURA', 335, amountBoxTop + 10)
      .fontSize(18)
      .text(
        `${invoice.currency || 'USD'} $${invoice.amount.toFixed(2)}`,
        335,
        amountBoxTop + 28
      );


    // Finalizar el PDF
    doc.end();

  } catch (error) {
    console.error('❌ Error generando PDF:', error);
    res.status(500).json({ 
      message: 'Error al generar la factura',
      error: error.message 
    });
  }
});

// Función helper para nombres de métodos de pago
function getPaymentMethodText(method) {
  const methods = {
    'bank_transfer': 'Transferencia Bancaria',
    'zelle': 'Zelle',
    'paypal': 'PayPal',
    'binance': 'Binance',
    'mobile_payment': 'Pago Móvil',
    'cash': 'Efectivo',
    'transferencia': 'Transferencia Bancaria'
  };
  return methods[method] || method;
}

export default router;