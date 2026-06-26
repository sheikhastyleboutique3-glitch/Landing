/**
 * Main Application - Gaimer W Kahi Frontend
 * Menu loading, gallery, testimonials, contact form, i18n, cursor
 */
(function() {
  'use strict';
  const API = '';
  // Detect if running on GitHub Pages (no backend) - use static JSON files
  const isStatic = window.location.hostname.includes('github.io') || window.location.protocol === 'file:';
  const DATA_PATH = isStatic ? 'data' : '/api';

  // ========== LOADER ==========
  const loader = document.getElementById('loader');
  const progress = document.getElementById('loader-progress');
  let p = 0;
  const loadInt = setInterval(() => {
    p += Math.random()*15;
    if (p >= 100) { p=100; clearInterval(loadInt); setTimeout(()=>{loader.classList.add('hidden');document.body.style.overflow='';},400); }
    if(progress) progress.style.width = p+'%';
  }, 80);
  document.body.style.overflow = 'hidden';

  // ========== CUSTOM CURSOR ==========
  const cursor = document.getElementById('cursor');
  if (cursor && window.matchMedia('(pointer:fine)').matches) {
    const dot = cursor.querySelector('.cursor-dot');
    const ring = cursor.querySelector('.cursor-ring');
    let cx=0,cy=0,tx=0,ty=0;
    document.addEventListener('mousemove', e => { tx=e.clientX; ty=e.clientY; });
    (function upd(){ cx+=(tx-cx)*0.15; cy+=(ty-cy)*0.15;
      if(dot){dot.style.left=tx+'px';dot.style.top=ty+'px';}
      if(ring){ring.style.left=cx+'px';ring.style.top=cy+'px';}
      requestAnimationFrame(upd);
    })();
    document.querySelectorAll('a,button,.menu-card,.gallery-item').forEach(el=>{
      el.addEventListener('mouseenter',()=>cursor.classList.add('hover'));
      el.addEventListener('mouseleave',()=>cursor.classList.remove('hover'));
    });
  }

  // ========== NAV TOGGLE ==========
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    }));
  }

  // ========== SMOOTH SCROLL ==========
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      const t = document.querySelector(this.getAttribute('href'));
      if (t) gsap.to(window, { duration:1, scrollTo:{y:t,offsetY:80}, ease:'power3.inOut' });
    });
  });

  // ========== ACTIVE NAV ==========
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (window.pageYOffset >= s.offsetTop - 200) cur = s.id; });
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#'+cur);
    });
  });

  // Fix image paths for GitHub Pages
  const IMG_PREFIX = '';

  // ========== LOAD MENU ==========
  async function loadMenu(category='breakfast') {
    try {
      const res = await fetch(DATA_PATH + '/menu.json');
      const allItems = await res.json();
      const items = allItems.filter(i => i.category === category);
      const grid = document.getElementById('menu-grid');
      if (!grid) return;
      grid.innerHTML = items.map(item => `
        <div class="menu-card" data-id="${item.id}">
          <div class="menu-card-visual">
            <img src="${IMG_PREFIX}${item.image}" alt="${item.nameAr || item.name}" class="responsive-img" loading="lazy">
            ${item.featured ? `<span class="menu-card-badge">${isArabic ? 'مميز' : 'Popular'}</span>` : ''}
          </div>
          <div class="menu-card-info">
            <h3 class="menu-card-title">${isArabic ? (item.nameAr || item.name) : item.name}</h3>
            <p class="menu-card-desc">${isArabic ? (item.descriptionAr || item.description) : item.description}</p>
            <div class="menu-card-footer">
              <span class="menu-price">${item.price} ${isArabic ? 'ر.ق' : 'QAR'}</span>
              <button class="menu-add-btn" title="${isArabic ? 'أضف للطلب' : 'Add to order'}">+</button>
            </div>
          </div>
        </div>
      `).join('');
      gsap.from('.menu-card', { opacity:0, y:30, duration:0.6, stagger:0.1, ease:'power3.out' });
    } catch(err) { console.error('Menu load error:', err); }
  }

  // Menu tabs
  document.querySelectorAll('.menu-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.menu-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      loadMenu(tab.dataset.category);
    });
  });

  // ========== LOAD GALLERY ==========
  async function loadGallery() {
    try {
      const res = await fetch(DATA_PATH + '/gallery.json');
      const items = await res.json();
      const grid = document.getElementById('gallery-grid');
      if (!grid) return;
      grid.innerHTML = items.map((item, i) => `
        <div class="gallery-item ${i===0||i===4 ? 'large' : ''}">
          <img src="${IMG_PREFIX}${item.image}" alt="${isArabic ? (item.titleAr || item.title) : item.title}" class="responsive-img" loading="lazy">
          <span class="gallery-label">${isArabic ? (item.titleAr || item.title) : item.title}</span>
        </div>
      `).join('');
    } catch(err) { console.error('Gallery load error:', err); }
  }

  // ========== LOAD TESTIMONIALS ==========
  async function loadTestimonials() {
    try {
      const res = await fetch(DATA_PATH + '/testimonials.json');
      const items = await res.json();
      const slider = document.getElementById('testimonials-slider');
      if (!slider) return;
      slider.innerHTML = items.map(t => `
        <div class="testimonial-card">
          <div class="testimonial-rating">${'<span class="star">★</span>'.repeat(t.rating)}</div>
          <p class="testimonial-text">"${isArabic ? (t.textAr || t.text) : t.text}"</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar" style="background:linear-gradient(135deg,var(--color-gold),var(--color-amber));width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:1.1rem;">${(isArabic ? (t.nameAr || t.name) : t.name).charAt(0)}</div>
            <div><div class="testimonial-name">${isArabic ? (t.nameAr || t.name) : t.name}</div><div class="testimonial-role">${t.date}</div></div>
          </div>
        </div>
      `).join('');
    } catch(err) { console.error('Testimonials load error:', err); }
  }

  // ========== CONTACT FORM ==========
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(contactForm));
      try {
        await fetch((isStatic ? '' : API) + '/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
        contactForm.style.display = 'none';
        document.getElementById('form-success').style.display = 'flex';
      } catch(err) { alert('Error sending message. Please try again.'); }
    });
  }

  // ========== COUNTER ANIMATION ==========
  const counters = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ animateCount(e.target); obs.unobserve(e.target); } });
  }, {threshold:0.5});
  counters.forEach(c => obs.observe(c));

  function animateCount(el) {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { el.textContent = target.toLocaleString(); clearInterval(timer); }
      else el.textContent = Math.floor(current).toLocaleString();
    }, 30);
  }

  // ========== LANGUAGE TOGGLE ==========
  const langBtn = document.getElementById('lang-toggle');
  let isArabic = true; // Site starts in Arabic
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      isArabic = !isArabic;
      document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
      document.documentElement.lang = isArabic ? 'ar' : 'en';
      langBtn.querySelector('.lang-en').style.display = isArabic ? 'inline' : 'none';
      langBtn.querySelector('.lang-ar').style.display = isArabic ? 'none' : 'inline';
      // Reload menu/gallery/testimonials in correct language
      const activeTab = document.querySelector('.menu-tab.active');
      if (activeTab) loadMenu(activeTab.dataset.category);
      loadGallery();
      loadTestimonials();
    });
  }

  // ========== TILT EFFECT ==========
  if (window.matchMedia('(pointer:fine)').matches) {
    document.addEventListener('mousemove', e => {
      document.querySelectorAll('.menu-card,.gallery-item').forEach(card => {
        const rect = card.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          const x = (e.clientX-rect.left)/rect.width-0.5;
          const y = (e.clientY-rect.top)/rect.height-0.5;
          card.style.transform = `perspective(1000px) rotateY(${x*5}deg) rotateX(${-y*5}deg) translateY(-4px)`;
        }
      });
    });
    document.querySelectorAll('.menu-card,.gallery-item').forEach(c => {
      c.addEventListener('mouseleave', () => { c.style.transform = ''; });
    });
  }

  // ========== INIT ==========
  document.addEventListener('DOMContentLoaded', () => {
    loadMenu('breakfast');
    loadGallery();
    loadTestimonials();
  });

  // If DOM already loaded
  if (document.readyState !== 'loading') {
    loadMenu('breakfast');
    loadGallery();
    loadTestimonials();
  }
})();
