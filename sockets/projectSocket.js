export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Cliente se une a una room específica de su proyecto
    socket.on('join-project', (projectId) => {
      socket.join(projectId);
      console.log(`👤 Socket ${socket.id} joined project room: ${projectId}`);
    });

    // Actualización de progreso en tiempo real
    socket.on('progress-update', (data) => {
      io.to(data.projectId).emit('progress-changed', {
        progress: data.progress,
        stage: data.stage,
        timestamp: new Date()
      });
    });

    // ✅ Archivo subido (emitido desde Admin)
    socket.on('fileUploaded', (data) => {
      console.log('📎 Archivo subido para proyecto:', data.projectId);
      
      io.to(data.projectId).emit('newFile', {
        file: data.file,
        timestamp: new Date()
      });
    });

    // Nuevo archivo subido (legacy - mantener por compatibilidad)
    socket.on('file-uploaded', (data) => {
      io.to(data.projectId).emit('new-file', {
        file: data.file,
        timestamp: new Date()
      });
    });

    // ✅ NUEVO: Comentario enviado (desde cliente o admin)
    socket.on('commentSent', (data) => {
      console.log('💬 Comentario enviado por:', data.comment.author);
      
      // Emitir a todos en la sala del proyecto (incluyendo admin)
      io.to(data.projectId).emit('newComment', {
        comment: data.comment,
        timestamp: new Date()
      });
    });

    // Nuevo comentario/update (legacy)
    socket.on('new-update', (data) => {
      io.to(data.projectId).emit('update-received', {
        message: data.message,
        author: data.author,
        timestamp: new Date()
      });
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};