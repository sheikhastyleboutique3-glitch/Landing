# Gaimer W Kahi - Full-Stack Restaurant Website

**قيمر وكاهي** — Live the experience of Iraqi traditional food with a touch of fusion.

A modern, immersive full-stack restaurant website for Gaimer W Kahi, an authentic Iraqi breakfast & cuisine restaurant in Doha, Qatar.

## Features

### Frontend
- **3D Animated Background** — Three.js scene with floating steam particles, plates, bowls, and warm food-themed orbs
- **GSAP ScrollTrigger** — Scroll-driven animations, parallax effects, staggered reveals
- **Responsive Video Backgrounds** — Hero section and order section with embedded videos
- **Blue Sky Color Theme** — Modern blue sky color palette with warm food accents
- **Interactive Menu** — Tab-filtered categories (Breakfast, Pastries, Drinks, Specials)
- **Gallery Section** — Responsive image grid with hover effects
- **Testimonials Slider** — Horizontal scroll customer reviews
- **Contact Form** — With Google Maps embed
- **Custom Cursor** — Smooth following with magnetic hover effects
- **WhatsApp Ordering** — Floating button for direct ordering
- **Arabic/English Toggle** — Bilingual support with RTL
- **Responsive Design** — Mobile-first, works on all devices (360px to 4K)
- **SVG Food Illustrations** — 14 menu items + 8 gallery images, all hand-crafted SVGs
- **SEO Optimized** — Meta tags, Open Graph, semantic HTML

### Backend (Node.js/Express)
- **REST API** — 8 endpoints: menu, orders, reservations, gallery, contact, settings, auth, testimonials
- **JWT Authentication** — Secure admin access
- **JSON File Storage** — Simple, no database required
- **CORS & Security** — Helmet, compression, CORS middleware

### Admin Panel (`/admin`)
- **Login System** — JWT-based (default: admin / admin123)
- **Dashboard** — Stats cards, recent orders, responsive media
- **Menu CRUD** — Add, edit, delete menu items with categories
- **Orders Management** — Status tracking (pending → confirmed → delivered)
- **Reservations** — Approve/reject incoming reservations
- **Gallery Management** — Add images and videos
- **Testimonials** — Moderate customer reviews
- **Messages Inbox** — Read and manage contact form submissions
- **Settings** — Full site configuration (name, phone, hours, delivery, social links)

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# Open in browser
# Frontend: http://localhost:3000
# Admin:    http://localhost:3000/admin
```

## Admin Login
- **Username:** admin
- **Password:** admin123

## Delivery Platforms
- [Talabat](https://www.talabat.com)
- [Snoonu](https://www.snoonu.com)
- [Deliveroo](https://www.deliveroo.qa)
- [Rafeeq](https://www.rafeeq.com)
- [Express Delivery](https://linktr.ee/GWKEXPRESS.DELIVERY)

## Tech Stack
- **Frontend:** HTML5, CSS3 (Custom Properties), Three.js, GSAP ScrollTrigger
- **Backend:** Node.js, Express.js
- **Auth:** JWT (jsonwebtoken), bcryptjs
- **Storage:** JSON files (no database needed)
- **Deployment:** Ready for Render, Railway, Vercel, or any Node.js host

## Project Structure
```
├── server.js              # Express server entry point
├── package.json           # Dependencies
├── server/
│   ├── routes/            # API route handlers
│   ├── middleware/        # JWT auth middleware
│   └── data/             # JSON data files
├── public/               # Frontend
│   ├── index.html        # Main page (SPA)
│   ├── css/styles.css    # Complete stylesheet
│   ├── js/               # Three.js, GSAP, App logic
│   └── images/           # SVG menu & gallery images
└── admin/                # Admin panel
    ├── index.html        # Dashboard SPA
    ├── css/admin.css     # Admin styles
    └── js/admin.js       # Admin logic
```

## Links
- **Website:** [gaimerwkahi.com](https://www.gaimerwkahi.com)
- **Instagram:** [@gaimerwkahi](https://www.instagram.com/gaimerwkahi/)
- **Delivery:** [linktr.ee/GWKEXPRESS.DELIVERY](https://linktr.ee/GWKEXPRESS.DELIVERY)

## License
All rights reserved. Gaimer W Kahi © 2026.
