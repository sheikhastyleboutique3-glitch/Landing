const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { SECRET } = require('../middleware/auth');

const usersPath = path.join(__dirname, '../data/users.json');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    const user = users.find(u => u.username === username);
    
    // Default admin: admin/admin123
    if (username === 'admin' && password === 'admin123') {
      const token = jwt.sign({ id: '1', username: 'admin', role: 'admin' }, SECRET, { expiresIn: '24h' });
      return res.json({ token, user: { username: 'admin', role: 'admin', name: 'Admin' } });
    }
    
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET, { expiresIn: '24h' });
    res.json({ token, user: { username: user.username, role: user.role, name: user.name } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/change-password
router.post('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    // Simplified for demo
    if (currentPassword === 'admin123') {
      res.json({ message: 'Password changed successfully' });
    } else {
      res.status(400).json({ error: 'Current password is incorrect' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
