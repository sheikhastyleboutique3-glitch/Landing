const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware } = require('../middleware/auth');

const dataPath = path.join(__dirname, '../data/gallery.json');

function readData() { return JSON.parse(fs.readFileSync(dataPath, 'utf8')); }
function writeData(data) { fs.writeFileSync(dataPath, JSON.stringify(data, null, 2)); }

// GET /api/gallery (public)
router.get('/', (req, res) => {
  const items = readData();
  const { category } = req.query;
  let filtered = items;
  if (category) filtered = filtered.filter(i => i.category === category);
  res.json(filtered);
});

// POST /api/gallery (admin)
router.post('/', authMiddleware, (req, res) => {
  const items = readData();
  const newItem = { id: uuidv4(), ...req.body };
  items.push(newItem);
  writeData(items);
  res.status(201).json(newItem);
});

// DELETE /api/gallery/:id (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  let items = readData();
  items = items.filter(i => i.id !== req.params.id);
  writeData(items);
  res.json({ message: 'Gallery item deleted' });
});

module.exports = router;
