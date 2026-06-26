const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware } = require('../middleware/auth');

const dataPath = path.join(__dirname, '../data/menu.json');

function readData() { return JSON.parse(fs.readFileSync(dataPath, 'utf8')); }
function writeData(data) { fs.writeFileSync(dataPath, JSON.stringify(data, null, 2)); }

// GET /api/menu - Get all menu items (public)
router.get('/', (req, res) => {
  const items = readData();
  const { category, featured } = req.query;
  let filtered = items;
  if (category) filtered = filtered.filter(i => i.category === category);
  if (featured === 'true') filtered = filtered.filter(i => i.featured);
  res.json(filtered);
});

// GET /api/menu/:id - Get single item
router.get('/:id', (req, res) => {
  const items = readData();
  const item = items.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

// POST /api/menu - Create item (admin)
router.post('/', authMiddleware, (req, res) => {
  const items = readData();
  const newItem = { id: uuidv4(), ...req.body, available: true };
  items.push(newItem);
  writeData(items);
  res.status(201).json(newItem);
});

// PUT /api/menu/:id - Update item (admin)
router.put('/:id', authMiddleware, (req, res) => {
  const items = readData();
  const index = items.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });
  items[index] = { ...items[index], ...req.body };
  writeData(items);
  res.json(items[index]);
});

// DELETE /api/menu/:id - Delete item (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  let items = readData();
  items = items.filter(i => i.id !== req.params.id);
  writeData(items);
  res.json({ message: 'Item deleted' });
});

module.exports = router;
