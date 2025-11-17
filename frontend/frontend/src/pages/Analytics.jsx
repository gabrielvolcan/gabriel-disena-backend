import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import './Analytics.css';

const Analytics = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);

  // 🎯 ESTADOS DE FILTROS
  const [filters, setFilters] = useState({
    dateRange: 'all',
    customStartDate: '',
    customEndDate: '',
    projectType: 'all',
    plan: 'all',
    status: 'all',
    clientId: 'all',
    country: 'all'
  });

  const [showFilters, setShowFilters] = useState(true);

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token || userRole !== 'admin') {
      navigate('/login');
      return;
    }

    fetchClients();
    fetchAnalytics();
  }, [navigate]);

  // Refrescar analytics cuando cambian los filtros
  useEffect(() => {
    if (analytics !== null) {
      fetchAnalytics();
    }
  }, [filters]);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Construir query params desde los filtros
      const params = new URLSearchParams();
      
      if (filters.dateRange !== 'all') {
        params.append('dateRange', filters.dateRange);
      }
      if (filters.customStartDate) {
        params.append('startDate', filters.customStartDate);
      }
      if (filters.customEndDate) {
        params.append('endDate', filters.customEndDate);
      }
      if (filters.projectType !== 'all') {
        params.append('type', filters.projectType);
      }
      if (filters.plan !== 'all') {
        params.append('plan', filters.plan);
      }
      if (filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters.clientId !== 'all') {
        params.append('clientId', filters.clientId);
      }
      if (filters.country !== 'all') {
        params.append('country', filters.country);
      }

      const queryString = params.toString();
      const url = `http://localhost:5000/api/analytics${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar analytics');
      }

      const data = await response.json();
      setAnalytics(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      dateRange: 'all',
      customStartDate: '',
      customEndDate: '',
      projectType: 'all',
      plan: 'all',
      status: 'all',
      clientId: 'all',
      country: 'all'
    });
  };

  const formatCurrency = (value, currency = 'USD') => {
  const symbols = {
    'USD': 'US$',
    'PEN': 'S/',
    'CLP': 'CLP$',
    'ARS': 'ARS$',
    'VES': 'Bs.',
    'EUR': '€',
    'MXN': 'MX$',
    'COP': 'COL$',
    'BRL': 'R$',
    'UYU': 'UY$'
  };

  const symbol = symbols[currency] || currency;
  return `${symbol}${parseFloat(value).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// 🆕 OBTENER MONEDA SEGÚN PAÍS
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

  // 🆕 FUNCIÓN PARA FORMATEAR SOLO EN USD (para totales generales)
  const formatUSD = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pendiente': '#f59e0b',
      'pendiente': '#f59e0b',
      'En Progreso': '#3b82f6',
      'en-progreso': '#3b82f6',
      'En Revisión': '#8b5cf6',
      'revision': '#8b5cf6',
      'Completado': '#10b981',
      'completado': '#10b981',
      'Entregado': '#10b981',
      'entregado': '#10b981',
      'Cancelado': '#ef4444',
      'cancelado': '#ef4444'
    };
    return colors[status] || '#94a3b8';
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="spinner"></div>
        <p>Cargando analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="analytics-error">
        <p>Error al cargar datos</p>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <header className="analytics-header">
        <div className="analytics-header-content">
          <div>
            <h1>📊 Dashboard de Analytics</h1>
            <p>Métricas y estadísticas de tu negocio</p>
          </div>
          <button onClick={() => navigate('/admin')} className="btn-back">
            ← Volver al Admin
          </button>
        </div>
      </header>

      {/* 🎯 PANEL DE FILTROS */}
      <div className="filters-panel">
        <div className="filters-header">
          <h3>🔍 Filtros</h3>
          <div className="filters-actions">
            <button 
              className="btn-reset-filters"
              onClick={resetFilters}
            >
              🔄 Resetear
            </button>
            <button 
              className="btn-toggle-filters"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? '▼ Ocultar' : '▶ Mostrar'}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="filters-grid">
            {/* FILTRO: RANGO DE FECHAS */}
            <div className="filter-group">
              <label>📅 Rango de Fechas</label>
              <select 
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              >
                <option value="all">Todos los tiempos</option>
                <option value="7days">Últimos 7 días</option>
                <option value="30days">Últimos 30 días</option>
                <option value="3months">Últimos 3 meses</option>
                <option value="year">Este año</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>

            {/* FECHAS PERSONALIZADAS */}
            {filters.dateRange === 'custom' && (
              <>
                <div className="filter-group">
                  <label>Fecha Inicio</label>
                  <input
                    type="date"
                    value={filters.customStartDate}
                    onChange={(e) => handleFilterChange('customStartDate', e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <label>Fecha Fin</label>
                  <input
                    type="date"
                    value={filters.customEndDate}
                    onChange={(e) => handleFilterChange('customEndDate', e.target.value)}
                  />
                </div>
              </>
            )}

            {/* FILTRO: TIPO DE PROYECTO */}
            <div className="filter-group">
              <label>🎨 Tipo de Proyecto</label>
              <select 
                value={filters.projectType}
                onChange={(e) => handleFilterChange('projectType', e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="logo">Logo</option>
                <option value="web">Sitio Web</option>
              </select>
            </div>

            {/* FILTRO: PLAN */}
            <div className="filter-group">
              <label>📦 Plan</label>
              <select 
                value={filters.plan}
                onChange={(e) => handleFilterChange('plan', e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="basico">Básico</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            {/* FILTRO: ESTADO */}
            <div className="filter-group">
              <label>⚡ Estado</label>
              <select 
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="en-progreso">En Progreso</option>
                <option value="revision">En Revisión</option>
                <option value="completado">Completado</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            {/* FILTRO: CLIENTE */}
            <div className="filter-group">
              <label>👤 Cliente</label>
              <select 
                value={filters.clientId}
                onChange={(e) => handleFilterChange('clientId', e.target.value)}
              >
                <option value="all">Todos los clientes</option>
                {clients.map(client => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            {/* FILTRO: PAÍS */}
            <div className="filter-group">
              <label>🌎 País</label>
              <select 
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
              >
                <option value="all">Todos los países</option>
                <option value="peru">Perú</option>
                <option value="chile">Chile</option>
                <option value="argentina">Argentina</option>
                <option value="uruguay">Uruguay</option>
                <option value="venezuela">Venezuela</option>
                <option value="internacional">Internacional</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ESTADÍSTICAS GENERALES */}
      <div className="stats-grid">
        <div className="stat-card-analytics">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            👥
          </div>
          <div className="stat-data">
            <h3>{analytics.stats.totalClients}</h3>
            <p>Clientes Totales</p>
          </div>
        </div>

        <div className="stat-card-analytics">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
            📊
          </div>
          <div className="stat-data">
            <h3>{analytics.stats.totalProjects}</h3>
            <p>Proyectos Totales</p>
          </div>
        </div>

        <div className="stat-card-analytics">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #ec4899)' }}>
            ⏳
          </div>
          <div className="stat-data">
            <h3>{analytics.stats.activeProjects}</h3>
            <p>Proyectos Activos</p>
          </div>
        </div>

        <div className="stat-card-analytics">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}>
            ✅
          </div>
          <div className="stat-data">
            <h3>{analytics.stats.completedProjects}</h3>
            <p>Completados</p>
          </div>
        </div>

        <div className="stat-card-analytics highlight">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            💰
          </div>
          <div className="stat-data">
            <h3>{formatCurrency(analytics.stats.totalRevenue, getCurrencyByCountry(filters.country))}</h3>
            <p>Ingresos Totales</p>
          </div>
        </div>

        <div className="stat-card-analytics highlight">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
            📅
          </div>
          <div className="stat-data">
            <h3>{formatCurrency(analytics.stats.revenueThisMonth, getCurrencyByCountry(filters.country))}</h3>
            <p>Ingresos Este Mes</p>
          </div>
        </div>

        <div className="stat-card-analytics">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
            📈
          </div>
          <div className="stat-data">
            <h3>{formatCurrency(analytics.stats.averagePrice, getCurrencyByCountry(filters.country))}</h3>

            <p>Precio Promedio</p>
          </div>
        </div>
      </div>

      {/* GRÁFICOS */}
      <div className="charts-section">
        {/* PROYECTOS E INGRESOS POR MES */}
        <div className="chart-card large">
          <h3>📈 Proyectos e Ingresos por Mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.charts.projectsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  background: '#1e293b', 
                  border: '1px solid #3b82f6',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Bar dataKey="proyectos" fill="#3b82f6" name="Proyectos" />
              <Bar dataKey="ingresos" fill="#10b981" name="Ingresos (USD)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* DISTRIBUCIÓN POR TIPO */}
        <div className="chart-card">
          <h3>🎨 Distribución por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.charts.typeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.charts.typeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: '#1e293b', 
                  border: '1px solid #3b82f6',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* DISTRIBUCIÓN POR PLAN */}
        <div className="chart-card">
          <h3>📦 Distribución por Plan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.charts.planDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.charts.planDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: '#1e293b', 
                  border: '1px solid #3b82f6',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* DISTRIBUCIÓN POR ESTADO */}
        <div className="chart-card large">
          <h3>📊 Distribución por Estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.charts.statusDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" width={120} />
              <Tooltip 
                contentStyle={{ 
                  background: '#1e293b', 
                  border: '1px solid #3b82f6',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="value" fill="#8b5cf6" name="Cantidad" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLAS */}
      <div className="tables-section">
        {/* ÚLTIMOS PROYECTOS */}
        <div className="table-card">
          <h3>📋 Últimos Proyectos</h3>
          <div className="table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Proyecto</th>
                  <th>Cliente</th>
                  <th>Tipo</th>
                  <th>Plan</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {analytics.tables.recentProjects.map((project) => {
                  // 🆕 Obtener la moneda de la primera factura o usar USD por defecto
                  const currency = project.invoices && project.invoices.length > 0 
                    ? project.invoices[0].currency 
                    : 'USD';
                  
                  return (
                    <tr key={project._id}>
                      <td><strong>{project.title}</strong></td>
                      <td>{project.userId?.name || 'N/A'}</td>
                      <td>{project.type === 'logo' ? '🎨 Logo' : '🌐 Web'}</td>
                      <td>{project.plan}</td>
                      <td><strong>{formatCurrency(project.price, currency)}</strong></td>
                      <td>
                        <span 
                          className="status-badge-small"
                          style={{ background: getStatusColor(project.status) }}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ÚLTIMOS CLIENTES */}
        <div className="table-card">
          <h3>👥 Últimos Clientes</h3>
          <div className="table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>País</th>
                  <th>Fecha Registro</th>
                </tr>
              </thead>
              <tbody>
                {analytics.tables.recentClients.map((client) => (
                  <tr key={client._id}>
                    <td><strong>{client.name}</strong></td>
                    <td>{client.email}</td>
                    <td>{client.country || 'N/A'}</td>
                    <td>{new Date(client.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PENDIENTES DE PAGO */}
        {analytics.tables.pendingPayment.length > 0 && (
          <div className="table-card alert">
            <h3>💸 Proyectos Pendientes de Pago</h3>
            <div className="table-wrapper">
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>Proyecto</th>
                    <th>Cliente</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.tables.pendingPayment.map((project) => {
                    // 🆕 Obtener la moneda de la primera factura o usar USD por defecto
                    const currency = project.invoices && project.invoices.length > 0 
                      ? project.invoices[0].currency 
                      : 'USD';
                    
                    return (
                      <tr key={project._id}>
                        <td><strong>{project.title}</strong></td>
                        <td>{project.userId?.name || 'N/A'}</td>
                        <td>
                          <strong style={{ color: '#f59e0b' }}>
                            {formatCurrency(project.price, currency)}
                          </strong>
                        </td>
                        <td>
                          <span 
                            className="status-badge-small"
                            style={{ background: getStatusColor(project.status) }}
                          >
                            {project.status}
                          </span>
                        </td>
                        <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;