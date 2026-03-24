import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import io from 'socket.io-client';
import './Admin.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://gabriel-disena-backend.onrender.com';

const Admin = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [administrators, setAdministrators] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
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

  // ── CRM STATE ──────────────────────────────────────────────────
  const [leads, setLeads] = useState([]);
  const [leadStats, setLeadStats] = useState({ total: 0, frio: 0, interesado: 0, potencial: 0, cliente: 0, enviado: 0, no_contactado: 0, cerrado: 0 });
  const [selectedLead, setSelectedLead] = useState(null);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [leadFilter, setLeadFilter] = useState({ status: '', search: '' });
  const [newLead, setNewLead] = useState({ name: '', email: '', phone: '', country: 'otro', service: 'otro', source: 'directo', status: 'frio', notes: '', budget: '', message: '' });
  const [followUpData, setFollowUpData] = useState({ note: '', method: 'whatsapp', date: '' });
  const [showMarketing, setShowMarketing] = useState(false);
  const [marketing, setMarketing] = useState({ subject: '', html: '', targetStatus: '', targetService: '' });
  const [sendingMarketing, setSendingMarketing] = useState(false);
  const [editingLead, setEditingLead] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [importing, setImporting] = useState(false);
  const [checkedLeads, setCheckedLeads] = useState(new Set());
  const [crmPage, setCrmPage] = useState(1);

  const toggleCheckLead = (e, leadId) => {
    e.stopPropagation();
    setCheckedLeads(prev => {
      const next = new Set(prev);
      next.has(leadId) ? next.delete(leadId) : next.add(leadId);
      return next;
    });
  };

  const toggleCheckAll = () => {
    const allIds = leads.map(l => l._id);
    if (checkedLeads.size === leads.length) {
      setCheckedLeads(new Set());
    } else {
      setCheckedLeads(new Set(allIds));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token || (userRole !== 'admin' && userRole !== 'superadmin')) {
      navigate('/login');
      return;
    }

    setCurrentUserRole(userRole);

    const newSocket = io(`${API_URL}`, {
      auth: { token }
    });

    setSocket(newSocket);
    fetchProjects();
    fetchUsers();
    fetchLeads();
    fetchLeadStats();
    
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
      const response = await fetch(`${API_URL}/api/admin/projects`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        if (response.status === 401) navigate('/login');
        setLoading(false);
        return;
      }
      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
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
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) return;
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAdministrators = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/administrators`, {
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
      
      const response = await fetch(`${API_URL}/api/payments/${endpoint}/${paymentData.projectId}`, {
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
      const response = await fetch(`${API_URL}/api/admin/users`, {
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
      const response = await fetch(`${API_URL}/api/admin/administrators`, {
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
      const response = await fetch(`${API_URL}/api/admin/administrators/${adminId}`, {
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
      
      const response = await fetch(`${API_URL}/api/admin/projects`, {
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

      const response = await fetch(`${API_URL}/api/admin/projects/${projectId}`, {
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
      const response = await fetch(`${API_URL}/api/projects/${selectedProject._id}/comment`, {
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
      const response = await fetch(`${API_URL}/api/projects/${selectedProject._id}/comment/${commentId}`, {
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
      const response = await fetch(`${API_URL}/api/projects/${selectedProject._id}/upload`, {
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
      const response = await fetch(`${API_URL}/api/admin/projects/${projectId}`, {
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
      const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
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

  // ── CRM FUNCTIONS ──────────────────────────────────────────────
  const fetchLeads = async (filters = {}) => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      const response = await fetch(`${API_URL}/api/crm?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchLeadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/crm/stats/overview`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLeadStats({
          total: data.total || 0,
          frio: data.frio || 0,
          interesado: data.interesado || 0,
          potencial: data.potencial || 0,
          cliente: data.cliente || 0,
          cerrado: data.cerrado || 0,
          enviado: data.enviado || 0,
          no_contactado: data.no_contactado || 0
        });
      }
    } catch (error) {
      console.error('Error fetching lead stats:', error);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    if (!newLead.name.trim()) { showNotification('El nombre es obligatorio', 'error'); return; }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/crm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newLead)
      });
      if (response.ok) {
        showNotification('✅ Lead creado exitosamente', 'success');
        setNewLead({ name: '', email: '', phone: '', country: 'otro', service: 'otro', source: 'directo', status: 'frio', notes: '', budget: '', message: '' });
        setShowCreateLead(false);
        fetchLeads(leadFilter);
        fetchLeadStats();
      } else {
        const data = await response.json();
        showNotification(data.message || 'Error al crear lead', 'error');
      }
    } catch { showNotification('Error de conexión', 'error'); }
  };

  const handleUpdateLeadStatus = async (leadId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/crm/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        const updated = await response.json();
        setLeads(prev => prev.map(l => l._id === leadId ? updated : l));
        if (selectedLead?._id === leadId) setSelectedLead(updated);
        showNotification(updated.status === 'cliente' ? '✅ Lead convertido a cliente' : 'Estado actualizado', 'success');
        fetchLeadStats();
      }
    } catch { showNotification('Error al actualizar', 'error'); }
  };

  const handleSaveLeadEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/crm/${selectedLead._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(selectedLead)
      });
      if (response.ok) {
        const updated = await response.json();
        setLeads(prev => prev.map(l => l._id === updated._id ? updated : l));
        setSelectedLead(updated);
        setEditingLead(false);
        showNotification('✅ Lead actualizado', 'success');
        fetchLeadStats();
      }
    } catch { showNotification('Error al actualizar', 'error'); }
  };

  const handleDeleteSelected = async () => {
    if (checkedLeads.size === 0) return;
    if (!window.confirm(`¿Eliminar ${checkedLeads.size} lead${checkedLeads.size !== 1 ? 's' : ''}? Esta acción no se puede deshacer.`)) return;
    const token = localStorage.getItem('token');
    const ids = Array.from(checkedLeads);
    const res = await fetch(`${API_URL}/api/crm/bulk/selected`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ ids })
    });
    const data = await res.json();
    if (res.ok) {
      setLeads(prev => prev.filter(l => !checkedLeads.has(l._id)));
      if (selectedLead && checkedLeads.has(selectedLead._id)) setSelectedLead(null);
      setCheckedLeads(new Set());
      showNotification(`✅ ${data.deleted} lead${data.deleted !== 1 ? 's' : ''} eliminado${data.deleted !== 1 ? 's' : ''}`, 'success');
      fetchLeadStats();
    } else {
      showNotification(data.message || 'Error al eliminar', 'error');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm(`⚠️ ¿Eliminar TODA la base de datos de leads? Esta acción borrará todos los registros y NO se puede deshacer.`)) return;
    if (!window.confirm(`¿Estás seguro? Se eliminarán ${leadStats.total} leads permanentemente.`)) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/crm/bulk/all`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) {
      setLeads([]);
      setSelectedLead(null);
      setCheckedLeads(new Set());
      showNotification(`✅ ${data.deleted} leads eliminados`, 'success');
      fetchLeadStats();
    } else {
      showNotification(data.message || 'Error al eliminar', 'error');
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('¿Eliminar este lead?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/crm/${leadId}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
      });
      setLeads(prev => prev.filter(l => l._id !== leadId));
      if (selectedLead?._id === leadId) setSelectedLead(null);
      showNotification('Lead eliminado', 'success');
      fetchLeadStats();
    } catch { showNotification('Error al eliminar', 'error'); }
  };

  const handleAddFollowUp = async (e) => {
    e.preventDefault();
    if (!followUpData.note.trim()) { showNotification('La nota es obligatoria', 'error'); return; }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/crm/${selectedLead._id}/followup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(followUpData)
      });
      if (response.ok) {
        const updated = await response.json();
        setSelectedLead(updated);
        setLeads(prev => prev.map(l => l._id === updated._id ? updated : l));
        setFollowUpData({ note: '', method: 'whatsapp', date: '' });
        showNotification('✅ Seguimiento agregado', 'success');
      }
    } catch { showNotification('Error al agregar seguimiento', 'error'); }
  };

  const handleDeleteFollowUp = async (followUpId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/crm/${selectedLead._id}/followup/${followUpId}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const updated = await response.json();
        setSelectedLead(updated);
        setLeads(prev => prev.map(l => l._id === updated._id ? updated : l));
      }
    } catch { showNotification('Error al eliminar seguimiento', 'error'); }
  };

  const handleSendMarketing = async (e) => {
    e.preventDefault();
    if (!marketing.subject.trim() || !marketing.html.trim()) {
      showNotification('Asunto y contenido son obligatorios', 'error'); return;
    }
    setSendingMarketing(true);
    try {
      const token = localStorage.getItem('token');
      const customEmails = checkedLeads.size > 0
        ? leads.filter(l => checkedLeads.has(l._id) && l.email).map(l => ({ email: l.email, name: l.name }))
        : [];
      const response = await fetch(`${API_URL}/api/crm/marketing/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...marketing, customEmails })
      });
      const data = await response.json();
      if (response.ok) {
        showNotification(`✅ ${data.message}`, 'success');
        setShowMarketing(false);
        setMarketing({ subject: '', html: '', targetStatus: '', targetService: '' });
        setCheckedLeads(new Set());
        // Recargar lista y stats para reflejar el nuevo estado "enviado"
        fetchLeads(leadFilter);
        fetchLeadStats();
      } else {
        showNotification(data.message || 'Error al enviar', 'error');
      }
    } catch { showNotification('Error de conexión', 'error'); }
    finally { setSendingMarketing(false); }
  };

  const handleImportCSV = async (e) => {
    e.preventDefault();
    if (!importFile) { showNotification('Selecciona un archivo CSV', 'error'); return; }
    setImporting(true);
    setImportResult(null);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', importFile);
      const response = await fetch(`${API_URL}/api/crm/import/csv`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        setImportResult({ success: true, ...data });
        fetchLeads(leadFilter);
        fetchLeadStats();
        setImportFile(null);
      } else {
        setImportResult({ success: false, message: data.message });
      }
    } catch { setImportResult({ success: false, message: 'Error de conexión' }); }
    finally { setImporting(false); }
  };

  const handleDownloadTemplate = () => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/crm/import/template`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'plantilla-leads.csv'; a.click();
        URL.revokeObjectURL(url);
      });
  };

  const handleExportCSV = () => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    if (leadFilter.status) params.append('status', leadFilter.status);
    window.open(`${API_URL}/api/crm/export/csv?${params}&token=${token}`, '_blank');
  };

  const getLeadStatusColor = (status) => ({
    frio: '#64748b', interesado: '#f59e0b', potencial: '#3b82f6',
    cliente: '#10b981', cerrado: '#ef4444',
    enviado: '#8b5cf6', no_contactado: '#e11d48'
  }[status] || '#64748b');

  const getLeadStatusLabel = (status) => ({
    frio: '🧊 Frío', interesado: '🔥 Interesado', potencial: '⭐ Potencial',
    cliente: '✅ Cliente', cerrado: '❌ Cerrado',
    enviado: '📧 Enviado', no_contactado: '🚫 No Contactado'
  }[status] || status);

  const buildWhatsAppLink = (lead) => {
    const phone = lead.phone?.replace(/\D/g, '');
    if (!phone) return null;
    const msg = encodeURIComponent(`Hola ${lead.name}! Te contacto de parte de Gabriel Diseña. 🎨`);
    return `https://wa.me/${phone}?text=${msg}`;
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
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          🏠 Dashboard
        </button>
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
        <button
          className={`tab ${activeTab === 'crm' ? 'active' : ''}`}
          onClick={() => { setActiveTab('crm'); fetchLeads(leadFilter); }}
        >
          🎯 CRM / Leads
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
        {/* TAB DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>🏠 Dashboard</h2>
            </div>

            {/* Stats cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              {[
                { label: 'Total Leads', value: leadStats.total, icon: '🎯', gradient: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' },
                { label: 'Leads esta semana', value: leads.filter(l => new Date(l.createdAt) >= new Date(Date.now() - 7*24*60*60*1000)).length, icon: '📅', gradient: 'linear-gradient(135deg,#f59e0b,#ec4899)' },
                { label: 'Proyectos activos', value: projects.filter(p => p.status === 'en-progreso').length, icon: '⚡', gradient: 'linear-gradient(135deg,#10b981,#3b82f6)' },
                { label: 'Clientes totales', value: users.length, icon: '👥', gradient: 'linear-gradient(135deg,#8b5cf6,#ec4899)' },
                { label: 'Ingresos totales', value: `$${projects.reduce((sum, p) => sum + (p.totalPaid || 0), 0).toFixed(0)}`, icon: '💰', gradient: 'linear-gradient(135deg,#10b981,#059669)' },
              ].map(card => (
                <div key={card.label} style={{ background: '#161b27', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '10px', background: card.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                    {card.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#e2e8f0', lineHeight: 1 }}>{card.value}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{card.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              {/* Recent Leads */}
              <div style={{ background: '#161b27', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 style={{ margin: '0 0 16px', color: '#e2e8f0', fontSize: '1rem', fontWeight: '600' }}>🎯 Últimos Leads</h3>
                {leads.slice(0, 5).length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '13px' }}>No hay leads aún.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {leads.slice(0, 5).map(lead => (
                      <div key={lead._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#0d1117', borderRadius: '8px' }}>
                        <span style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '13px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.name}</span>
                        <span style={{ background: getLeadStatusColor(lead.status), color: 'white', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '600', marginLeft: '8px', flexShrink: 0 }}>{getLeadStatusLabel(lead.status)}</span>
                        <span style={{ color: '#64748b', fontSize: '11px', marginLeft: '8px', flexShrink: 0 }}>{new Date(lead.createdAt).toLocaleDateString('es-ES')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Projects */}
              <div style={{ background: '#161b27', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 style={{ margin: '0 0 16px', color: '#e2e8f0', fontSize: '1rem', fontWeight: '600' }}>📁 Últimos Proyectos</h3>
                {projects.slice(0, 5).length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '13px' }}>No hay proyectos aún.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {projects.slice(0, 5).map(project => (
                      <div key={project._id} style={{ padding: '8px 12px', background: '#0d1117', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '13px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.title}</span>
                          <span style={{ background: getStatusColor(project.status), color: 'white', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '600', marginLeft: '8px', flexShrink: 0 }}>{getStatusText(project.status)}</span>
                        </div>
                        <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '6px' }}>{project.userId?.name || 'Sin cliente'}</div>
                        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: '4px', overflow: 'hidden' }}>
                          <div style={{ background: 'linear-gradient(90deg,#3b82f6,#8b5cf6)', height: '100%', width: `${project.progress || 0}%`, transition: 'width 0.3s' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ background: '#161b27', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ margin: '0 0 16px', color: '#e2e8f0', fontSize: '1rem', fontWeight: '600' }}>⚡ Acciones Rápidas</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => { setActiveTab('crm'); setShowCreateLead(true); }}
                  style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
                >
                  + Nuevo Lead
                </button>
                <button
                  onClick={() => { setActiveTab('crm'); setShowMarketing(true); }}
                  style={{ background: 'linear-gradient(135deg,#f59e0b,#ec4899)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
                >
                  📧 Email Marketing
                </button>
                <button
                  onClick={() => { setActiveTab('crm'); setShowImport(true); }}
                  style={{ background: 'linear-gradient(135deg,#10b981,#3b82f6)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
                >
                  📥 Importar BD
                </button>
              </div>
            </div>
          </div>
        )}

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
        {/* ── TAB CRM ────────────────────────────────────────────── */}
        {activeTab === 'crm' && (
          <div className="tab-content">
            {/* Header */}
            <div className="content-header">
              <h2>🎯 CRM — Gestión de Leads</h2>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button className="btn-secondary" onClick={() => { setShowImport(!showImport); setImportResult(null); }}>
                  📥 Importar BD
                </button>
                <button className="btn-secondary" onClick={handleExportCSV}>
                  📤 Exportar CSV
                </button>
                <button className="btn-primary" onClick={() => setShowMarketing(!showMarketing)}>
                  📧 Email Marketing
                </button>
                <button className="btn-primary" onClick={() => setShowCreateLead(!showCreateLead)}>
                  + Nuevo Lead
                </button>
                {leadStats.total > 0 && (
                  <button
                    onClick={handleDeleteAll}
                    style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
                  >
                    🗑️ Borrar todo
                  </button>
                )}
              </div>
            </div>

            {/* Stats rápidas */}
            <div className="crm-stats">
              {[
                { label: 'Total', value: leadStats.total, color: '#64748b' },
                { label: '🧊 Fríos', value: leadStats.frio, color: '#64748b' },
                { label: '🔥 Interesados', value: leadStats.interesado, color: '#f59e0b' },
                { label: '⭐ Potenciales', value: leadStats.potencial, color: '#3b82f6' },
                { label: '✅ Clientes', value: leadStats.cliente, color: '#10b981' },
                { label: '📧 Enviados', value: leadStats.enviado, color: '#8b5cf6' },
                { label: '🚫 No Contactados', value: leadStats.no_contactado, color: '#e11d48' },
              ].map(s => (
                <div key={s.label} className="crm-stat-card" style={{ borderColor: s.color }}>
                  <div className="crm-stat-num" style={{ color: s.color }}>{s.value}</div>
                  <div className="crm-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Modal Importar CSV */}
            {showImport && (
              <div className="form-card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0 }}>📥 Importar Base de Datos (CSV)</h3>
                  <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={handleDownloadTemplate}>
                    ⬇️ Descargar Plantilla
                  </button>
                </div>

                <div className="import-columns-info">
                  <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#94a3b8' }}>Columnas aceptadas en el CSV:</p>
                  <div className="import-columns-list">
                    {['nombre *', 'email', 'telefono', 'pais', 'servicio', 'fuente', 'estado', 'presupuesto', 'notas', 'mensaje'].map(col => (
                      <span key={col} className="import-col-tag">{col}</span>
                    ))}
                  </div>
                  <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#64748b' }}>
                    * = obligatorio · email: también acepta "correo", "mail" · teléfono: también acepta "cel", "celular", "whatsapp", "movil" · nombre: también acepta "nombres", "cliente", "contacto"
                  </p>
                </div>

                <form onSubmit={handleImportCSV} style={{ marginTop: '20px' }}>
                  <div className="import-drop-zone" onClick={() => document.getElementById('csv-input').click()}>
                    <input
                      id="csv-input"
                      type="file"
                      accept=".csv,text/csv"
                      style={{ display: 'none' }}
                      onChange={e => { setImportFile(e.target.files[0]); setImportResult(null); }}
                    />
                    {importFile ? (
                      <div className="import-file-selected">
                        <span style={{ fontSize: '2rem' }}>📄</span>
                        <strong>{importFile.name}</strong>
                        <span style={{ color: '#64748b', fontSize: '13px' }}>{(importFile.size / 1024).toFixed(1)} KB</span>
                      </div>
                    ) : (
                      <div className="import-file-placeholder">
                        <span style={{ fontSize: '2.5rem' }}>📂</span>
                        <strong>Haz clic para seleccionar tu CSV</strong>
                        <span style={{ color: '#64748b', fontSize: '13px' }}>o arrastra el archivo aquí</span>
                      </div>
                    )}
                  </div>

                  {importResult && (
                    <div className={`import-result ${importResult.success ? 'success' : 'error'}`}>
                      {importResult.success ? (
                        <>
                          <span style={{ fontSize: '1.5rem' }}>✅</span>
                          <div>
                            <strong>{importResult.message}</strong>
                            {importResult.skipped > 0 && <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>{importResult.skipped} filas omitidas</p>}
                          </div>
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize: '1.5rem' }}>❌</span>
                          <strong>{importResult.message}</strong>
                        </>
                      )}
                    </div>
                  )}

                  <div className="form-actions" style={{ marginTop: '16px' }}>
                    <button type="submit" className="btn-primary" disabled={!importFile || importing}>
                      {importing ? 'Importando...' : '🚀 Importar Leads'}
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => { setShowImport(false); setImportFile(null); setImportResult(null); }}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Email Marketing Modal */}
            {showMarketing && (
              <div className="form-card" style={{ marginBottom: '24px' }}>
                <h3>📧 Enviar Campaña de Email Marketing</h3>
                {checkedLeads.size > 0 && (
                  <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#3b82f6', fontSize: '14px' }}>
                    ✅ Se enviará solo a <strong>{checkedLeads.size} lead{checkedLeads.size !== 1 ? 's' : ''} seleccionado{checkedLeads.size !== 1 ? 's' : ''}</strong> — los filtros de estado/servicio se ignorarán.
                  </div>
                )}
                <form onSubmit={handleSendMarketing}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Filtrar por Estado {checkedLeads.size > 0 && <span style={{color:'#64748b',fontWeight:'normal'}}>(ignorado — hay selección)</span>}</label>
                      <select value={marketing.targetStatus} onChange={e => setMarketing({ ...marketing, targetStatus: e.target.value })}>
                        <option value="">Todos los leads con email</option>
                        <option value="frio">Frío</option>
                        <option value="interesado">Interesado</option>
                        <option value="potencial">Potencial</option>
                        <option value="cliente">Cliente</option>
                        <option value="enviado">Enviado</option>
                        <option value="no_contactado">No Contactado</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Filtrar por Servicio</label>
                      <select value={marketing.targetService} onChange={e => setMarketing({ ...marketing, targetService: e.target.value })}>
                        <option value="">Todos los servicios</option>
                        <option value="logo">Logo</option>
                        <option value="web">Web</option>
                        <option value="ambos">Logo + Web</option>
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label>Asunto *</label>
                      <input value={marketing.subject} onChange={e => setMarketing({ ...marketing, subject: e.target.value })} placeholder="Ej: 🎨 Oferta especial para ti" required />
                    </div>
                    <div className="form-group full-width">
                      <label>Contenido HTML (usa {'{{nombre}}'} para personalizar)</label>
                      <textarea value={marketing.html} onChange={e => setMarketing({ ...marketing, html: e.target.value })}
                        placeholder={'<p>Hola {{nombre}}, tenemos una oferta especial...</p>'} rows="6" required />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={sendingMarketing}>
                      {sendingMarketing ? 'Enviando...' : '🚀 Enviar Campaña'}
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => setShowMarketing(false)}>Cancelar</button>
                  </div>
                </form>
              </div>
            )}

            {/* Crear Lead */}
            {showCreateLead && (
              <div className="form-card" style={{ marginBottom: '24px' }}>
                <h3>Nuevo Lead</h3>
                <form onSubmit={handleCreateLead}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nombre *</label>
                      <input value={newLead.name} onChange={e => setNewLead({ ...newLead, name: e.target.value })} placeholder="Nombre completo" required />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" value={newLead.email} onChange={e => setNewLead({ ...newLead, email: e.target.value })} placeholder="email@ejemplo.com" />
                    </div>
                    <div className="form-group">
                      <label>Teléfono / WhatsApp</label>
                      <input value={newLead.phone} onChange={e => setNewLead({ ...newLead, phone: e.target.value })} placeholder="+54 9 11 1234-5678" />
                    </div>
                    <div className="form-group">
                      <label>País</label>
                      <select value={newLead.country} onChange={e => setNewLead({ ...newLead, country: e.target.value })}>
                        <option value="peru">Perú</option><option value="argentina">Argentina</option>
                        <option value="chile">Chile</option><option value="venezuela">Venezuela</option>
                        <option value="colombia">Colombia</option><option value="mexico">México</option>
                        <option value="uruguay">Uruguay</option><option value="otro">Otro</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Servicio</label>
                      <select value={newLead.service} onChange={e => setNewLead({ ...newLead, service: e.target.value })}>
                        <option value="logo">Logo</option><option value="web">Web</option>
                        <option value="ambos">Logo + Web</option><option value="otro">Otro</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Fuente</label>
                      <select value={newLead.source} onChange={e => setNewLead({ ...newLead, source: e.target.value })}>
                        <option value="directo">Directo</option><option value="portfolio">Portfolio</option>
                        <option value="instagram">Instagram</option><option value="whatsapp">WhatsApp</option>
                        <option value="referido">Referido</option><option value="otro">Otro</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Estado</label>
                      <select value={newLead.status} onChange={e => setNewLead({ ...newLead, status: e.target.value })}>
                        <option value="frio">🧊 Frío</option><option value="interesado">🔥 Interesado</option>
                        <option value="potencial">⭐ Potencial</option><option value="cliente">✅ Cliente</option>
                        <option value="enviado">📧 Enviado</option><option value="no_contactado">🚫 No Contactado</option>
                        <option value="cerrado">❌ Cerrado</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Presupuesto estimado</label>
                      <input value={newLead.budget} onChange={e => setNewLead({ ...newLead, budget: e.target.value })} placeholder="Ej: $200 USD" />
                    </div>
                    <div className="form-group full-width">
                      <label>Notas internas</label>
                      <textarea value={newLead.notes} onChange={e => setNewLead({ ...newLead, notes: e.target.value })} placeholder="Notas sobre este lead..." rows="2" />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-primary">Guardar Lead</button>
                    <button type="button" className="btn-secondary" onClick={() => setShowCreateLead(false)}>Cancelar</button>
                  </div>
                </form>
              </div>
            )}

            {/* Filtros */}
            <div className="crm-filters">
              <input
                className="crm-search"
                placeholder="🔍 Buscar por nombre, email o teléfono..."
                value={leadFilter.search}
                onChange={e => { const f = { ...leadFilter, search: e.target.value }; setLeadFilter(f); fetchLeads(f); setCrmPage(1); }}
              />
              <select
                className="crm-filter-select"
                value={leadFilter.status}
                onChange={e => { const f = { ...leadFilter, status: e.target.value }; setLeadFilter(f); fetchLeads(f); setCrmPage(1); }}
              >
                <option value="">Todos los estados</option>
                <option value="frio">🧊 Frío</option>
                <option value="interesado">🔥 Interesado</option>
                <option value="potencial">⭐ Potencial</option>
                <option value="cliente">✅ Cliente</option>
                <option value="enviado">📧 Enviado</option>
                <option value="no_contactado">🚫 No Contactado</option>
                <option value="cerrado">❌ Cerrado</option>
              </select>
            </div>

            {/* Tabla CRM */}
            <div className="crm-table-wrapper">
              {/* Barra de acciones masivas */}
              <div className="crm-bulk-bar">
                <label className="crm-check-all-label">
                  <input
                    type="checkbox"
                    checked={leads.length > 0 && checkedLeads.size === leads.length}
                    onChange={toggleCheckAll}
                    style={{ width: '16px', height: '16px', accentColor: '#3b82f6' }}
                  />
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>Seleccionar todos</span>
                </label>
                {checkedLeads.size > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#3b82f6', fontSize: '13px', fontWeight: '600' }}>
                      {checkedLeads.size} seleccionado{checkedLeads.size !== 1 ? 's' : ''}
                    </span>
                    <button
                      onClick={handleDeleteSelected}
                      style={{ background: '#ef4444', border: 'none', color: 'white', borderRadius: '6px', padding: '5px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                    >
                      🗑️ Eliminar seleccionados
                    </button>
                    <button
                      onClick={() => setShowMarketing(true)}
                      style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', border: 'none', color: 'white', borderRadius: '6px', padding: '5px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                    >
                      📧 Email a seleccionados
                    </button>
                  </div>
                )}
              </div>

              {/* Tabla */}
              {leads.length === 0 ? (
                <div className="crm-empty">No hay leads con este filtro.<br />Probá con "Todos los estados".</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="crm-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}></th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Estado</th>
                        <th>Servicio</th>
                        <th>Fuente</th>
                        <th>Fecha</th>
                        <th style={{ width: '120px' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.slice((crmPage-1)*50, crmPage*50).map(lead => (
                        <tr
                          key={lead._id}
                          className={`crm-table-row ${selectedLead?._id === lead._id ? 'active' : ''}`}
                          onClick={() => { setSelectedLead(lead); setEditingLead(false); }}
                        >
                          <td onClick={e => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={checkedLeads.has(lead._id)}
                              onChange={e => toggleCheckLead(e, lead._id)}
                              style={{ width: '15px', height: '15px', accentColor: '#3b82f6', cursor: 'pointer' }}
                            />
                          </td>
                          <td>
                            <div style={{ fontWeight: '600', color: '#e2e8f0', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {lead.name}
                            </div>
                          </td>
                          <td style={{ color: '#94a3b8', fontSize: '12px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {lead.email || '—'}
                          </td>
                          <td style={{ color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap' }}>
                            {lead.phone || '—'}
                          </td>
                          <td onClick={e => e.stopPropagation()}>
                            <select
                              value={lead.status}
                              onChange={e => handleUpdateLeadStatus(lead._id, e.target.value)}
                              style={{
                                background: getLeadStatusColor(lead.status),
                                color: 'white',
                                border: 'none',
                                padding: '3px 6px',
                                borderRadius: '20px',
                                fontSize: '11px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                outline: 'none'
                              }}
                            >
                              <option value="frio">🧊 Frío</option>
                              <option value="interesado">🔥 Interesado</option>
                              <option value="potencial">⭐ Potencial</option>
                              <option value="cliente">✅ Cliente</option>
                              <option value="enviado">📧 Enviado</option>
                              <option value="no_contactado">🚫 No Contactado</option>
                              <option value="cerrado">❌ Cerrado</option>
                            </select>
                          </td>
                          <td style={{ color: '#94a3b8', fontSize: '12px' }}>{lead.service}</td>
                          <td style={{ color: '#94a3b8', fontSize: '12px' }}>{lead.source}</td>
                          <td style={{ color: '#64748b', fontSize: '12px', whiteSpace: 'nowrap' }}>
                            {new Date(lead.createdAt).toLocaleDateString('es-ES')}
                          </td>
                          <td onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              {buildWhatsAppLink(lead) && (
                                <a
                                  href={buildWhatsAppLink(lead)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="WhatsApp"
                                  style={{ display: 'inline-flex', alignItems: 'center' }}
                                >
                                  <img src="/whatsapp.svg" alt="WhatsApp" style={{ width: '22px', height: '22px' }} />
                                </a>
                              )}
                              <button
                                onClick={() => { setSelectedLead(lead); setEditingLead(true); }}
                                title="Editar"
                                style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#3b82f6', borderRadius: '5px', padding: '3px 8px', cursor: 'pointer', fontSize: '12px' }}
                              >✏️</button>
                              <button
                                onClick={() => handleDeleteLead(lead._id)}
                                title="Eliminar"
                                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '5px', padding: '3px 8px', cursor: 'pointer', fontSize: '12px' }}
                              >🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Paginación CRM */}
            {leads.length > 50 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '16px 0', marginTop: '8px' }}>
                <button
                  onClick={() => setCrmPage(p => Math.max(1, p - 1))}
                  disabled={crmPage === 1}
                  style={{ background: crmPage === 1 ? 'rgba(100,116,139,0.2)' : 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: crmPage === 1 ? '#64748b' : '#3b82f6', padding: '8px 16px', borderRadius: '8px', cursor: crmPage === 1 ? 'default' : 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
                >
                  ← Anterior
                </button>
                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  Página {crmPage} de {Math.ceil(leads.length / 50)}
                </span>
                <button
                  onClick={() => setCrmPage(p => Math.min(Math.ceil(leads.length / 50), p + 1))}
                  disabled={crmPage >= Math.ceil(leads.length / 50)}
                  style={{ background: crmPage >= Math.ceil(leads.length / 50) ? 'rgba(100,116,139,0.2)' : 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: crmPage >= Math.ceil(leads.length / 50) ? '#64748b' : '#3b82f6', padding: '8px 16px', borderRadius: '8px', cursor: crmPage >= Math.ceil(leads.length / 50) ? 'default' : 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
                >
                  Siguiente →
                </button>
              </div>
            )}

            {/* Panel detalle del lead */}
            <div className="crm-layout">
              <div></div>

              {/* Detalle del lead */}
              {selectedLead && (
                <div className="crm-detail">
                  <div className="crm-detail-header">
                    <div>
                      <h3>{selectedLead.name}</h3>
                      <span className="crm-lead-status" style={{ background: getLeadStatusColor(selectedLead.status), fontSize: '0.8rem', padding: '4px 10px', borderRadius: '20px', color: 'white' }}>
                        {getLeadStatusLabel(selectedLead.status)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {buildWhatsAppLink(selectedLead) && (
                        <a href={buildWhatsAppLink(selectedLead)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                          💬 WhatsApp
                        </a>
                      )}
                      {selectedLead.status !== 'cliente' && (
                        <button
                          onClick={() => handleUpdateLeadStatus(selectedLead._id, 'cliente')}
                          style={{ background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
                        >
                          ✅ Convertir a Cliente
                        </button>
                      )}
                      <button className="btn-secondary" onClick={() => setEditingLead(!editingLead)}>
                        ✏️ Editar
                      </button>
                      <button className="btn-danger-sm" onClick={() => handleDeleteLead(selectedLead._id)}>
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Edición del lead */}
                  {editingLead ? (
                    <form onSubmit={handleSaveLeadEdit} className="crm-edit-form">
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Nombre</label>
                          <input value={selectedLead.name} onChange={e => setSelectedLead({ ...selectedLead, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                          <label>Email</label>
                          <input value={selectedLead.email} onChange={e => setSelectedLead({ ...selectedLead, email: e.target.value })} />
                        </div>
                        <div className="form-group">
                          <label>Teléfono</label>
                          <input value={selectedLead.phone} onChange={e => setSelectedLead({ ...selectedLead, phone: e.target.value })} />
                        </div>
                        <div className="form-group">
                          <label>Estado</label>
                          <select value={selectedLead.status} onChange={e => setSelectedLead({ ...selectedLead, status: e.target.value })}>
                            <option value="frio">🧊 Frío</option><option value="interesado">🔥 Interesado</option>
                            <option value="potencial">⭐ Potencial</option><option value="cliente">✅ Cliente</option>
                            <option value="enviado">📧 Enviado</option><option value="no_contactado">🚫 No Contactado</option>
                            <option value="cerrado">❌ Cerrado</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Presupuesto</label>
                          <input value={selectedLead.budget} onChange={e => setSelectedLead({ ...selectedLead, budget: e.target.value })} />
                        </div>
                        <div className="form-group full-width">
                          <label>Notas internas</label>
                          <textarea value={selectedLead.notes} onChange={e => setSelectedLead({ ...selectedLead, notes: e.target.value })} rows="3" />
                        </div>
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="btn-primary">Guardar cambios</button>
                        <button type="button" className="btn-secondary" onClick={() => setEditingLead(false)}>Cancelar</button>
                      </div>
                    </form>
                  ) : (
                    <div className="crm-detail-info">
                      <div className="crm-info-grid">
                        {selectedLead.email && <div><span>✉️ Email</span><strong>{selectedLead.email}</strong></div>}
                        {selectedLead.phone && <div><span>📱 Teléfono</span><strong>{selectedLead.phone}</strong></div>}
                        <div><span>📍 País</span><strong>{selectedLead.country}</strong></div>
                        <div><span>🎨 Servicio</span><strong>{selectedLead.service}</strong></div>
                        <div><span>🔗 Fuente</span><strong>{selectedLead.source}</strong></div>
                        {selectedLead.budget && <div><span>💰 Presupuesto</span><strong>{selectedLead.budget}</strong></div>}
                        <div><span>📅 Creado</span><strong>{new Date(selectedLead.createdAt).toLocaleDateString('es-ES')}</strong></div>
                      </div>
                      {selectedLead.message && (
                        <div className="crm-message-box">
                          <span>💬 Mensaje del lead</span>
                          <p>{selectedLead.message}</p>
                        </div>
                      )}
                      {selectedLead.notes && (
                        <div className="crm-notes-box">
                          <span>📝 Notas internas</span>
                          <p>{selectedLead.notes}</p>
                        </div>
                      )}
                      {/* Cambio rápido de estado */}
                      <div className="crm-status-quick">
                        <span>Cambiar estado:</span>
                        {['frio','interesado','potencial','cliente','cerrado'].map(s => (
                          <button key={s}
                            className={`crm-status-btn ${selectedLead.status === s ? 'active' : ''}`}
                            style={{ borderColor: getLeadStatusColor(s), color: selectedLead.status === s ? 'white' : getLeadStatusColor(s), background: selectedLead.status === s ? getLeadStatusColor(s) : 'transparent' }}
                            onClick={() => handleUpdateLeadStatus(selectedLead._id, s)}
                          >
                            {getLeadStatusLabel(s)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Seguimientos */}
                  <div className="crm-followups">
                    <h4>📅 Seguimientos ({selectedLead.followUps?.length || 0})</h4>
                    <form onSubmit={handleAddFollowUp} className="crm-followup-form">
                      <textarea
                        value={followUpData.note}
                        onChange={e => setFollowUpData({ ...followUpData, note: e.target.value })}
                        placeholder="Nota del seguimiento..."
                        rows="2"
                        required
                      />
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                        <select value={followUpData.method} onChange={e => setFollowUpData({ ...followUpData, method: e.target.value })}>
                          <option value="whatsapp">💬 WhatsApp</option>
                          <option value="email">✉️ Email</option>
                          <option value="llamada">📞 Llamada</option>
                          <option value="otro">Otro</option>
                        </select>
                        <input type="date" value={followUpData.date} onChange={e => setFollowUpData({ ...followUpData, date: e.target.value })} />
                        <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>+ Agregar</button>
                      </div>
                    </form>
                    <div className="crm-followup-list">
                      {(selectedLead.followUps || []).slice().reverse().map(fu => (
                        <div key={fu._id} className="crm-followup-item">
                          <div className="crm-followup-meta">
                            <span>{fu.method === 'whatsapp' ? '💬' : fu.method === 'email' ? '✉️' : fu.method === 'llamada' ? '📞' : '📌'} {fu.method}</span>
                            <span>{new Date(fu.date || fu.createdAt).toLocaleDateString('es-ES')}</span>
                            <button onClick={() => handleDeleteFollowUp(fu._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0 4px' }}>🗑️</button>
                          </div>
                          <p>{fu.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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