import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rutas
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import projectRoutes from './routes/projects.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import paymentRoutes from './routes/payments.js';
import crmRoutes from './routes/crm.js';

// Importar middleware
import authMiddleware from './middleware/auth.js';

// Configuración
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// =======================
//   ORÍGENES PERMITIDOS
// =======================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'https://gabrieldisena.com',
  'https://www.gabrieldisena.com'
];

// =======================
//   CORS HTTP
// =======================

// CORS principal para TODAS las rutas
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

// Preflight global (OPTIONS)
app.options(
  '*',
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

// =======================
//   SOCKET.IO
// =======================

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Hacer io accesible en las rutas
app.set('io', io);

// Conectar a MongoDB con caché para Vercel serverless
let mongoConnected = false;
const connectMongo = async () => {
  if (mongoConnected || mongoose.connection.readyState === 1) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    mongoConnected = true;
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    throw error;
  }
};

// Middleware que garantiza conexión antes de cada request
app.use(async (req, res, next) => {
  try {
    await connectMongo();
    next();
  } catch {
    res.status(503).json({ message: 'Base de datos no disponible' });
  }
});

// Socket.IO - Manejo de conexiones
io.on('connection', (socket) => {
  console.log('🔌 Cliente conectado:', socket.id);

  socket.on('join-project', (projectId) => {
    socket.join(projectId);
    console.log(`📂 Socket ${socket.id} se unió al proyecto ${projectId}`);
  });

  socket.on('commentSent', (data) => {
    console.log('💬 Comentario enviado vía socket:', data);
    io.to(data.projectId).emit('newComment', data);
  });

  socket.on('projectCreated', (data) => {
    console.log('✨ Proyecto creado:', data);
    io.emit('projectUpdate', data);
  });

  socket.on('projectUpdated', (data) => {
    console.log('🔄 Proyecto actualizado:', data);
    io.to(data.projectId).emit('projectUpdate', data);
  });

  socket.on('fileUploaded', (data) => {
    console.log('📎 Archivo subido:', data);
    io.to(data.projectId).emit('fileUpdate', data);
  });

  socket.on('commentDeleted', (data) => {
    console.log('🗑️ Comentario eliminado:', data);
    io.to(data.projectId).emit('commentDeleted', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado:', socket.id);
  });
});

// ========================================
// RUTAS DE LA API
// ========================================

// Rutas públicas (sin autenticación)
app.use('/api/auth', authRoutes);

// Rutas protegidas (con autenticación)
app.use('/api/admin', adminRoutes); // ✅ El auth ya está en los middleware individuales 
app.use('/api/projects', projectRoutes); // Ya tiene auth dentro de cada ruta
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/crm', crmRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: '✅ API de Gabriel Diseña funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      projects: '/api/projects',
      analytics: '/api/analytics'
    }
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    message: '❌ Ruta no encontrada',
    path: req.path
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║                                        ║
║   🚀 Servidor iniciado exitosamente   ║
║                                        ║
║   📍 Puerto: ${PORT}                      ║
║   🌐 URL: http://localhost:${PORT}       ║
║   🔌 Socket.IO: Activo                 ║
║   📧 Email: Configurado                ║
║   💾 MongoDB: Conectado                ║
║                                        ║
║   Gabriel Diseña - Backend API         ║
║                                        ║
╚════════════════════════════════════════╝
  `);
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recibido. Cerrando servidor...');
  httpServer.close(() => {
    console.log('✅ Servidor cerrado');
    mongoose.connection.close(false, () => {
      console.log('✅ Conexión a MongoDB cerrada');
      process.exit(0);
    });
  });
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  httpServer.close(() => {
    process.exit(1);
  });
});

export default app;


