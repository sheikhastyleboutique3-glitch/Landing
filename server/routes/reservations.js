const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware } = require('../middleware/auth');

const dataPath = path.join(__dirname, '../data/reservations.json');

function readData() { return JSON.parse(fs.readFileSync(dataPath, 'utf8')); }
function writeData(data) { fs.writeFileSync(dataPath, JSON.stringify(data, null, 2)); }

// GET /api/reservations (admin)
router.get('/', authMiddleware, (req, res) => {
  const reservations = readData();
  res.json(reservations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// POST /api/reservations (public)
router.post('/', (req, res) => {
  const reservations = readData();
  const newReservation = {
    id: uuidv4(),
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  reservations.push(newReservation);
  writeData(reservations);
  res.status(201).json(newReservation);
});

// PUT /api/reservations/:id (admin)
router.put('/:id', authMiddleware, (req, res) => {
  const reservations = readData();
  const index = reservations.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Reservation not found' });
  reservations[index] = { ...reservations[index], ...req.body };
  writeData(reservations);
  res.json(reservations[index]);
});

// DELETE /api/reservations/:id (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  let reservations = readData();
  reservations = reservations.filter(r => r.id !== req.params.id);
  writeData(reservations);
  res.json({ message: 'Reservation deleted' });
});

module.exports = router;
