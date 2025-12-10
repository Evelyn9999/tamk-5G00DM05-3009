import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Require a valid token → attaches user to req.user
export const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token missing or invalid' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, username, role }
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token invalid or expired' });
    }
};

// Only allow admins
export const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
