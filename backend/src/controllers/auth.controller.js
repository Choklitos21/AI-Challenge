import bcrypt from 'bcryptjs';
import { userModel } from '../models/user.model.js';

export const authController = {
  register: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existing = await userModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await userModel.create({ email, password: hashed });

    req.session.userId = user.id;
    res.status(201).json({ user });
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    res.json({ user: { id: user.id, email: user.email } });
  },

  logout: async (req, res) => {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  },

  me: async (req, res) => {
    const user = await userModel.findById(req.session.userId);
    res.json({ user });
  },
};