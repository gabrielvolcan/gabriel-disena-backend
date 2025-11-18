import express from 'express';
import Project from '../../../models/Project.js';
import User from '../../../models/User.js';
import auth from '../../../middleware/auth.js';
import upload from '../../../config/multer.js';
import { sendFileUploadedEmail, sendProjectCompletedEmail } from '../../../config/email.js';

const router = express.Router();

// ✅ RUTA CRÍTICA: Obtener proyecto del cliente por userId
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Buscar el proyecto del usuario
    const project = await Project.findOne({ userId })
      .populate('userId', 'name email phone country')
      .sort({ createdAt: -1 }); // El más reciente

    if (!project) {
      return res.status(404).json({ 
        message: 'No se encontró ningún proyecto para este usuario' 
      });
    }

    res.json(project);
  } catch (error) {
    console.error('❌ Error obteniendo proyecto:', error);
    res.status(500).json({ 
      message: 'Error al obtener el proyecto',
      error: error.message 
    });
  }
});

// Obtener todos los proyectos (para admin)
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('userId', 'name email phone country')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error('❌ Error obteniendo proyectos:', error);
    res.status(500).json({ 
      message: 'Error al obtener proyectos',
      error: error.message 
    });
  }
});

// Crear nuevo proyecto
router.post('/create', auth, async (req, res) => {
  try {
    const { userId, title, description, type, plan, price } = req.body;

    const project = new Project({
      userId,
      title,
      description,
      type,
      plan,
      price: parseFloat(price) || 0,
      status: 'pendiente',
      progress: 0
    });

    await project.save();

    // Agregar proyecto al usuario
    await User.findByIdAndUpdate(userId, {
      $push: { projects: project._id }
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('❌ Error creando proyecto:', error);
    res.status(500).json({ 
      message: 'Error al crear proyecto',
      error: error.message 
    });
  }
});

// Obtener proyecto por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('userId', 'name email phone country');

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    res.json(project);
  } catch (error) {
    console.error('❌ Error obteniendo proyecto:', error);
    res.status(500).json({ 
      message: 'Error al obtener proyecto',
      error: error.message 
    });
  }
});

// ✅ Actualizar proyecto + EMAIL SI ESTÁ COMPLETADO
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, progress, message } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (progress !== undefined) updateData.progress = parseFloat(progress);

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('userId', 'name email phone country');

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Si hay un mensaje, agregarlo a updates
    if (message) {
      project.updates.push({
        message,
        author: 'admin',
        createdAt: new Date()
      });
      await project.save();
    }

    // ✉️ ENVIAR EMAIL SI EL PROYECTO FUE COMPLETADO
    if (status === 'completado' && project.userId) {
      await sendProjectCompletedEmail(
        project.userId.email,
        project.userId.name,
        project
      );
    }

    res.json(project);
  } catch (error) {
    console.error('❌ Error actualizando proyecto:', error);
    res.status(500).json({ 
      message: 'Error al actualizar proyecto',
      error: error.message 
    });
  }
});

// Agregar actualización al proyecto
router.post('/:id/update', auth, async (req, res) => {
  try {
    const { message, author = 'admin' } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    project.updates.push({
      message,
      author,
      createdAt: new Date()
    });

    await project.save();

    res.json(project);
  } catch (error) {
    console.error('❌ Error agregando actualización:', error);
    res.status(500).json({ 
      message: 'Error al agregar actualización',
      error: error.message 
    });
  }
});

// ✅ AGREGAR COMENTARIO
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { message, author } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'El comentario no puede estar vacío' });
    }

    const project = await Project.findById(req.params.id)
      .populate('userId', 'name email phone country');

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    const newComment = {
      message: message.trim(),
      author: author || 'client',
      createdAt: new Date()
    };

    project.updates.push(newComment);
    await project.save();

    console.log('💬 Comentario agregado por:', author);

    res.json({ 
      message: 'Comentario agregado exitosamente',
      comment: newComment,
      project 
    });
  } catch (error) {
    console.error('❌ Error agregando comentario:', error);
    res.status(500).json({ 
      message: 'Error al agregar comentario',
      error: error.message 
    });
  }
});

// ✅ ELIMINAR COMENTARIO (solo admin)
router.delete('/:projectId/comment/:commentId', auth, async (req, res) => {
  try {
    const { projectId, commentId } = req.params;
    const userRole = req.user.role;

    // Solo admin puede eliminar comentarios
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para eliminar comentarios' });
    }

    const project = await Project.findById(projectId)
      .populate('userId', 'name email phone country');
    
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Buscar el índice del comentario
    const commentIndex = project.updates.findIndex(
      update => update._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    // Eliminar el comentario
    project.updates.splice(commentIndex, 1);
    await project.save();

    console.log('🗑️ Comentario eliminado por admin');

    res.json({ 
      message: 'Comentario eliminado exitosamente',
      project 
    });
  } catch (error) {
    console.error('❌ Error al eliminar comentario:', error);
    res.status(500).json({ 
      message: 'Error al eliminar comentario',
      error: error.message 
    });
  }
});

// ✅ SUBIR ARCHIVO + EMAIL DE NOTIFICACIÓN
router.post('/:id/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ningún archivo' });
    }

    const project = await Project.findById(req.params.id)
      .populate('userId', 'name email phone country');

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Crear URL del archivo
    const fileUrl = `https://gabriel-disena-backend.onrender.com/uploads/${req.file.filename}`;

    // Agregar archivo al proyecto
    const newFile = {
      url: fileUrl,
      name: req.file.originalname,
      uploadedAt: new Date(),
      uploadedBy: 'admin'
    };

    project.files.push(newFile);
    await project.save();

    console.log('✅ Archivo subido:', req.file.originalname);

    // ✉️ ENVIAR EMAIL DE ARCHIVO SUBIDO
    if (project.userId) {
      await sendFileUploadedEmail(
        project.userId.email,
        project.userId.name,
        project,
        req.file.originalname
      );
    }

    res.json({ 
      message: 'Archivo subido exitosamente',
      file: newFile,
      project 
    });
  } catch (error) {
    console.error('❌ Error subiendo archivo:', error);
    res.status(500).json({ 
      message: 'Error al subir archivo',
      error: error.message 
    });
  }
});

// Eliminar proyecto
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Remover proyecto del usuario
    await User.findByIdAndUpdate(project.userId, {
      $pull: { projects: project._id }
    });

    res.json({ message: 'Proyecto eliminado exitosamente' });
  } catch (error) {
    console.error('❌ Error eliminando proyecto:', error);
    res.status(500).json({ 
      message: 'Error al eliminar proyecto',
      error: error.message 
    });
  }
});

export default router;