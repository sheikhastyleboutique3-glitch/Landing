/**
 * GSAP ScrollTrigger Animations
 */
(function() {
  'use strict';
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  document.addEventListener('DOMContentLoaded', () => {
    // Hero entrance
    const heroTl = gsap.timeline({ delay: 1.2 });
    heroTl.from('.hero-badge', { opacity:0, y:20, duration:0.8 })
      .from('.hero-title .title-line', { opacity:0, y:40, duration:1, stagger:0.2 }, '-=0.4')
      .from('.hero-subtitle', { opacity:0, y:20, duration:0.8 }, '-=0.5')
      .from('.hero-actions .btn', { opacity:0, y:20, duration:0.6, stagger:0.15 }, '-=0.4')
      .from('.hero-scroll', { opacity:0, duration:1 }, '-=0.2');

    // Nav scroll
    ScrollTrigger.create({ start:'top -80', onUpdate: self => {
      document.getElementById('nav')?.classList.toggle('scrolled', self.progress > 0);
    }});

    // Story
    gsap.from('.story .section-tag', { scrollTrigger:{trigger:'.story',start:'top 80%'}, opacity:0, y:20, duration:0.8 });
    gsap.from('.story .section-title', { scrollTrigger:{trigger:'.story',start:'top 75%'}, opacity:0, y:30, duration:1 });
    gsap.from('.story-lead', { scrollTrigger:{trigger:'.story-text',start:'top 80%'}, opacity:0, y:30, duration:1 });
    gsap.from('.stat-item', { scrollTrigger:{trigger:'.story-stats',start:'top 85%'}, opacity:0, y:20, duration:0.8, stagger:0.2 });
    gsap.from('.story-image-wrapper', { scrollTrigger:{trigger:'.story-visual',start:'top 85%'}, opacity:0, scale:0.9, duration:1.2 });

    // Menu
    gsap.from('.menu .section-header', { scrollTrigger:{trigger:'.menu',start:'top 80%'}, opacity:0, y:30, duration:1 });
    gsap.from('.menu-categories', { scrollTrigger:{trigger:'.menu-categories',start:'top 85%'}, opacity:0, y:20, duration:0.8 });

    // Gallery
    gsap.from('.gallery .section-header', { scrollTrigger:{trigger:'.gallery',start:'top 80%'}, opacity:0, y:30, duration:1 });
    gsap.from('.gallery-item', { scrollTrigger:{trigger:'.gallery-grid',start:'top 80%'}, opacity:0, scale:0.9, duration:0.8, stagger:{each:0.1,from:'random'} });

    // Testimonials
    gsap.from('.testimonials .section-header', { scrollTrigger:{trigger:'.testimonials',start:'top 80%'}, opacity:0, y:30, duration:1 });
    gsap.from('.testimonial-card', { scrollTrigger:{trigger:'.testimonials-slider',start:'top 85%'}, opacity:0, x:50, duration:0.8, stagger:0.15 });

    // Order
    gsap.from('.order-wrapper', { scrollTrigger:{trigger:'.order',start:'top 75%'}, opacity:0, y:50, duration:1.2 });
    gsap.from('.order-feature', { scrollTrigger:{trigger:'.order-features',start:'top 85%'}, opacity:0, x:-20, duration:0.6, stagger:0.15 });

    // Contact
    gsap.from('.contact .section-header', { scrollTrigger:{trigger:'.contact',start:'top 80%'}, opacity:0, y:30, duration:1 });
    gsap.from('.contact-info', { scrollTrigger:{trigger:'.contact-grid',start:'top 80%'}, opacity:0, x:-30, duration:1 });
    gsap.from('.contact-form', { scrollTrigger:{trigger:'.contact-grid',start:'top 80%'}, opacity:0, x:30, duration:1 });

    // Parallax on 3D
    if (window.threeScene) {
      gsap.to(window.threeScene.torus.position, { scrollTrigger:{trigger:'body',start:'top top',end:'bottom bottom',scrub:2}, x:-2, y:3 });
      gsap.to(window.threeScene.torus2.position, { scrollTrigger:{trigger:'body',start:'top top',end:'bottom bottom',scrub:2}, x:2, y:-2 });
    }
  });
})();
