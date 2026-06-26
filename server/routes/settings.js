const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { authMiddleware } = require('../middleware/auth');

const dataPath = path.join(__dirname, '../data/settings.json');

function readData() { return JSON.parse(fs.readFileSync(dataPath, 'utf8')); }
function writeData(data) { fs.writeFileSync(dataPath, JSON.stringify(data, null, 2)); }

// GET /api/settings (public)
router.get('/', (req, res) => {
  res.json(readData());
});

// PUT /api/settings (admin)
router.put('/', authMiddleware, (req, res) => {
  const current = readData();
  const updated = { ...current, ...req.body };
  writeData(updated);
  res.json(updated);
});

module.exports = router;
