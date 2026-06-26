const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware } = require('../middleware/auth');

const dataPath = path.join(__dirname, '../data/orders.json');

function readData() { return JSON.parse(fs.readFileSync(dataPath, 'utf8')); }
function writeData(data) { fs.writeFileSync(dataPath, JSON.stringify(data, null, 2)); }

// GET /api/orders - Get all orders (admin)
router.get('/', authMiddleware, (req, res) => {
  const orders = readData();
  const { status } = req.query;
  let filtered = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (status) filtered = filtered.filter(o => o.status === status);
  res.json(filtered);
});

// POST /api/orders - Create order (public)
router.post('/', (req, res) => {
  const orders = readData();
  const newOrder = {
    id: uuidv4(),
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString(),
    orderNumber: 'GWK-' + Date.now().toString().slice(-6)
  };
  orders.push(newOrder);
  writeData(orders);
  res.status(201).json(newOrder);
});

// PUT /api/orders/:id - Update order status (admin)
router.put('/:id', authMiddleware, (req, res) => {
  const orders = readData();
  const index = orders.findIndex(o => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Order not found' });
  orders[index] = { ...orders[index], ...req.body, updatedAt: new Date().toISOString() };
  writeData(orders);
  res.json(orders[index]);
});

// DELETE /api/orders/:id - Delete order (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  let orders = readData();
  orders = orders.filter(o => o.id !== req.params.id);
  writeData(orders);
  res.json({ message: 'Order deleted' });
});

module.exports = router;
