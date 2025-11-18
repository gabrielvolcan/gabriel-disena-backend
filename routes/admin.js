import express from 'express';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { sendWelcomeEmail, sendProjectAssignedEmail } from '../config/email.js';
import { isSuperAdmin, isAdminOrSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

// ========================================
// RUTAS PARA PROYECTOS (Admin y SuperAdmin)
// ========================================

// Obtener todos los proyectos
router.get('/projects', isAdminOrSuperAdmin, async (req, res) => {
  try {
    const projects = await Project.find().populate('userId', 'name email phone country').sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error obteniendo proyectos:', error);
    res.status(500).json({ message: 'Error al obtener proyectos' });
  }
});

// Crear nuevo proyecto
router.post('/projects', isAdminOrSuperAdmin, async (req, res) => {
  try {
    const { userId, title, description, type, plan, price, status } = req.body;

    console.log('📝 Datos recibidos para crear proyecto:', req.body);

    if (!userId) {
      return res.status(400).json({ message: 'Debes seleccionar un cliente' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ message: 'El precio debe ser un número válido' });
    }

    const project = new Project({
      userId,
      title: title.trim(),
      description: description.trim(),
      type,
      plan,
      price: parsedPrice,
      status: status || 'pendiente',
      progress: 0
    });

    await project.save();
    console.log('✅ Proyecto creado exitosamente:', project._id);
    await project.populate('userId', 'name email phone country');

    await sendProjectAssignedEmail(user.email, user.name, project);
    
    res.status(201).json(project);
  } catch (error) {
    console.error('❌ Error creando proyecto:', error);
    res.status(500).json({ 
      message: 'Error al crear proyecto', 
      error: error.message,
      details: error.errors ? Object.keys(error.errors).map(key => error.errors[key].message) : []
    });
  }
});

// Actualizar proyecto
router.put('/projects/:id', isAdminOrSuperAdmin, async (req, res) => {
  try {
    const { status, progress, message, stage } = req.body;
    
    console.log('📝 Actualizando proyecto:', req.params.id, req.body);
    
    const updateData = {};
    if (status) updateData.status = status;
    if (progress !== undefined && progress !== null) {
      const parsedProgress = parseInt(progress);
      if (!isNaN(parsedProgress)) {
        updateData.progress = Math.max(0, Math.min(100, parsedProgress));
      }
    }
    if (stage) updateData.stage = stage;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone country');

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    if (message && message.trim()) {
      project.updates = project.updates || [];
      project.updates.push({
        message: message.trim(),
        author: 'admin',
        createdAt: new Date()
      });
      await project.save();
    }

    console.log('✅ Proyecto actualizado exitosamente');

    const io = req.app.get('io');
    if (io) {
      io.emit('projectUpdate', {
        projectId: project._id,
        userId: project.userId._id,
        progress: project.progress,
        stage: project.stage,
        status: project.status,
        message: message || null,
        timestamp: new Date()
      });
      console.log('📡 Evento Socket.IO emitido');
    }

    res.json(project);
  } catch (error) {
    console.error('❌ Error actualizando proyecto:', error);
    res.status(500).json({ message: 'Error al actualizar proyecto', error: error.message });
  }
});

// Eliminar proyecto
router.delete('/projects/:id', isAdminOrSuperAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    console.log('✅ Proyecto eliminado:', req.params.id);
    res.json({ message: 'Proyecto eliminado exitosamente' });
  } catch (error) {
    console.error('❌ Error eliminando proyecto:', error);
    res.status(500).json({ message: 'Error al eliminar proyecto' });
  }
});

// ========================================
// RUTAS PARA CLIENTES (Admin y SuperAdmin)
// ========================================

// Obtener todos los clientes
router.get('/users', isAdminOrSuperAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'client' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// Crear nuevo cliente
router.post('/users', isAdminOrSuperAdmin, async (req, res) => {
  try {
    const { name, email, password, phone, country } = req.body;

    console.log('📝 Creando usuario:', { name, email, phone, country });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const user = new User({
      name,
      email,
      password,
      phone: phone || '',
      country: country || 'peru',
      role: 'client',
      createdBy: req.user.id
    });

    await user.save();
    console.log('✅ Usuario creado exitosamente');

    await sendWelcomeEmail(email, name, password);
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
});

// Eliminar cliente
router.delete('/users/:id', isAdminOrSuperAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await Project.deleteMany({ userId: req.params.id });

    console.log('✅ Usuario eliminado:', req.params.id);
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('❌ Error eliminando usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
});

// ========================================
// 🆕 RUTAS PARA ADMINISTRADORES (SOLO SUPERADMIN)
// ========================================

// Obtener todos los administradores
router.get('/administrators', isSuperAdmin, async (req, res) => {
  try {
    const admins = await User.find({ 
      role: { $in: ['admin', 'superadmin'] } 
    })
    .select('-password')
    .sort({ createdAt: -1 });
    
    res.json(admins);
  } catch (error) {
    console.error('Error obteniendo administradores:', error);
    res.status(500).json({ message: 'Error al obtener administradores' });
  }
});

// Crear nuevo administrador
router.post('/administrators', isSuperAdmin, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    console.log('📝 Creando administrador:', { name, email });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const admin = new User({
      name,
      email,
      password,
      phone: phone || '',
      role: 'admin',
      createdBy: req.user.id
    });

    await admin.save();
    console.log('✅ Administrador creado exitosamente');

    await sendWelcomeEmail(email, name, password);
    
    const adminResponse = admin.toObject();
    delete adminResponse.password;
    
    res.status(201).json(adminResponse);
  } catch (error) {
    console.error('❌ Error creando administrador:', error);
    res.status(500).json({ message: 'Error al crear administrador', error: error.message });
  }
});

// Actualizar administrador
router.put('/administrators/:id', isSuperAdmin, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    const admin = await User.findById(req.params.id);
    
    if (!admin || (admin.role !== 'admin' && admin.role !== 'superadmin')) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    // No permitir modificar al superadmin original
    if (admin.role === 'superadmin' && !admin.createdBy) {
      return res.status(403).json({ message: 'No puedes modificar al super administrador principal' });
    }

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (phone !== undefined) admin.phone = phone;

    await admin.save();
    
    const adminResponse = admin.toObject();
    delete adminResponse.password;
    
    res.json(adminResponse);
  } catch (error) {
    console.error('❌ Error actualizando administrador:', error);
    res.status(500).json({ message: 'Error al actualizar administrador' });
  }
});

// Eliminar administrador
router.delete('/administrators/:id', isSuperAdmin, async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);
    
    if (!admin || (admin.role !== 'admin' && admin.role !== 'superadmin')) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    // No permitir eliminar al superadmin original
    if (admin.role === 'superadmin' && !admin.createdBy) {
      return res.status(403).json({ message: 'No puedes eliminar al super administrador principal' });
    }

    await User.findByIdAndDelete(req.params.id);

    console.log('✅ Administrador eliminado:', req.params.id);
    res.json({ message: 'Administrador eliminado exitosamente' });
  } catch (error) {
    console.error('❌ Error eliminando administrador:', error);
    res.status(500).json({ message: 'Error al eliminar administrador' });
  }
});

export default router;