const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware } = require('../middleware/auth');

const dataPath = path.join(__dirname, '../data/contact.json');

function readData() { return JSON.parse(fs.readFileSync(dataPath, 'utf8')); }
function writeData(data) { fs.writeFileSync(dataPath, JSON.stringify(data, null, 2)); }

// GET /api/contact (admin)
router.get('/', authMiddleware, (req, res) => {
  const messages = readData();
  res.json(messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// POST /api/contact (public)
router.post('/', (req, res) => {
  const messages = readData();
  const newMessage = {
    id: uuidv4(),
    ...req.body,
    read: false,
    createdAt: new Date().toISOString()
  };
  messages.push(newMessage);
  writeData(messages);
  res.status(201).json({ message: 'Message sent successfully' });
});

// PUT /api/contact/:id (admin - mark read)
router.put('/:id', authMiddleware, (req, res) => {
  const messages = readData();
  const index = messages.findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Message not found' });
  messages[index] = { ...messages[index], ...req.body };
  writeData(messages);
  res.json(messages[index]);
});

// DELETE /api/contact/:id (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  let messages = readData();
  messages = messages.filter(m => m.id !== req.params.id);
  writeData(messages);
  res.json({ message: 'Message deleted' });
});

module.exports = router;
