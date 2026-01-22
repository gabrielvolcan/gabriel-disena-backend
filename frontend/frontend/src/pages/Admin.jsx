import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import io from 'socket.io-client';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [administrators, setAdministrators] = useState([]);
  const [activeTab, setActiveTab] = useState('projects');
  const [loading, setLoading] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [notification, setNotification] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [adminComment, setAdminComment] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState('');

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    projectId: '',
    paymentType: '',
    paymentMethod: 'bank_transfer',
    currency: 'USD',
    transactionId: '', 

    notes: ''
  });

  const [newProject, setNewProject] = useState({
    userId: '',
    title: '',
    description: '',
    type: 'logo',
    plan: 'basico',
    price: '',
    status: 'pendiente'
  });

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    country: 'peru'
  });

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const [updateData, setUpdateData] = useState({
    status: '',
    progress: '',
    message: '',
    file: null
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token || (userRole !== 'admin' && userRole !== 'superadmin')) {
      navigate('/login');
      return;
    }

    setCurrentUserRole(userRole);

    const newSocket = io('https://gabriel-disena-backend.onrender.com', {
      auth: { token }
    });

    setSocket(newSocket);
    fetchProjects();
    fetchUsers();
    
    if (userRole === 'superadmin') {
      fetchAdministrators();
    }

    return () => newSocket.close();
  }, [navigate]);

  useEffect(() => {
    if (!socket) return;

    projects.forEach(project => {
      socket.emit('join-project', project._id);
    });

    socket.on('newComment', (data) => {
      if (data.comment.author === 'client') {
        if (selectedProject && selectedProject._id === data.projectId) {
          setSelectedProject(prev => ({
            ...prev,
            updates: [...(prev.updates || []), data.comment]
          }));
        }

        setProjects(prevProjects => prevProjects.map(p => {
          if (p._id === data.projectId) {
            return {
              ...p,
              updates: [...(p.updates || []), data.comment]
            };
          }
          return p;
        }));

        showNotification('💬 Nuevo comentario del cliente', 'info');
      }
    });

    return () => {
      socket.off('newComment');
    };
  }, [socket, selectedProject, projects]);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://gabriel-disena-backend.onrender.com/api/admin/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setProjects(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      showNotification('Error al cargar proyectos', 'error');
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://gabriel-disena-backend.onrender.com/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAdministrators = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://gabriel-disena-backend.onrender.com/api/admin/administrators', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAdministrators(data);
      }
    } catch (error) {
      console.error('Error fetching administrators:', error);
    }
  };

  const getCurrencyByCountry = (country) => {
    const currencyMap = {
      'peru': 'PEN',
      'chile': 'CLP',
      'argentina': 'ARS',
      'uruguay': 'UYU',
      'venezuela': 'VES',
      'mexico': 'MXN',
      'colombia': 'COP',
      'brasil': 'BRL',
      'internacional': 'USD'
    };
    return currencyMap[country?.toLowerCase()] || 'USD';
  };

  const openPaymentModal = (project, paymentType) => {
    const currency = getCurrencyByCountry(project.userId?.country);
    
    setPaymentData({
      projectId: project._id,
      paymentType: paymentType,
      paymentMethod: 'bank_transfer',
      currency: currency,
      transactionId: '',
      notes: ''
    });
    
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentData({
      projectId: '',
      paymentType: '',
      paymentMethod: 'bank_transfer',
      currency: 'USD',
      transactionId: '',
      notes: ''
    });
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const endpoint = paymentData.paymentType === 'deposit' ? 'deposit' : 'final';
      
      const response = await fetch(`https://gabriel-disena-backend.onrender.com/api/payments/${endpoint}/${paymentData.projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentMethod: paymentData.paymentMethod,
          currency: paymentData.currency,
          transactionId: paymentData.transactionId,
          notes: paymentData.notes
        })
      });

      const data = await response.json();

      if (response.ok) {
        showNotification(
          `✅ Pago ${paymentData.paymentType === 'deposit' ? 'de anticipo' : 'final'} registrado exitosamente`,
          'success'
        );
        
        setSelectedProject(data.project);
        fetchProjects();

        if (socket) {
          socket.emit('paymentRegistered', {
            projectId: paymentData.projectId,
            paymentType: paymentData.paymentType,
            paymentStatus: data.project.paymentStatus,
            totalPaid: data.project.totalPaid,
            invoices: data.project.invoices,
            invoiceType: paymentData.paymentType,
            clientId: data.project.userId._id || data.project.userId
          });
        }

        closePaymentModal();
      } else {
        showNotification(data.message || 'Error al registrar pago', 'error');
      }
    } catch (error) {
      console.error('Error registrando pago:', error);
      showNotification('Error al registrar pago', 'error');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://gabriel-disena-backend.onrender.com/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('Cliente creado exitosamente', 'success');
        setNewUser({ name: '', email: '', password: '', phone: '', country: 'peru' });
        setShowCreateUser(false);
        fetchUsers();
      } else {
        showNotification(data.message || 'Error al crear cliente', 'error');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      showNotification('Error al crear cliente', 'error');
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://gabriel-disena-backend.onrender.com/api/admin/administrators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAdmin)
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('Administrador creado exitosamente', 'success');
        setNewAdmin({ name: '', email: '', password: '', phone: '' });
        setShowCreateAdmin(false);
        fetchAdministrators();
      } else {
        showNotification(data.message || 'Error al crear administrador', 'error');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      showNotification('Error al crear administrador', 'error');
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm('¿Estás seguro de eliminar este administrador?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://gabriel-disena-backend.onrender.com/api/admin/administrators/${adminId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('Administrador eliminado', 'success');
        fetchAdministrators();
      } else {
        showNotification(data.message || 'Error al eliminar administrador', 'error');
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      showNotification('Error al eliminar administrador', 'error');
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    if (!newProject.userId) {
      showNotification('Debes seleccionar un cliente', 'error');
      return;
    }
    
    if (!newProject.title || newProject.title.trim() === '') {
      showNotification('El título es obligatorio', 'error');
      return;
    }
    
    if (!newProject.description || newProject.description.trim() === '') {
      showNotification('La descripción es obligatoria', 'error');
      return;
    }

    if (!newProject.price || newProject.price === '') {
      showNotification('El precio es obligatorio', 'error');
      return;
    }
    
    const priceValue = parseFloat(newProject.price);
    if (isNaN(priceValue) || priceValue < 0) {
      showNotification('El precio debe ser un número válido', 'error');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      const projectData = {
        userId: newProject.userId,
        title: newProject.title.trim(),
        description: newProject.description.trim(),
        type: newProject.type,
        plan: newProject.plan,
        price: priceValue,
        status: newProject.status
      };
      
      const response = await fetch('https://gabriel-disena-backend.onrender.com/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('Proyecto creado exitosamente', 'success');
        
        setNewProject({
          userId: '',
          title: '',
          description: '',
          type: 'logo',
          plan: 'basico',
          price: '',
          status: 'pendiente'
        });
        
        setShowCreateProject(false);
        fetchProjects();
        
        if (socket) {
          socket.emit('projectCreated', { 
            projectId: data._id, 
            userId: projectData.userId 
          });
        }
      } else {
        showNotification(data.message || 'Error al crear proyecto', 'error');
      }
    } catch (error) {
      showNotification('Error de conexión', 'error');
    }
  };

  const handleUpdateProject = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      
      const updatePayload = {};
      
      if (updateData.status) updatePayload.status = updateData.status;
      if (updateData.progress !== '' && updateData.progress !== null) {
        updatePayload.progress = parseInt(updateData.progress) || 0;
      }
      if (updateData.message && updateData.message.trim()) {
        updatePayload.message = updateData.message.trim();
      }

      const response = await fetch(`https://gabriel-disena-backend.onrender.com/api/admin/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload)
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('Proyecto actualizado exitosamente', 'success');
        fetchProjects();
        
        setSelectedProject(data);
        setUpdateData({ status: '', progress: '', message: '', file: null });
        
        if (socket) {
          socket.emit('projectUpdated', { 
            projectId, 
            userId: data.userId?._id || data.userId,
            update: data 
          });
        }
      } else {
        showNotification(data.message || 'Error al actualizar proyecto', 'error');
      }
    } catch (error) {
      showNotification('Error al actualizar proyecto', 'error');
    }
  };

  const handleSendAdminComment = async (e) => {
    e.preventDefault();
    
    if (!adminComment.trim()) return;

    setSendingComment(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://gabriel-disena-backend.onrender.com/api/projects/${selectedProject._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: adminComment.trim(),
          author: 'admin'
        })
      });

      if (response.ok) {
        const newComment = {
          message: adminComment.trim(),
          author: 'admin',
          createdAt: new Date()
        };
        
        setSelectedProject(prev => ({
          ...prev,
          updates: [...(prev.updates || []), newComment]
        }));

        if (socket) {
          socket.emit('commentSent', {
            projectId: selectedProject._id,
            comment: newComment
          });
        }

        setAdminComment('');
        showNotification('✅ Respuesta enviada', 'success');
      } else {
        showNotification('❌ Error al enviar respuesta', 'error');
      }
    } catch (error) {
      showNotification('❌ Error al enviar respuesta', 'error');
    } finally {
      setSendingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('¿Estás seguro de eliminar este comentario?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://gabriel-disena-backend.onrender.com/api/projects/${selectedProject._id}/comment/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        
        setSelectedProject(data.project);
        
        setProjects(projects.map(p => 
          p._id === data.project._id ? data.project : p
        ));

        if (socket) {
          socket.emit('commentDeleted', {
            projectId: selectedProject._id,
            commentId: commentId
          });
        }

        showNotification('🗑️ Comentario eliminado', 'success');
      } else {
        showNotification('❌ Error al eliminar comentario', 'error');
      }
    } catch (error) {
      showNotification('❌ Error al eliminar comentario', 'error');
    }
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      'pending_deposit': '#f59e0b',
      'deposit_paid': '#3b82f6',
      'pending_final': '#8b5cf6',
      'fully_paid': '#10b981'
    };
    return colors[status] || '#94a3b8';
  };

  const getPaymentStatusText = (status) => {
    const texts = {
      'pending_deposit': '⏳ Esperando Anticipo (50%)',
      'deposit_paid': '✅ Anticipo Pagado - Pendiente Saldo',
      'pending_final': '⏳ Esperando Pago Final (50%)',
      'fully_paid': '🎉 Pago Completo'
    };
    return texts[status] || '⏳ Esperando Anticipo (50%)';
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`https://gabriel-disena-backend.onrender.com/api/projects/${selectedProject._id}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        
        setSelectedProject(data.project);
        
        setProjects(projects.map(p => 
          p._id === data.project._id ? data.project : p
        ));

        if (socket) {
          socket.emit('fileUploaded', {
            projectId: selectedProject._id,
            file: data.file
          });
        }

        showNotification('✅ Archivo subido exitosamente', 'success');
        e.target.value = '';
      } else {
        const error = await response.json();
        showNotification(`❌ Error: ${error.message}`, 'error');
      }
    } catch (error) {
      showNotification('❌ Error al subir archivo', 'error');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('¿Estás seguro de eliminar este proyecto?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://gabriel-disena-backend.onrender.com/api/admin/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        showNotification('Proyecto eliminado', 'success');
        fetchProjects();
      }
    } catch (error) {
      showNotification('Error al eliminar proyecto', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://gabriel-disena-backend.onrender.com/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        showNotification('Usuario eliminado', 'success');
        fetchUsers();
      }
    } catch (error) {
      showNotification('Error al eliminar usuario', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
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

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Cargando panel admin...</p>
      </div>
    );
  }
return (
    <div className="admin-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <header className="admin-header">
        <div className="admin-header-content">
          <h1>Panel Administrativo</h1>
          <div className="admin-header-actions">
            <Link to="/analytics" style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              display: 'inline-block'
            }}>
              📊 Analytics
            </Link>
            <span className="admin-welcome">
              Hola, Gabriel {currentUserRole === 'superadmin' && '(Super Admin)'}
            </span>
            <button onClick={handleLogout} className="btn-logout">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            📊
          </div>
          <div className="stat-info">
            <h3>{projects.length}</h3>
            <p>Proyectos Totales</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #ec4899)' }}>
            ⏳
          </div>
          <div className="stat-info">
            <h3>{projects.filter(p => p.status === 'en-progreso').length}</h3>
            <p>En Progreso</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}>
            ✅
          </div>
          <div className="stat-info">
            <h3>{projects.filter(p => p.status === 'completado').length}</h3>
            <p>Completados</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
            👥
          </div>
          <div className="stat-info">
            <h3>{users.length}</h3>
            <p>Clientes</p>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Proyectos
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Clientes
        </button>
        {currentUserRole === 'superadmin' && (
          <button 
            className={`tab ${activeTab === 'administrators' ? 'active' : ''}`}
            onClick={() => setActiveTab('administrators')}
          >
            👨‍💼 Administradores
          </button>
        )}
      </div>

      <div className="admin-content">
        {/* TAB PROYECTOS */}
        {activeTab === 'projects' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Gestión de Proyectos</h2>
              <button 
                className="btn-primary"
                onClick={() => setShowCreateProject(!showCreateProject)}
              >
                + Nuevo Proyecto
              </button>
            </div>

            {showCreateProject && (
              <div className="form-card">
                <h3>Crear Nuevo Proyecto</h3>
                <form onSubmit={handleCreateProject}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Cliente *</label>
                      <select
                        value={newProject.userId}
                        onChange={(e) => setNewProject({...newProject, userId: e.target.value})}
                        required
                      >
                        <option value="">Seleccionar cliente</option>
                        {users.map(user => (
                          <option key={user._id} value={user._id}>
                            {user.name} - {user.email}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Título del Proyecto *</label>
                      <input
                        type="text"
                        value={newProject.title}
                        onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                        placeholder="Ej: Logo para Cafetería"
                        required
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Descripción *</label>
                      <textarea
                        value={newProject.description}
                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                        placeholder="Describe el proyecto..."
                        rows="3"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Tipo</label>
                      <select
                        value={newProject.type}
                        onChange={(e) => setNewProject({...newProject, type: e.target.value})}
                      >
                        <option value="logo">Logo</option>
                        <option value="web">Sitio Web</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Plan</label>
                      <select
                        value={newProject.plan}
                        onChange={(e) => setNewProject({...newProject, plan: e.target.value})}
                      >
                        <option value="basico">Básico</option>
                        <option value="standard">Standard</option>
                        <option value="premium">Premium</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Precio *</label>
                      <input
                        type="number"
                        value={newProject.price}
                        onChange={(e) => setNewProject({...newProject, price: e.target.value})}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Estado Inicial</label>
                      <select
                        value={newProject.status}
                        onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en-progreso">En Progreso</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      Crear Proyecto
                    </button>
                    <button 
                      type="button" 
                      className="btn-secondary"
                      onClick={() => setShowCreateProject(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="projects-grid">
              {projects.map(project => (
                <div key={project._id} className="project-card-admin">
                  <div className="project-header">
                    <div>
                      <h3>{project.title}</h3>
                      <p className="project-client">
                        Cliente: {project.userId?.name || 'Sin asignar'}
                      </p>
                    </div>
                    <span 
                      className="status-badge"
                      style={{ background: getStatusColor(project.status) }}
                    >
                      {getStatusText(project.status)}
                    </span>
                  </div>

                  <div className="project-info">
                    <p><strong>Tipo:</strong> {project.type === 'logo' ? 'Logo' : 'Sitio Web'}</p>
                    <p><strong>Plan:</strong> {project.plan}</p>
                    <p><strong>Precio:</strong> ${project.price}</p>
                    <p><strong>Progreso:</strong> {project.progress}%</p>
                  </div>

                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${project.progress}%`,
                        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)'
                      }}
                    />
                  </div>

                  <div className="project-actions">
                    <button 
                      className="btn-edit"
                      onClick={() => setSelectedProject(project)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteProject(project._id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {projects.length === 0 && (
              <div className="empty-state">
                <p>No hay proyectos aún. Crea el primero!</p>
              </div>
            )}
          </div>
        )}

        {/* TAB CLIENTES */}
        {activeTab === 'users' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Gestión de Clientes</h2>
              <button 
                className="btn-primary"
                onClick={() => setShowCreateUser(!showCreateUser)}
              >
                + Nuevo Cliente
              </button>
            </div>

            {showCreateUser && (
              <div className="form-card">
                <h3>Crear Nuevo Cliente</h3>
                <form onSubmit={handleCreateUser}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nombre Completo *</label>
                      <input
                        type="text"
                        value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        placeholder="Juan Pérez"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        placeholder="juan@example.com"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Contraseña *</label>
                      <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        placeholder="Mínimo 6 caracteres"
                        minLength="6"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Teléfono</label>
                      <input
                        type="tel"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                        placeholder="+51 999 999 999"
                      />
                    </div>

                    <div className="form-group">
                      <label>País</label>
                      <select
                        value={newUser.country}
                        onChange={(e) => setNewUser({...newUser, country: e.target.value})}
                      >
                        <option value="peru">Perú</option>
                        <option value="chile">Chile</option>
                        <option value="argentina">Argentina</option>
                        <option value="uruguay">Uruguay</option>
                        <option value="venezuela">Venezuela</option>
                        <option value="internacional">Internacional</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      Crear Cliente
                    </button>
                    <button 
                      type="button" 
                      className="btn-secondary"
                      onClick={() => setShowCreateUser(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="users-grid">
              {users.map(user => (
                <div key={user._id} className="user-card">
                  <div className="user-header">
                    <div className="user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <h3>{user.name}</h3>
                      <p>{user.email}</p>
                    </div>
                  </div>

                  <div className="user-details">
                    <p><strong>Teléfono:</strong> {user.phone || 'No registrado'}</p>
                    <p><strong>País:</strong> {user.country || 'No especificado'}</p>
                    <p><strong>Proyectos:</strong> {projects.filter(p => p.userId?._id === user._id).length}</p>
                    <p><strong>Creado:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="user-actions">
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {users.length === 0 && (
              <div className="empty-state">
                <p>No hay clientes registrados aún.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB ADMINISTRADORES */}
        {activeTab === 'administrators' && currentUserRole === 'superadmin' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>👨‍💼 Gestión de Administradores</h2>
              <button 
                className="btn-primary"
                onClick={() => setShowCreateAdmin(!showCreateAdmin)}
              >
                + Nuevo Administrador
              </button>
            </div>

            {showCreateAdmin && (
              <div className="form-card">
                <h3>Crear Nuevo Administrador</h3>
                <form onSubmit={handleCreateAdmin}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nombre Completo *</label>
                      <input
                        type="text"
                        value={newAdmin.name}
                        onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                        placeholder="Juan Pérez"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                        placeholder="admin@example.com"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Contraseña *</label>
                      <input
                        type="password"
                        value={newAdmin.password}
                        onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                        placeholder="Mínimo 6 caracteres"
                        minLength="6"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Teléfono</label>
                      <input
                        type="tel"
                        value={newAdmin.phone}
                        onChange={(e) => setNewAdmin({...newAdmin, phone: e.target.value})}
                        placeholder="+51 999 999 999"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      Crear Administrador
                    </button>
                    <button 
                      type="button" 
                      className="btn-secondary"
                      onClick={() => setShowCreateAdmin(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="users-grid">
              {administrators.map(admin => (
                <div key={admin._id} className="user-card admin-card">
                  <div className="user-header">
                    <div className="user-avatar" style={{
                      background: admin.role === 'superadmin' 
                        ? 'linear-gradient(135deg, #f59e0b, #ec4899)' 
                        : 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                    }}>
                      {admin.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <h3>
                        {admin.name}
                        {admin.role === 'superadmin' && (
                          <span style={{ 
                            marginLeft: '8px', 
                            fontSize: '12px', 
                            background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            color: 'white'
                          }}>
                            SUPER ADMIN
                          </span>
                        )}
                      </h3>
                      <p>{admin.email}</p>
                    </div>
                  </div>

                  <div className="user-details">
                    <p><strong>Rol:</strong> {admin.role === 'superadmin' ? 'Super Administrador' : 'Administrador'}</p>
                    <p><strong>Teléfono:</strong> {admin.phone || 'No registrado'}</p>
                    <p><strong>Creado:</strong> {new Date(admin.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="user-actions">
                    {admin.createdBy && (
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteAdmin(admin._id)}
                      >
                        Eliminar
                      </button>
                    )}
                    {!admin.createdBy && (
                      <div style={{ 
                        padding: '8px', 
                        background: 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '6px',
                        textAlign: 'center',
                        fontSize: '12px',
                        color: '#f59e0b'
                      }}>
                        🔒 Protegido
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {administrators.length === 0 && (
              <div className="empty-state">
                <p>No hay administradores registrados aún.</p>
              </div>
            )}
          </div>
        )}
      </div>
      {/* MODAL DE CONVERSACIÓN Y ACTUALIZACIÓN DE PROYECTO */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💬 Conversación del Proyecto</h2>
              <button 
                className="modal-close"
                onClick={() => setSelectedProject(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body-conversation">
              {/* Sección de conversación */}
              <div className="conversation-section">
                <div className="conversation-header-info">
                  <h3>{selectedProject.title}</h3>
                  <p>Cliente: {selectedProject.userId?.name}</p>
                </div>

                <div className="conversation-messages">
                  {selectedProject.updates && selectedProject.updates.length > 0 ? (
                    selectedProject.updates.slice().reverse().map((update, index) => (
                      <div key={index} className={`message-bubble ${update.author === 'client' ? 'client-bubble' : 'admin-bubble'}`}>
                        <div className="message-header-row">
                          <div className="message-author">
                            {update.author === 'admin' ? 'Tú (Gabriel)' : selectedProject.userId?.name || 'Cliente'}
                          </div>
                          {update.author === 'admin' && (
                            <button 
                              className="btn-delete-comment"
                              onClick={() => handleDeleteComment(update._id)}
                              title="Eliminar comentario"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                        <div className="message-text">{update.message}</div>
                        <div className="message-time">
                          {new Date(update.createdAt).toLocaleString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="conversation-empty">
                      <p>💭 No hay mensajes aún</p>
                      <small>Comienza la conversación con tu cliente</small>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendAdminComment} className="conversation-input">
                  <textarea
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    placeholder="Escribe tu respuesta al cliente..."
                    rows="3"
                    disabled={sendingComment}
                  />
                  <button 
                    type="submit" 
                    className="btn-send"
                    disabled={sendingComment || !adminComment.trim()}
                  >
                    {sendingComment ? 'Enviando...' : '💬 Enviar Respuesta'}
                  </button>
                </form>
              </div>

              {/* Sección de actualización de proyecto */}
              <div className="project-update-section">
                <h4>⚙️ Actualizar Proyecto</h4>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateProject(selectedProject._id);
                }}>
                  <div className="form-group">
                    <label>Estado del Proyecto</label>
                    <select
                      value={updateData.status || selectedProject.status}
                      onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                    >
                      <option value="">No cambiar</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="en-progreso">En Progreso</option>
                      <option value="revision">En Revisión</option>
                      <option value="completado">Completado</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Progreso (%)</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={updateData.progress !== '' ? updateData.progress : selectedProject.progress}
                      onChange={(e) => setUpdateData({...updateData, progress: e.target.value})}
                    />
                    <span className="progress-value">
                      {updateData.progress !== '' ? updateData.progress : selectedProject.progress}%
                    </span>
                  </div>

                  <div className="form-group">
                    <label>Mensaje/Actualización</label>
                    <textarea
                      value={updateData.message}
                      onChange={(e) => setUpdateData({...updateData, message: e.target.value})}
                      placeholder="Escribe una actualización para el cliente..."
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label>📎 Subir Archivo al Proyecto</label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif,.pdf,.zip,.ai,.psd"
                      onChange={handleFileUpload}
                      className="file-input"
                    />
                    <small style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginTop: '8px' }}>
                      Formatos: JPG, PNG, GIF, PDF, ZIP, AI, PSD (Max 50MB)
                    </small>
                  </div>

                  {uploadingFile && (
                    <div className="upload-progress">
                      <div className="spinner-small"></div>
                      <span>Subiendo archivo...</span>
                    </div>
                  )}

                  {selectedProject.files && selectedProject.files.length > 0 && (
                    <div className="current-files">
                      <label>Archivos en el proyecto:</label>
                      <div className="files-list">
                        {selectedProject.files.map((file, index) => (
                          <div key={index} className="file-item-small">
                            <span>📎 {file.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button type="submit" className="btn-update-project">
                    Actualizar Proyecto
                  </button>
                </form>

                {/* SECCIÓN DE PAGOS */}
                <div className="payment-management-section">
                  <h4>💰 Gestión de Pagos</h4>
                  
                  {/* Resumen de Pagos */}
                  <div className="payment-summary">
                    <div className="payment-summary-item">
                      <span className="payment-label">Precio Total:</span>
                      <span className="payment-value">${selectedProject.price}</span>
                    </div>
                    <div className="payment-summary-item">
                      <span className="payment-label">Anticipo (50%):</span>
                      <span className="payment-value">${selectedProject.depositAmount || (selectedProject.price * 0.5)}</span>
                    </div>
                    <div className="payment-summary-item">
                      <span className="payment-label">Saldo (50%):</span>
                      <span className="payment-value">${selectedProject.finalAmount || (selectedProject.price * 0.5)}</span>
                    </div>
                    <div className="payment-summary-item highlight">
                      <span className="payment-label">Total Pagado:</span>
                      <span className="payment-value">${selectedProject.totalPaid || 0}</span>
                    </div>
                  </div>

                  {/* Estado de Pago */}
                  <div className="payment-status-badge" style={{
                    background: getPaymentStatusColor(selectedProject.paymentStatus),
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    marginBottom: '20px',
                    color: 'white',
                    fontWeight: '600'
                  }}>
                    {getPaymentStatusText(selectedProject.paymentStatus)}
                  </div>

                  {/* Botones de Acción */}
                  <div className="payment-actions">
                    {(!selectedProject.paymentStatus || selectedProject.paymentStatus === 'pending_deposit') && (
                      <button 
                        className="btn-register-payment deposit"
                        onClick={() => openPaymentModal(selectedProject, 'deposit')}
                      >
                        ✅ Registrar Anticipo ($${selectedProject.price * 0.5})
                      </button>
                    )}

                    {(selectedProject.paymentStatus === 'deposit_paid' || selectedProject.paymentStatus === 'pending_final') && (
                      <button 
                        className="btn-register-payment final"
                        onClick={() => openPaymentModal(selectedProject, 'final')}
                      >
                        ✅ Registrar Pago Final ($${selectedProject.price * 0.5})
                      </button>
                    )}

                    {selectedProject.paymentStatus === 'fully_paid' && (
                      <div className="payment-complete">
                        <span style={{ fontSize: '24px' }}>🎉</span>
                        <p>Pago completo recibido</p>
                      </div>
                    )}
                  </div>

                  {/* Historial de Facturas */}
                  {selectedProject.invoices && selectedProject.invoices.length > 0 && (
                    <div className="invoices-list">
                      <h5>📄 Facturas Emitidas</h5>
                      {selectedProject.invoices.map((invoice, index) => (
                        <div key={index} className="invoice-item">
                          <div className="invoice-info">
                            <strong>{invoice.invoiceNumber}</strong>
                            <span className="invoice-type">
                              {invoice.type === 'deposit' ? '💵 Anticipo' : '💰 Pago Final'}
                            </span>
                          </div>
                          <div className="invoice-details">
                            <span>{invoice.currency} ${invoice.amount}</span>
                            <span className="invoice-date">
                              {new Date(invoice.paidAt).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE REGISTRO DE PAGO */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={closePaymentModal}>
          <div className="modal-content modal-payment" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💰 Registrar Pago</h2>
              <button 
                className="modal-close"
                onClick={closePaymentModal}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="payment-modal-info">
                <p><strong>Proyecto:</strong> {selectedProject?.title}</p>
                <p><strong>Cliente:</strong> {selectedProject?.userId?.name}</p>
                <p><strong>País:</strong> {selectedProject?.userId?.country}</p>
                <p><strong>Tipo de Pago:</strong> {paymentData.paymentType === 'deposit' ? 'Anticipo (50%)' : 'Pago Final (50%)'}</p>
                <p><strong>Monto:</strong> ${selectedProject?.price * 0.5}</p>
              </div>

              <form onSubmit={handleSubmitPayment} className="payment-form">
                <div className="form-group">
                  <label>Método de Pago *</label>
                  <select
                    value={paymentData.paymentMethod}
                    onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
                    required
                  >
                    <option value="bank_transfer">Transferencia Bancaria</option>
                    <option value="zelle">Zelle</option>
                    <option value="paypal">PayPal</option>
                    <option value="binance">Binance</option>
                    <option value="mobile_payment">Pago Móvil</option>
                    <option value="cash">Efectivo</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Moneda *</label>
                  <select
                    value={paymentData.currency}
                    onChange={(e) => setPaymentData({...paymentData, currency: e.target.value})}
                    required
                  >
                    <option value="USD">USD - Dólar Estadounidense</option>
                    <option value="PEN">PEN - Sol Peruano</option>
                    <option value="CLP">CLP - Peso Chileno</option>
                    <option value="ARS">ARS - Peso Argentino</option>
                    <option value="UYU">UYU - Peso Uruguayo</option>
                    <option value="VES">VES - Bolívar Venezolano</option>
                    <option value="MXN">MXN - Peso Mexicano</option>
                    <option value="COP">COP - Peso Colombiano</option>
                    <option value="BRL">BRL - Real Brasileño</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>ID de Transacción</label>
                  <input
                    type="text"
                    value={paymentData.transactionId}
                    onChange={(e) => setPaymentData({...paymentData, transactionId: e.target.value})}
                    placeholder="Ej: TRX123456789"
                  />
                </div>

                <div className="form-group">
                  <label>Notas</label>
                  <textarea
                    value={paymentData.notes}
                    onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
                    placeholder="Información adicional sobre el pago..."
                    rows="3"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    Confirmar Pago
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={closePaymentModal}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;