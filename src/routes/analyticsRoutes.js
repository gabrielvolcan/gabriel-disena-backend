import express from 'express';
import Project from '../models/Project.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Obtener analytics completos (solo admin) con filtros
router.get('/', auth, async (req, res) => {
  try {
    // Verificar que sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para ver analytics' });
    }

    // 🎯 OBTENER FILTROS DE QUERY PARAMS
    const {
      dateRange,
      startDate,
      endDate,
      type,
      plan,
      status,
      clientId,
      country
    } = req.query;

    // 🔍 CONSTRUIR FILTROS DINÁMICOS
    let projectFilter = {};
    let userFilter = { role: 'client' };

    // ====== FILTRO DE FECHAS ======
    if (dateRange || startDate || endDate) {
      projectFilter.createdAt = {};

      if (dateRange === '7days') {
        projectFilter.createdAt.$gte = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateRange === '30days') {
        projectFilter.createdAt.$gte = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      } else if (dateRange === '3months') {
        projectFilter.createdAt.$gte = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      } else if (dateRange === 'year') {
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        projectFilter.createdAt.$gte = startOfYear;
      } else if (dateRange === 'custom' && startDate && endDate) {
        projectFilter.createdAt.$gte = new Date(startDate);
        projectFilter.createdAt.$lte = new Date(endDate);
      }
    }

    // ====== FILTRO DE TIPO ======
    if (type && type !== 'all') {
      projectFilter.type = type;
    }

    // ====== FILTRO DE PLAN ======
    if (plan && plan !== 'all') {
      projectFilter.plan = plan;
    }

    // ====== FILTRO DE ESTADO ======
    if (status && status !== 'all') {
      projectFilter.status = status;
    }

    // ====== FILTRO DE CLIENTE ======
    if (clientId && clientId !== 'all') {
      projectFilter.userId = clientId;
    }

    // ====== FILTRO DE PAÍS ======
    if (country && country !== 'all') {
      userFilter.country = country;
      
      // Obtener IDs de usuarios del país seleccionado
      const usersFromCountry = await User.find(userFilter).select('_id');
      const userIds = usersFromCountry.map(u => u._id);
      
      // Si ya hay un filtro de cliente específico, no lo sobrescribas
      if (!projectFilter.userId) {
        projectFilter.userId = { $in: userIds };
      }
    }

    console.log('🔍 Filtros aplicados:', { projectFilter, userFilter });

    // 📊 ESTADÍSTICAS GENERALES (con filtros)
    const totalClients = await User.countDocuments(userFilter);
    const totalProjects = await Project.countDocuments(projectFilter);
    
    const activeProjects = await Project.countDocuments({ 
      ...projectFilter,
      status: { $in: ['pendiente', 'en-progreso', 'revision'] } 
    });
    
    const completedProjects = await Project.countDocuments({ 
      ...projectFilter,
      status: { $in: ['completado', 'entregado'] }
    });

    // 💰 INGRESOS (con filtros)
    const allProjects = await Project.find(projectFilter);
    const totalRevenue = allProjects.reduce((sum, p) => sum + (p.price || 0), 0);
    
    // Ingresos este mes (con filtros base)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthFilter = {
      ...projectFilter,
      createdAt: { 
        ...projectFilter.createdAt,
        $gte: startOfMonth 
      }
    };
    
    const projectsThisMonth = await Project.find(monthFilter);
    const revenueThisMonth = projectsThisMonth.reduce((sum, p) => sum + (p.price || 0), 0);
    
    // Promedio
    const averagePrice = totalProjects > 0 ? totalRevenue / totalProjects : 0;

    // 📈 PROYECTOS POR MES (últimos 6 meses con filtros)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthsFilter = {
      ...projectFilter,
      createdAt: { 
        ...projectFilter.createdAt,
        $gte: projectFilter.createdAt?.$gte || sixMonthsAgo
      }
    };

    const projectsByMonth = await Project.aggregate([
      { $match: monthsFilter },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$price' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Formatear datos para el frontend
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const chartData = projectsByMonth.map(item => ({
      name: monthNames[item._id.month - 1],
      proyectos: item.count,
      ingresos: item.revenue
    }));

    // 🎨 DISTRIBUCIÓN POR TIPO (con filtros)
    const projectsByType = await Project.aggregate([
      { $match: projectFilter },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const typeDistribution = projectsByType.map(item => ({
      name: item._id === 'logo' ? 'Logos' : 'Sitios Web',
      value: item.count
    }));

    // 📦 DISTRIBUCIÓN POR PLAN (con filtros)
    const projectsByPlan = await Project.aggregate([
      { $match: projectFilter },
      {
        $group: {
          _id: '$plan',
          count: { $sum: 1 }
        }
      }
    ]);

    const planDistribution = projectsByPlan.map(item => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count
    }));

    // 📊 DISTRIBUCIÓN POR ESTADO (con filtros)
    const projectsByStatus = await Project.aggregate([
      { $match: projectFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusDistribution = projectsByStatus.map(item => {
      const statusNames = {
        'pendiente': 'Pendiente',
        'en-progreso': 'En Progreso',
        'revision': 'En Revisión',
        'completado': 'Completado',
        'entregado': 'Entregado',
        'cancelado': 'Cancelado'
      };
      return {
        name: statusNames[item._id] || item._id,
        value: item.count
      };
    });

    // 🆕 📋 ÚLTIMOS 10 PROYECTOS CON INVOICES (con filtros)
    const recentProjects = await Project.find(projectFilter)
      .populate('userId', 'name email country')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title type plan price status createdAt userId invoices');

    // 👥 ÚLTIMOS 10 CLIENTES (con filtros)
    const recentClients = await User.find(userFilter)
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email country createdAt');

    // 🆕 💸 PROYECTOS PENDIENTES DE PAGO CON INVOICES (con filtros)
    const pendingPaymentFilter = {
      ...projectFilter,
      status: { $in: ['completado', 'entregado'] },
      isPaid: { $ne: true }
    };

    const pendingPayment = await Project.find(pendingPaymentFilter)
      .populate('userId', 'name email')
      .select('title price userId createdAt status invoices');

    // 📊 RESPUESTA COMPLETA
    res.json({
      stats: {
        totalClients,
        totalProjects,
        activeProjects,
        completedProjects,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        revenueThisMonth: Math.round(revenueThisMonth * 100) / 100,
        averagePrice: Math.round(averagePrice * 100) / 100
      },
      charts: {
        projectsByMonth: chartData.length > 0 ? chartData : [],
        typeDistribution,
        planDistribution,
        statusDistribution
      },
      tables: {
        recentProjects,
        recentClients,
        pendingPayment
      }
    });

    console.log('✅ Analytics generados exitosamente con filtros');

  } catch (error) {
    console.error('❌ Error generando analytics:', error);
    res.status(500).json({ 
      message: 'Error al generar analytics',
      error: error.message 
    });
  }
});

export default router;