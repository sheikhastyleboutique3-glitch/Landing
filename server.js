/**
 * Gaimer W Kahi - Full-Stack Restaurant Server
 * Express.js backend with REST API, admin panel, and static frontend
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// API Routes
app.use('/api/menu', require('./server/routes/menu'));
app.use('/api/orders', require('./server/routes/orders'));
app.use('/api/reservations', require('./server/routes/reservations'));
app.use('/api/gallery', require('./server/routes/gallery'));
app.use('/api/contact', require('./server/routes/contact'));
app.use('/api/settings', require('./server/routes/settings'));
app.use('/api/auth', require('./server/routes/auth'));
app.use('/api/testimonials', require('./server/routes/testimonials'));

// Admin Panel route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// Frontend route (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🍽️  Gaimer W Kahi Server Running`);
  console.log(`   Frontend: http://localhost:${PORT}`);
  console.log(`   Admin:    http://localhost:${PORT}/admin`);
  console.log(`   API:      http://localhost:${PORT}/api\n`);
});

module.exports = app;
