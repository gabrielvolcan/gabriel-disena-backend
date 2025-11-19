import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    // Obtener token del header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No hay token, autorización denegada' });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secret_key_super_segura');
    
    // Agregar usuario al request
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('❌ Error en autenticación:', error.message);
    res.status(401).json({ message: 'Token inválido' });
  }
};

// 🆕 MIDDLEWARE PARA VERIFICAR SI ES SUPERADMIN
export const isSuperAdmin = [auth, async (req, res, next) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ 
        message: 'Acceso denegado. Solo el Super Administrador puede realizar esta acción.' 
      });
    }
    next();
  } catch (error) {
    console.error('❌ Error verificando rol:', error);
    res.status(500).json({ message: 'Error verificando permisos' });
  }
}];

// 🆕 MIDDLEWARE PARA VERIFICAR SI ES ADMIN O SUPERADMIN
export const isAdminOrSuperAdmin = [auth, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ 
        message: 'Acceso denegado. Se requieren permisos de administrador.' 
      });
    }
    next();
  } catch (error) {
    console.error('❌ Error verificando rol:', error);
    res.status(500).json({ message: 'Error verificando permisos' });
  }
}];

export default auth;