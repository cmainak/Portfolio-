/* ============================================================
   UX Portfolio — script.js
   ============================================================ */

   'use strict';

   /* ============================================================
      1. Global Utilities & Foundation
      ============================================================ */
   
   // 1.1 Theme Toggle (Dark / Light)
   (function () {
     const toggle = document.querySelector('.theme-toggle');
     if (!toggle) return;
   
     function syncButtonState(theme) {
       const isDark = theme === 'dark';
       toggle.setAttribute('aria-pressed', String(isDark));
       toggle.setAttribute(
         'aria-label',
         isDark ? 'Switch to light mode' : 'Switch to dark mode'
       );
     }
   
     syncButtonState(document.documentElement.getAttribute('data-theme'));
   
     toggle.addEventListener('click', function () {
       const current = document.documentElement.getAttribute('data-theme');
       const next = current === 'dark' ? 'light' : 'dark';
   
       document.documentElement.setAttribute('data-theme', next);
       syncButtonState(next);
   
       try {
         localStorage.setItem('color-scheme', next);
       } catch (e) {}
     });
   })();
   
   // 1.2 Dynamic Nav Height Measurement
   (function () {
     const header = document.querySelector('.site-header');
     if (!header) return;
   
     function setNavHeight() {
       document.documentElement.style.setProperty(
         '--nav-height',
         header.offsetHeight + 'px'
       );
     }
   
     setNavHeight();
     window.addEventListener('resize', setNavHeight);
   })();
   
   // 1.3 Dynamic Footer Year
   (function () {
     const yearEl = document.getElementById('footer-year');
     if (yearEl) yearEl.textContent = new Date().getFullYear();
   })();
   
   
   /* ============================================================
      2. Navigation & Menus
      ============================================================ */
   
   // 2.1 Hamburger Menu (Mobile Navigation)
   (function () {
     const menuToggle = document.querySelector('.menu-toggle');
     const navLinks   = document.getElementById('nav-menu');
     if (!menuToggle || !navLinks) return;
   
     const focusableSelector = 'a[href], button:not([disabled])';
   
     function openMenu() {
       navLinks.classList.add('is-open');
       menuToggle.setAttribute('aria-expanded', 'true');
       menuToggle.setAttribute('aria-label', 'Close navigation menu');
       document.body.classList.add('menu-is-open');
       document.addEventListener('keydown', handleKeydown);
       document.addEventListener('click', handleOutsideClick);
     }
   
     function closeMenu({ returnFocus = false } = {}) {
       navLinks.classList.remove('is-open');
       menuToggle.setAttribute('aria-expanded', 'false');
       menuToggle.setAttribute('aria-label', 'Open navigation menu');
       document.body.classList.remove('menu-is-open');
       document.removeEventListener('keydown', handleKeydown);
       document.removeEventListener('click', handleOutsideClick);
       if (returnFocus) menuToggle.focus();
     }
   
     function handleOutsideClick(event) {
       if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
         closeMenu();
       }
     }
   
     function handleKeydown(event) {
       if (event.key === 'Escape') {
         closeMenu({ returnFocus: true });
         return;
       }
   
       if (event.key !== 'Tab') return;
   
       const focusable = [menuToggle, ...navLinks.querySelectorAll(focusableSelector)];
       const first = focusable[0];
       const last  = focusable[focusable.length - 1];
   
       if (event.shiftKey && document.activeElement === first) {
         event.preventDefault();
         last.focus();
       } else if (!event.shiftKey && document.activeElement === last) {
         event.preventDefault();
         first.focus();
       }
     }
   
     menuToggle.addEventListener('click', function () {
       const isOpen = navLinks.classList.contains('is-open');
       isOpen ? closeMenu() : openMenu();
     });
   
     navLinks.querySelectorAll('a').forEach(function (link) {
       link.addEventListener('click', function () {
         closeMenu();
       });
     });
   
     const desktopQuery = window.matchMedia('(min-width: 768px)');
     desktopQuery.addEventListener('change', function (event) {
       if (event.matches && navLinks.classList.contains('is-open')) {
         closeMenu();
       }
     });
   })();
   
   // 2.2 Click-Based Dropdown (Projects Menu)
   (function () {
     const dropdown = document.querySelector('.dropdown');
     const toggleBtn = dropdown?.querySelector('.dropdown-toggle');
     
     if (!dropdown || !toggleBtn) return;
     
     toggleBtn.addEventListener('click', function(e) {
       e.preventDefault();
       const isExpanded = dropdown.classList.toggle('is-expanded');
       toggleBtn.setAttribute('aria-expanded', isExpanded);
     });
   
     document.addEventListener('click', function(e) {
       if (!dropdown.contains(e.target) && dropdown.classList.contains('is-expanded')) {
         dropdown.classList.remove('is-expanded');
         toggleBtn.setAttribute('aria-expanded', 'false');
       }
     });
   
     document.addEventListener('keydown', function(e) {
       if (e.key === 'Escape' && dropdown.classList.contains('is-expanded')) {
         dropdown.classList.remove('is-expanded');
         toggleBtn.setAttribute('aria-expanded', 'false');
         toggleBtn.focus(); 
       }
     });
   })();
   
   // 2.3 Scroll Shadow on Header
   (function () {
     const header = document.querySelector('.site-header');
     const hero   = document.getElementById('hero');
     if (!header || !hero) return;
   
     const observer = new IntersectionObserver(
       function (entries) {
         header.classList.toggle('is-scrolled', !entries[0].isIntersecting);
       },
       { threshold: 0, rootMargin: '-1px 0px 0px 0px' }
     );
   
     observer.observe(hero);
   })();
   
   
   /* ============================================================
      3. Intersection Observers
      ============================================================ */
   
   // 3.1 Active Nav Link Observer
   (function () {
     const sections = document.querySelectorAll('main section[id]');
     const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
     if (!sections.length || !navLinks.length) return;
   
     const activeObserver = new IntersectionObserver(
       function (entries) {
         entries.forEach(function (entry) {
           if (!entry.isIntersecting) return;
           
           navLinks.forEach(function (link) {
             // CRITICAL FIX: Changed from 'active' to 'is-active' to match CSS
             link.classList.remove('is-active');
           });
           
           const match = document.querySelector(
             '.nav-links a[href="#' + entry.target.id + '"]'
           );
           if (match) match.classList.add('is-active');
         });
       },
       { rootMargin: '-10% 0px -75% 0px', threshold: 0 }
     );
   
     sections.forEach(function (section) {
       activeObserver.observe(section);
     });
   })();
   
   // 3.2 Entrance Animations
   (function () {
     if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
     if (!('IntersectionObserver' in window)) return;
   
     document.querySelectorAll('.bento-card').forEach(function (card, i) {
       card.style.setProperty('--stagger-delay', (i * 120) + 'ms');
     });
   
     // CRITICAL FIX: Updated target selectors to match HTML structure
     const targets = document.querySelectorAll(
      'section:not(#hero) h2, .about-photo, .about-content, .bento-card, .contact-info, .contact-form'
     );
   
     const animationObserver = new IntersectionObserver(
       function (entries) {
         entries.forEach(function (entry) {
           if (!entry.isIntersecting) return;
           entry.target.classList.add('is-visible');
           animationObserver.unobserve(entry.target);
         });
       },
       { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
     );
   
     targets.forEach(function (el) {
       const rect = el.getBoundingClientRect();
       if (rect.top > window.innerHeight * 0.9) {
         el.classList.add('will-animate');
       }
       animationObserver.observe(el);
     });
   })();
   
   
   /* ============================================================
      4. Micro-Interactions
      ============================================================ */
   
   // 4.1 Magnetic CTA Buttons
   (function () {
     if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
   
     const magneticButtons = document.querySelectorAll('.cta-button');
     if (!magneticButtons.length) return;
   
     magneticButtons.forEach(function (btn) {
       btn.addEventListener('mousemove', function (e) {
         const rect = btn.getBoundingClientRect();
         const centerX = rect.width / 2;
         const centerY = rect.height / 2;
         
         const mouseX = e.clientX - rect.left - centerX;
         const mouseY = e.clientY - rect.top - centerY;
   
         const pullX = mouseX * 0.3;
         const pullY = mouseY * 0.3;
   
         btn.style.setProperty('--tx', pullX + 'px');
         btn.style.setProperty('--ty', pullY + 'px');
       });
   
       btn.addEventListener('mouseleave', function () {
         btn.style.setProperty('--tx', '0px');
         btn.style.setProperty('--ty', '0px');
       });
     });
   })();
   
   
   /* ============================================================
      5. Scroll Effects (Parallax & GSAP)
      ============================================================ */
   
   // 5.1 Optimized Parallax Image Reveals
   (function () {
     if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
   
     const parallaxImages = document.querySelectorAll('.bento-image-layer img');
     if (!parallaxImages.length) return;
   
     let ticking = false;
   
     function renderParallax() {
       parallaxImages.forEach(function (img) {
         const card = img.closest('.bento-card');
         if (!card) return;
   
         const rect = card.getBoundingClientRect();
         const viewportHeight = window.innerHeight;
   
         if (rect.top < viewportHeight && rect.bottom > 0) {
           const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
           const yPos = (progress * 20) - 10;
           
           img.style.transform = 'translateY(' + yPos + '%)';
         }
       });
       
       ticking = false; // Reset lock after frame executes
     }
   
     // CRITICAL FIX: Attached to scroll event instead of infinitely looping requestAnimationFrame
     window.addEventListener('scroll', function() {
       if (!ticking) {
         window.requestAnimationFrame(renderParallax);
         ticking = true;
       }
     }, { passive: true });
   
     // Initial call on load
     renderParallax();
   })();
   
   // 5.2 GSAP Morph Transition
   (function () {
     // Ensure GSAP exists before trying to register it
     if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
   
     gsap.registerPlugin(ScrollTrigger);
   
     const morphSection = document.getElementById('scroll-morph-section');
     const morphPath = document.getElementById('morph-path');
     
     if (!morphSection || !morphPath) return;
   
     const tl = gsap.timeline({
       scrollTrigger: {
         trigger: "#scroll-morph-section",
         start: "top top",
         end: "bottom bottom",
         scrub: 1, 
         pin: true,
         anticipatePin: 1
       }
     });
   
     const chromePath = "M50,20 L80,50 L50,80 L20,50 Z"; 
   
     tl.to("#morph-path", {
       duration: 1,
       attr: { d: chromePath }, 
       rotation: 360,          
       ease: "power2.inOut"    
     });
   })();