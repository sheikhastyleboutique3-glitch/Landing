/**
 * GSAP ScrollTrigger Animations
 * Handles all scroll-driven animations and reveals
 */

(function() {
    'use strict';

    gsap.registerPlugin(ScrollTrigger);

    // Wait for DOM
    document.addEventListener('DOMContentLoaded', () => {

        // Hero animations on load
        const heroTl = gsap.timeline({ delay: 0.5 });
        heroTl
            .from('.hero-badge', { 
                opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' 
            })
            .from('.hero-title .title-line', { 
                opacity: 0, y: 40, duration: 1, stagger: 0.2, ease: 'power3.out' 
            }, '-=0.4')
            .from('.hero-subtitle', { 
                opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' 
            }, '-=0.5')
            .from('.hero-actions .btn', { 
                opacity: 0, y: 20, duration: 0.6, stagger: 0.15, ease: 'power3.out' 
            }, '-=0.4')
            .from('.hero-scroll', { 
                opacity: 0, duration: 1, ease: 'power2.out' 
            }, '-=0.2');

        // Nav scroll behavior
        ScrollTrigger.create({
            start: 'top -80',
            onUpdate: (self) => {
                const nav = document.getElementById('nav');
                if (self.direction === 1 && self.progress > 0) {
                    nav.classList.add('scrolled');
                } else if (self.progress === 0) {
                    nav.classList.remove('scrolled');
                }
            }
        });


        // Story section animations
        gsap.from('.section-header .section-tag', {
            scrollTrigger: {
                trigger: '.story',
                start: 'top 80%',
            },
            opacity: 0, y: 20, duration: 0.8
        });

        gsap.from('.story .section-title', {
            scrollTrigger: {
                trigger: '.story',
                start: 'top 75%',
            },
            opacity: 0, y: 30, duration: 1, ease: 'power3.out'
        });

        gsap.from('.story-lead', {
            scrollTrigger: {
                trigger: '.story-text',
                start: 'top 80%',
            },
            opacity: 0, y: 30, duration: 1, ease: 'power3.out'
        });

        gsap.from('.story-text p:not(.story-lead)', {
            scrollTrigger: {
                trigger: '.story-text',
                start: 'top 70%',
            },
            opacity: 0, y: 20, duration: 0.8, delay: 0.3
        });

        // Stats counter animation
        gsap.from('.stat-item', {
            scrollTrigger: {
                trigger: '.story-stats',
                start: 'top 85%',
            },
            opacity: 0, y: 20, duration: 0.8, stagger: 0.2
        });

        // Story visual parallax
        gsap.from('.visual-card', {
            scrollTrigger: {
                trigger: '.story-visual',
                start: 'top 85%',
            },
            opacity: 0, scale: 0.9, duration: 1.2, ease: 'power3.out'
        });

        gsap.to('.visual-card', {
            scrollTrigger: {
                trigger: '.story-visual',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: -30, ease: 'none'
        });


        // Menu section animations
        gsap.from('.menu .section-header', {
            scrollTrigger: {
                trigger: '.menu',
                start: 'top 80%',
            },
            opacity: 0, y: 30, duration: 1
        });

        gsap.from('.menu-categories', {
            scrollTrigger: {
                trigger: '.menu-categories',
                start: 'top 85%',
            },
            opacity: 0, y: 20, duration: 0.8
        });

        // Menu cards stagger
        ScrollTrigger.batch('.menu-card:not(.hidden)', {
            onEnter: (batch) => {
                gsap.from(batch, {
                    opacity: 0, y: 40, duration: 0.8,
                    stagger: 0.1, ease: 'power3.out'
                });
            },
            start: 'top 85%',
            once: true
        });

        // Gallery animations
        gsap.from('.gallery .section-header', {
            scrollTrigger: {
                trigger: '.gallery',
                start: 'top 80%',
            },
            opacity: 0, y: 30, duration: 1
        });

        gsap.from('.gallery-item', {
            scrollTrigger: {
                trigger: '.gallery-grid',
                start: 'top 80%',
            },
            opacity: 0, scale: 0.9, duration: 0.8,
            stagger: { each: 0.1, from: 'random' },
            ease: 'power3.out'
        });

        // Gallery parallax on scroll
        gsap.utils.toArray('.gallery-item').forEach((item, i) => {
            gsap.to(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                y: (i % 2 === 0) ? -20 : 20,
                ease: 'none'
            });
        });


        // Order section animations
        gsap.from('.order-wrapper', {
            scrollTrigger: {
                trigger: '.order',
                start: 'top 75%',
            },
            opacity: 0, y: 50, duration: 1.2, ease: 'power3.out'
        });

        gsap.from('.order-feature', {
            scrollTrigger: {
                trigger: '.order-features',
                start: 'top 85%',
            },
            opacity: 0, x: -20, duration: 0.6,
            stagger: 0.15, ease: 'power3.out'
        });

        // Footer animations
        gsap.from('.footer-top', {
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 90%',
            },
            opacity: 0, y: 30, duration: 1
        });

        // Parallax effect on 3D shapes via scroll
        if (window.threeScene) {
            gsap.to(window.threeScene.torus.position, {
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 2
                },
                x: -2, y: 3, ease: 'none'
            });

            gsap.to(window.threeScene.torus2.position, {
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 2
                },
                x: 2, y: -2, ease: 'none'
            });
        }
    });
})();
