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

  // Translation data
  const translations = {
    ar: {
      'nav.home': 'الرئيسية', 'nav.story': 'قصتنا', 'nav.menu': 'القائمة',
      'nav.gallery': 'المعرض', 'nav.reviews': 'آراء العملاء', 'nav.contact': 'تواصل معنا',
      'nav.order': 'اطلب الآن',
      'hero.badge': 'مطبخ عراقي أصيل • الدوحة، قطر',
      'hero.line1': 'فن صناعة', 'hero.line2': 'القيمر والكاهي',
      'hero.subtitle': 'عِش تجربة الأكل العراقي التقليدي بلمسة عصرية. طبقات ذهبية من الكاهي المقرمش متوّجة بالقيمر الحريري — وصفة عراقية عريقة، أتقنّاها في قلب الدوحة.',
      'hero.cta1': 'استكشف القائمة', 'hero.cta2': 'اطلب توصيل',
      'story.tag': 'تراثنا', 'story.title': 'إرث من <span class="highlight">النكهات</span>',
      'story.lead': 'لأجيال عديدة، كانت رائحة الكاهي الطازج توقظ العائلات في أرجاء العراق. في قيمر وكاهي، نُحيي هذا التقليد العريق في قطر بنفس الحب والأصالة والشغف.',
      'story.body': 'كاهينا مصنوع من طبقات رقيقة من عجين الفيلو المزبّد، يُخبز حتى يصبح ذهبياً ومقرمشاً، ثم يُرش بالعسل العطري ودبس التمر. مع قيمرنا المميز — كل قضمة رحلة عبر قرون من الفن الطهوي.',
      'story.stat1': 'سنوات من التقاليد', 'story.stat2': 'عميل سعيد', 'story.stat3': 'فروع في الدوحة',
      'menu.tag': 'قائمتنا', 'menu.title': 'أطباقنا <span class="highlight">المميزة</span>',
      'menu.desc': 'كل طبق يحكي قصة تقليد، يُحضّر طازجاً يومياً بأجود المكونات',
      'menu.cat1': 'فطور', 'menu.cat2': 'حلويات', 'menu.cat3': 'مشروبات', 'menu.cat4': 'عروض خاصة',
      'gallery.tag': 'وليمة بصرية', 'gallery.title': '<span class="highlight">معرض</span> الصور',
      'reviews.tag': 'ماذا يقولون', 'reviews.title': 'آراء <span class="highlight">عملائنا</span>',
      'order.tag': 'توصيل سريع', 'order.title': 'نوصّل لـ<span class="highlight">بابك</span>',
      'order.desc': 'كاهي وقيمر طازج يوصلك ساخن في كل أنحاء الدوحة. اطلب عبر خدمة التوصيل السريع.',
      'order.f1': 'توصيل خلال 30 دقيقة', 'order.f2': 'طازج يومياً', 'order.f3': 'جودة مضمونة',
      'order.cta1': 'اطلب الآن', 'order.cta2': 'اطلب واتساب',
      'contact.tag': 'تواصل معنا', 'contact.title': 'زُرنا <span class="highlight">اليوم</span>',
      'contact.info': 'معلومات التواصل', 'contact.form': 'أرسل رسالة',
      'contact.hours': 'يومياً 6:00 صباحاً - 12:00 منتصف الليل',
      'contact.send': 'إرسال',
      'footer.desc': 'تجربة فطور عراقي أصيل في الدوحة، قطر. كاهي وقيمر تقليدي يُقدّم بحب منذ 2011.',
      'footer.quick': 'روابط سريعة', 'footer.visit': 'زُرنا', 'footer.connect': 'تواصل',
      'footer.open': 'مفتوح يومياً', 'footer.delivery': 'توصيل سريع متوفر',
      'footer.orderOnline': 'اطلب اونلاين', 'footer.copy': '© 2026 قيمر وكاهي. جميع الحقوق محفوظة.'
    },
    en: {
      'nav.home': 'Home', 'nav.story': 'Our Story', 'nav.menu': 'Menu',
      'nav.gallery': 'Gallery', 'nav.reviews': 'Reviews', 'nav.contact': 'Contact',
      'nav.order': 'Order Now',
      'hero.badge': 'AUTHENTIC IRAQI CUISINE • DOHA, QATAR',
      'hero.line1': 'The Art of', 'hero.line2': 'Gaimer & Kahi',
      'hero.subtitle': 'Live the experience of Iraqi traditional food with a touch of fusion. Golden layers of flaky Kahi pastry crowned with velvety Gaimer cream — perfected in the heart of Doha.',
      'hero.cta1': 'Explore Menu', 'hero.cta2': 'Order Delivery',
      'story.tag': 'OUR HERITAGE', 'story.title': 'A Legacy of <span class="highlight">Flavor</span>',
      'story.lead': 'For generations, the aroma of freshly baked Kahi has awakened families across Iraq. At Gaimer W Kahi, we bring this cherished tradition to Qatar with love and authenticity.',
      'story.body': 'Our Kahi is crafted from layers of delicate phyllo dough, baked golden and crisp, drizzled with aromatic honey and date syrup. Paired with our signature Gaimer — every bite is a journey through centuries of culinary artistry.',
      'story.stat1': 'Years of Tradition', 'story.stat2': 'Happy Customers', 'story.stat3': 'Locations in Doha',
      'menu.tag': 'OUR MENU', 'menu.title': 'Signature <span class="highlight">Delights</span>',
      'menu.desc': 'Every dish tells a story of tradition, crafted fresh daily with premium ingredients',
      'menu.cat1': 'Breakfast', 'menu.cat2': 'Pastries', 'menu.cat3': 'Drinks', 'menu.cat4': 'Specials',
      'gallery.tag': 'VISUAL FEAST', 'gallery.title': 'Our <span class="highlight">Gallery</span>',
      'reviews.tag': 'WHAT THEY SAY', 'reviews.title': 'Customer <span class="highlight">Reviews</span>',
      'order.tag': 'EXPRESS DELIVERY', 'order.title': 'Delivered to <span class="highlight">Your Door</span>',
      'order.desc': 'Fresh Kahi & Gaimer delivered hot across Doha. Order via our express delivery service.',
      'order.f1': '30 Min Delivery', 'order.f2': 'Made Fresh Daily', 'order.f3': 'Quality Guaranteed',
      'order.cta1': 'Order Express', 'order.cta2': 'WhatsApp Order',
      'contact.tag': 'GET IN TOUCH', 'contact.title': 'Visit <span class="highlight">Us</span>',
      'contact.info': 'Contact Information', 'contact.form': 'Send a Message',
      'contact.hours': '6:00 AM - 12:00 AM Daily',
      'contact.send': 'Send Message',
      'footer.desc': 'Authentic Iraqi Breakfast Experience in Doha, Qatar. Traditional Kahi & Gaimer served with love since 2011.',
      'footer.quick': 'Quick Links', 'footer.visit': 'Visit Us', 'footer.connect': 'Connect',
      'footer.open': 'Open Daily', 'footer.delivery': 'Express Delivery',
      'footer.orderOnline': 'Order Online', 'footer.copy': '© 2026 Gaimer W Kahi. All rights reserved.'
    }
  };

  function applyLanguage(lang) {
    const t = translations[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) el.innerHTML = t[key];
    });
  }

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      isArabic = !isArabic;
      document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
      document.documentElement.lang = isArabic ? 'ar' : 'en';
      langBtn.querySelector('.lang-en').style.display = isArabic ? 'inline' : 'none';
      langBtn.querySelector('.lang-ar').style.display = isArabic ? 'none' : 'inline';
      applyLanguage(isArabic ? 'ar' : 'en');
      // Reload dynamic content
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
