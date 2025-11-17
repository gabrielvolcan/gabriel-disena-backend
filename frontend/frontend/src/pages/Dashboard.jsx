import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [sendingComment, setSendingComment] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    if (!token || userRole !== 'client') {
      navigate('/login');
      return;
    }

    const newSocket = io('http://localhost:5000', {
      auth: { token }
    });

    setSocket(newSocket);
    fetchProject(userId, token);

    return () => newSocket.close();
  }, [navigate]);

  useEffect(() => {
    if (!socket || !project) return;

    socket.emit('join-project', project._id);

    socket.on('projectUpdate', (data) => {
      console.log('📥 Actualización recibida:', data);
      
      setProject(prev => {
        const updated = { ...prev };
        
        if (data.status) updated.status = data.status;
        if (data.progress !== undefined) updated.progress = data.progress;
        if (data.stage) updated.stage = data.stage;
        
        if (data.message) {
          updated.updates = [
            ...(prev.updates || []),
            {
              message: data.message,
              author: 'admin',
              createdAt: new Date()
            }
          ];
        }
        
        return updated;
      });

      showNotification('¡Nueva actualización en tu proyecto!', 'success');
    });

    socket.on('newFile', (data) => {
      console.log('📎 Nuevo archivo recibido:', data);
      
      setProject(prev => ({
        ...prev,
        files: [
          ...(prev.files || []),
          data.file
        ]
      }));

      showNotification('¡Gabriel compartió un nuevo archivo!', 'info');
    });

    socket.on('progressUpdate', (data) => {
      console.log('📊 Progreso actualizado:', data);
      
      setProject(prev => ({
        ...prev,
        progress: data.progress
      }));

      showNotification(`Progreso actualizado: ${data.progress}%`, 'info');
    });

    socket.on('newComment', (data) => {
      console.log('💬 Nuevo comentario recibido:', data);
      
      setProject(prev => ({
        ...prev,
        updates: [
          ...(prev.updates || []),
          data.comment
        ]
      }));

      if (data.comment.author === 'admin') {
        showNotification('Gabriel respondió tu comentario', 'info');
      }
    });

    // 🆕 EVENTO DE PAGO REGISTRADO
    socket.on('paymentRegistered', (data) => {
      console.log('💰 Pago registrado:', data);
      
      if (data.projectId === project._id) {
        setProject(prev => ({
          ...prev,
          paymentStatus: data.paymentStatus,
          totalPaid: data.totalPaid,
          invoices: data.invoices || prev.invoices
        }));

        const paymentType = data.invoiceType === 'deposit' ? 'anticipo' : 'pago final';
        showNotification(`✅ ${paymentType.charAt(0).toUpperCase() + paymentType.slice(1)} registrado correctamente`, 'success');
      }
    });

    return () => {
      socket.off('projectUpdate');
      socket.off('newFile');
      socket.off('progressUpdate');
      socket.off('newComment');
      socket.off('paymentRegistered');
    };
  }, [socket, project]);

  const fetchProject = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else {
        console.error('No se encontró proyecto para este usuario');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project:', error);
      setLoading(false);
    }
  };

  const handleSendComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    setSendingComment(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/projects/${project._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: newComment.trim(),
          author: 'client'
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        setProject(prev => ({
          ...prev,
          updates: [
            ...(prev.updates || []),
            {
              message: newComment.trim(),
              author: 'client',
              createdAt: new Date()
            }
          ]
        }));

        if (socket) {
          socket.emit('commentSent', {
            projectId: project._id,
            comment: {
              message: newComment.trim(),
              author: 'client',
              createdAt: new Date()
            }
          });
        }

        setNewComment('');
        showNotification('✅ Comentario enviado', 'success');
      } else {
        showNotification('❌ Error al enviar comentario', 'error');
      }
    } catch (error) {
      console.error('Error sending comment:', error);
      showNotification('❌ Error al enviar comentario', 'error');
    } finally {
      setSendingComment(false);
    }
  };

  const handlePreviewFile = (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if (imageExtensions.includes(fileExtension)) {
      setPreviewFile(file);
    } else {
      showNotification('Solo puedes previsualizar imágenes', 'error');
    }
  };

  // 🆕 FUNCIÓN PARA DESCARGAR ARCHIVOS
  const handleDownloadFile = (file) => {
    // Verificar si el pago está completo
    if (project.paymentStatus !== 'fully_paid') {
      showNotification('🔒 Completa el pago para descargar los archivos', 'error');
      return;
    }

    // Si el pago está completo, permitir descarga
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('✅ Descargando archivo...', 'success');
  };

  const showNotification = (message, type) => {
    const id = Date.now();
    const notification = { id, message, type };
    
    setNotifications(prev => [...prev, notification]);
    playNotificationSound();
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const playNotificationSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    const colors = {
      pendiente: '#f59e0b',
      'en-progreso': '#3b82f6',
      revision: '#8b5cf6',
      completado: '#10b981',
      entregado: '#10b981',
      cancelado: '#ef4444'
    };
    return colors[status] || '#94a3b8';
  };

  const getStatusText = (status) => {
    const texts = {
      pendiente: 'Pendiente',
      'en-progreso': 'En Progreso',
      revision: 'En Revisión',
      completado: 'Completado',
      entregado: 'Entregado',
      cancelado: 'Cancelado'
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pendiente: '⏳',
      'en-progreso': '🚀',
      revision: '👀',
      completado: '✅',
      entregado: '🎉',
      cancelado: '❌'
    };
    return icons[status] || '📋';
  };

  // 🆕 FUNCIÓN PARA DESCARGAR FACTURA PDF
const handleDownloadInvoice = async (invoiceNumber) => {
  try {
    const token = localStorage.getItem('token');
    
    showNotification('📥 Generando factura...', 'info');

    const response = await fetch(
      `http://localhost:5000/api/payments/invoice/${project._id}/${invoiceNumber}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Error al descargar la factura');
    }

    // Convertir la respuesta a blob
    const blob = await response.blob();
    
    // Crear URL del blob
    const url = window.URL.createObjectURL(blob);
    
    // Crear enlace temporal para descarga
    const link = document.createElement('a');
    link.href = url;
    link.download = `Factura-${invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    
    // Limpiar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    showNotification('✅ Factura descargada correctamente', 'success');
  } catch (error) {
    console.error('Error descargando factura:', error);
    showNotification('❌ Error al descargar la factura', 'error');
  }
};

  // 🆕 FUNCIÓN PARA OBTENER COLOR DEL ESTADO DE PAGO
  const getPaymentStatusColor = (status) => {
    const colors = {
      pending_deposit: '#f59e0b',
      deposit_paid: '#3b82f6',
      pending_final: '#8b5cf6',
      fully_paid: '#10b981'
    };
    return colors[status] || '#94a3b8';
  };

  // 🆕 FUNCIÓN PARA OBTENER TEXTO DEL ESTADO DE PAGO
  const getPaymentStatusText = (status) => {
    const texts = {
      pending_deposit: 'Anticipo Pendiente',
      deposit_paid: 'Anticipo Pagado',
      pending_final: 'Pago Final Pendiente',
      fully_paid: 'Pagado Completamente'
    };
    return texts[status] || 'Sin información';
  };

  // 🆕 FUNCIÓN PARA OBTENER ICONO DEL ESTADO DE PAGO
  const getPaymentStatusIcon = (status) => {
    const icons = {
      pending_deposit: '⏳',
      deposit_paid: '💰',
      pending_final: '📊',
      fully_paid: '✅'
    };
    return icons[status] || '💵';
  };

  // 🆕 FUNCIÓN PARA FORMATEAR MONEDA
  const formatCurrency = (amount, currency = 'USD') => {
    const symbols = {
      USD: '$',
      PEN: 'S/',
      CLP: '$',
      ARS: '$',
      VES: 'Bs.',
      EUR: '€',
      MXN: '$',
      COP: '$',
      BRL: 'R$'
    };
    
    const symbol = symbols[currency] || currency;
    return `${symbol}${parseFloat(amount).toFixed(2)}`;
  };

  // 🆕 FUNCIÓN PARA OBTENER NOMBRE DEL MÉTODO DE PAGO
  const getPaymentMethodName = (method) => {
    const methods = {
      'bank_transfer': 'Transferencia Bancaria',
      'zelle': 'Zelle',
      'paypal': 'PayPal',
      'binance': 'Binance',
      'mobile_payment': 'Pago Móvil',
      'cash': 'Efectivo'
    };
    return methods[method] || method;
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando tu proyecto...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-empty">
          <div className="empty-icon">📭</div>
          <h2>No tienes proyectos activos</h2>
          <p>Contacta a Gabriel para iniciar tu proyecto</p>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  // 🆕 CALCULAR MONTOS DE PAGO
  const depositAmount = project.depositAmount || (project.price * 0.5);
  const finalAmount = project.finalAmount || (project.price * 0.5);
  const totalPaid = project.totalPaid || 0;
  const remainingBalance = project.price - totalPaid;

  return (
    <div className="dashboard-container">
      {notifications.map(notif => (
        <div key={notif.id} className={`notification-toast ${notif.type}`}>
          <div className="notification-icon">
            {notif.type === 'success' && '✓'}
            {notif.type === 'info' && 'ℹ'}
            {notif.type === 'error' && '⚠'}
          </div>
          <div className="notification-content">
            <p className="notification-message">{notif.message}</p>
          </div>
        </div>
      ))}

      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="header-left">
            <h1>Mi Proyecto</h1>
            <p className="header-subtitle">Panel de seguimiento</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="project-card">
          <div className="project-header">
            <div className="project-title-section">
              <h2>{project.title}</h2>
              <p className="project-type">
                {project.type === 'logo' ? '🎨 Diseño de Logo' : '💻 Desarrollo Web'} • Plan {project.plan.charAt(0).toUpperCase() + project.plan.slice(1)}
              </p>
            </div>
            <div className="status-badge-container">
              <span className="status-icon">{getStatusIcon(project.status)}</span>
              <span 
                className="status-badge"
                style={{ background: getStatusColor(project.status) }}
              >
                {getStatusText(project.status)}
              </span>
            </div>
          </div>

          <div className="project-description">
            <h3>📝 Descripción del Proyecto</h3>
            <p>{project.description}</p>
          </div>

          <div className="project-info-grid">
            <div className="info-item">
              <span className="info-icon">💰</span>
              <div className="info-details">
                <span className="info-label">Precio</span>
                <span className="info-value">${project.price}</span>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">📅</span>
              <div className="info-details">
                <span className="info-label">Fecha de inicio</span>
                <span className="info-value">{new Date(project.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">⏱️</span>
              <div className="info-details">
                <span className="info-label">Última actualización</span>
                <span className="info-value">{new Date(project.updatedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 🆕 SECCIÓN DE PAGOS */}
        <div className="payment-card">
          <div className="payment-header">
            <h3>💰 Gestión de Pagos</h3>
            <div className="payment-status-badge-container">
              <span className="payment-status-icon">{getPaymentStatusIcon(project.paymentStatus)}</span>
              <span 
                className="payment-status-badge"
                style={{ background: getPaymentStatusColor(project.paymentStatus) }}
              >
                {getPaymentStatusText(project.paymentStatus)}
              </span>
            </div>
          </div>

          <div className="payment-summary">
            <div className="payment-summary-grid">
              <div className="payment-summary-item total">
                <span className="payment-summary-icon">💵</span>
                <div className="payment-summary-details">
                  <span className="payment-summary-label">Precio Total</span>
                  <span className="payment-summary-value">${project.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="payment-summary-item deposit">
                <span className="payment-summary-icon">📥</span>
                <div className="payment-summary-details">
                  <span className="payment-summary-label">Anticipo (50%)</span>
                  <span className="payment-summary-value">${depositAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="payment-summary-item final">
                <span className="payment-summary-icon">📤</span>
                <div className="payment-summary-details">
                  <span className="payment-summary-label">Saldo (50%)</span>
                  <span className="payment-summary-value">${finalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="payment-summary-item paid">
                <span className="payment-summary-icon">✅</span>
                <div className="payment-summary-details">
                  <span className="payment-summary-label">Total Pagado</span>
                  <span className="payment-summary-value total-paid">${totalPaid.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {remainingBalance > 0 && (
              <div className="payment-remaining">
                <span className="payment-remaining-label">Saldo Pendiente:</span>
                <span className="payment-remaining-value">${remainingBalance.toFixed(2)}</span>
              </div>
            )}

            {project.paymentStatus === 'fully_paid' && (
              <div className="payment-complete-message">
                <span className="payment-complete-icon">🎉</span>
                <span className="payment-complete-text">¡Pago completado! Tus archivos están disponibles para descarga.</span>
              </div>
            )}
          </div>

          <div className="payment-invoices">
            <h4>📄 Facturas Emitidas</h4>
            {project.invoices && project.invoices.length > 0 ? (
              <div className="invoices-list">
                {project.invoices.map((invoice, index) => (
                  <div key={index} className="invoice-item">
                    <div className="invoice-icon">
                      {invoice.type === 'deposit' ? '📥' : '📤'}
                    </div>
                    <div className="invoice-details">
                      <div className="invoice-header-row">
                        <span className="invoice-number">#{invoice.invoiceNumber}</span>
                        <span className={`invoice-type ${invoice.type === 'deposit' ? 'deposit' : 'final'}`}>
                          {invoice.type === 'deposit' ? 'Anticipo' : 'Pago Final'}
                        </span>
                      </div>
                      <div className="invoice-info-row">
                        <span className="invoice-amount">
                          {formatCurrency(invoice.amount, invoice.currency)}
                        </span>
                        <span className="invoice-method">
                          {getPaymentMethodName(invoice.paymentMethod)}
                        </span>
                      </div>
                      <div className="invoice-meta-row">
                        <span className="invoice-date">
                          📅 {new Date(invoice.paidAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                        {invoice.transactionId && (
                          <span className="invoice-transaction">
                            ID: {invoice.transactionId}
                          </span>
                        )}
                      </div>
                      {invoice.notes && (
                        <div className="invoice-notes">
                          💭 {invoice.notes}
                        </div>
                      )}
                    </div>
                    <button 
                    className="btn-download-invoice"
                    onClick={() => handleDownloadInvoice(invoice.invoiceNumber)}
                    >
                      📥 Descargar
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>No hay facturas emitidas aún</p>
                <small>Las facturas aparecerán aquí cuando se registren los pagos</small>
              </div>
            )}
          </div>
        </div>

        <div className="progress-card">
          <div className="progress-header">
            <h3>📊 Progreso del Proyecto</h3>
            <span className="progress-percentage">{project.progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${project.progress}%`,
                background: project.progress === 100 
                  ? 'linear-gradient(90deg, #10b981, #059669)' 
                  : 'linear-gradient(90deg, #3b82f6, #8b5cf6)'
              }}
            >
              {project.progress > 10 && (
                <span className="progress-text">{project.progress}%</span>
              )}
            </div>
          </div>
          <div className="progress-milestones">
            <div className={`milestone ${project.progress >= 0 ? 'active' : ''}`}>
              <div className="milestone-dot"></div>
              <span>Iniciado</span>
            </div>
            <div className={`milestone ${project.progress >= 25 ? 'active' : ''}`}>
              <div className="milestone-dot"></div>
              <span>25%</span>
            </div>
            <div className={`milestone ${project.progress >= 50 ? 'active' : ''}`}>
              <div className="milestone-dot"></div>
              <span>50%</span>
            </div>
            <div className={`milestone ${project.progress >= 75 ? 'active' : ''}`}>
              <div className="milestone-dot"></div>
              <span>75%</span>
            </div>
            <div className={`milestone ${project.progress >= 100 ? 'active' : ''}`}>
              <div className="milestone-dot"></div>
              <span>Completado</span>
            </div>
          </div>
        </div>

        <div className="updates-card">
          <h3>💬 Conversación del Proyecto</h3>
          {project.updates && project.updates.length > 0 ? (
            <div className="updates-list">
              {project.updates.slice().reverse().map((update, index) => (
                <div key={index} className={`update-item ${update.author === 'client' ? 'client-comment' : ''}`}>
                  <div className="update-avatar">
                    {update.author === 'admin' ? '👨‍💼' : '👤'}
                  </div>
                  <div className="update-content">
                    <div className="update-header">
                      <span className="update-author">
                        {update.author === 'admin' ? 'Gabriel' : 'Tú'}
                      </span>
                      <span className="update-date">
                        {new Date(update.createdAt).toLocaleString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="update-message">{update.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">💭</div>
              <p>No hay mensajes aún</p>
              <small>Escribe tu primer comentario abajo</small>
            </div>
          )}

          <form onSubmit={handleSendComment} className="comment-form">
            <div className="comment-input-container">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe tus comentarios, sugerencias o preguntas sobre el proyecto..."
                rows="3"
                disabled={sendingComment}
              />
            </div>
            <button 
              type="submit" 
              className="btn-send-comment"
              disabled={sendingComment || !newComment.trim()}
            >
              {sendingComment ? 'Enviando...' : '💬 Enviar Comentario'}
            </button>
          </form>
        </div>

        <div className="files-card">
          <h3>📎 Archivos Compartidos</h3>
          {/* 🆕 MENSAJE DE PROTECCIÓN ACTUALIZADO */}
          {project.paymentStatus !== 'fully_paid' ? (
            <div className="files-protection-notice">
              <span className="protection-icon">🔒</span>
              <div className="protection-text">
                <p className="protection-title">Archivos Protegidos</p>
                <p className="protection-message">
                  Los archivos estarán disponibles para descargar después de completar el pago final
                </p>
              </div>
            </div>
          ) : (
            <div className="files-unlock-notice">
              <span className="unlock-icon">🎉</span>
              <div className="unlock-text">
                <p className="unlock-title">¡Archivos Desbloqueados!</p>
                <p className="unlock-message">
                  Ya puedes descargar todos tus archivos
                </p>
              </div>
            </div>
          )}
          
          {project.files && project.files.length > 0 ? (
            <div className="files-grid">
              {project.files.map((file, index) => (
                <div key={index} className="file-card">
                  <div className="file-icon-large">
                    {file.name.endsWith('.pdf') && '📄'}
                    {(file.name.endsWith('.jpg') || file.name.endsWith('.jpeg')) && '🖼️'}
                    {file.name.endsWith('.png') && '🖼️'}
                    {file.name.endsWith('.zip') && '🗜️'}
                    {file.name.endsWith('.ai') && '🎨'}
                    {file.name.endsWith('.psd') && '🎨'}
                    {!file.name.match(/\.(pdf|jpg|jpeg|png|zip|ai|psd)$/) && '📄'}
                  </div>
                  <div className="file-info">
                    <span className="file-name">{file.name}</span>
                    <span className="file-meta">
                      Subido el {new Date(file.uploadedAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="file-actions">
                    <button 
                      onClick={() => handlePreviewFile(file)}
                      className="btn-preview"
                    >
                      <span>👁️</span> Vista Previa
                    </button>
                    {/* 🆕 BOTÓN DE DESCARGA CON PROTECCIÓN */}
                    <button 
                      onClick={() => handleDownloadFile(file)}
                      className={`btn-download ${project.paymentStatus !== 'fully_paid' ? 'locked' : ''}`}
                      disabled={project.paymentStatus !== 'fully_paid'}
                      title={project.paymentStatus !== 'fully_paid' ? 'Completa el pago para descargar' : 'Descargar archivo'}
                    >
                      {project.paymentStatus !== 'fully_paid' ? (
                        <>
                          <span>🔒</span> Bloqueado
                        </>
                      ) : (
                        <>
                          <span>📥</span> Descargar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📁</div>
              <p>No hay archivos compartidos aún</p>
              <small>Los archivos que Gabriel comparta aparecerán aquí</small>
            </div>
          )}
        </div>
      </div>

      {previewFile && (
        <div className="modal-overlay" onClick={() => setPreviewFile(null)}>
          <div className="modal-preview" onClick={(e) => e.stopPropagation()}>
            <div className="modal-preview-header">
              <h3>Vista Previa: {previewFile.name}</h3>
              <button 
                className="modal-close"
                onClick={() => setPreviewFile(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-preview-body">
              <img 
                src={previewFile.url} 
                alt={previewFile.name}
                className="preview-image"
              />
            </div>
            <div className="modal-preview-footer">
              {/* 🆕 WATERMARK ACTUALIZADO SEGÚN ESTADO DE PAGO */}
              <div className="preview-watermark">
                {project.paymentStatus !== 'fully_paid' ? (
                  <>🔒 Archivo protegido - Disponible después del pago</>
                ) : (
                  <>✅ Archivo disponible para descarga</>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;