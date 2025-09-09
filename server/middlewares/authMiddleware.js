const jwt = require('jsonwebtoken');
const db = require('../config/database');

/**
 * Middleware de autenticación.
 * Verifica el JWT, lo decodifica y valida que el usuario aún exista en la DB.
 */
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const [rows] = await db.query(
            'SELECT id, name, email, role, state FROM users WHERE id = ?',
            [decoded.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = rows[0];
        if (user.state === 0) {
            return res.status(403).json({ message: 'Usuario desactivado' });
        }

        req.user = user; // guardamos el usuario en req.user
        next();
    } catch (err) {
        console.error('Error al verificar token:', err);
        return res.status(403).json({ message: 'Token inválido' });
    }
};

/**
 * Middleware de autorización por rol.
 * Ejemplo: authorizeRoles('admin', 'dentist')
 */
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ error: 'Acceso denegado. No tienes permisos.' });
        }
        next();
    };
};

module.exports = {
    authMiddleware,
    authorizeRoles,
};
