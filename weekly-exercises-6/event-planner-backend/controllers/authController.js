import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const existing = await User.findOne({ username });
        if (existing) {
            return res.status(409).json({ error: 'Username already taken' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            passwordHash,
            role: role === 'admin' ? 'admin' : 'user' // don’t trust blindly
        });

        res.status(201).json({ id: user._id, username: user.username, role: user.role });
    } catch (err) {
        console.error('Register error', err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const passwordValid = await bcrypt.compare(password, user.passwordHash);
        if (!passwordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const tokenPayload = {
            id: user._id,
            username: user.username,
            role: user.role
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h'
        });

        res.json({ token, user: tokenPayload });
    } catch (err) {
        console.error('Login error', err);
        res.status(500).json({ error: 'Server error' });
    }
};
