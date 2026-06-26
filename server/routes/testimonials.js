const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware } = require('../middleware/auth');

const dataPath = path.join(__dirname, '../data/testimonials.json');

function readData() { return JSON.parse(fs.readFileSync(dataPath, 'utf8')); }
function writeData(data) { fs.writeFileSync(dataPath, JSON.stringify(data, null, 2)); }

// GET /api/testimonials (public - only approved)
router.get('/', (req, res) => {
  const items = readData();
  const showAll = req.query.all === 'true';
  res.json(showAll ? items : items.filter(t => t.approved));
});

// POST /api/testimonials (public)
router.post('/', (req, res) => {
  const items = readData();
  const newItem = { id: uuidv4(), ...req.body, approved: false, date: new Date().toISOString().split('T')[0] };
  items.push(newItem);
  writeData(items);
  res.status(201).json({ message: 'Review submitted for approval' });
});

// PUT /api/testimonials/:id (admin)
router.put('/:id', authMiddleware, (req, res) => {
  const items = readData();
  const index = items.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Testimonial not found' });
  items[index] = { ...items[index], ...req.body };
  writeData(items);
  res.json(items[index]);
});

// DELETE /api/testimonials/:id (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  let items = readData();
  items = items.filter(t => t.id !== req.params.id);
  writeData(items);
  res.json({ message: 'Testimonial deleted' });
});

module.exports = router;
