/**
 * ========================================
 * AUREVIA INTERIORS — Premium Interactions
 * ========================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ── Sticky Navbar ──
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ── Mobile Menu ──
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('mobile-open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // ── Hero Loaded Animation ──
  const hero = document.querySelector('.hero');
  if (hero) {
    setTimeout(() => hero.classList.add('loaded'), 200);
  }

  // ── Scroll Reveal Animations ──
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ── Counter Animation ──
  const counterElements = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => counterObserver.observe(el));

  function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();
    const suffix = target === 98 ? '%' : '+';

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ── Portfolio Filtering ──
  const filterBtns = document.querySelectorAll('.portfolio__filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio__item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.display = show ? '' : 'none';
        if (show) {
          item.classList.remove('visible');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => item.classList.add('visible'));
          });
        }
      });
    });
  });

  // ── Portfolio Modal ──
  const modalOverlay = document.getElementById('modalOverlay');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalDesc = document.getElementById('modalDesc');
  const modalClose = document.getElementById('modalClose');

  const projectDescriptions = {
    'The Serene Living Room': 'A masterfully curated living space featuring Italian marble flooring, custom-upholstered sofas in muted tones, and a curated art collection. Floor-to-ceiling windows bathe the space in natural light, while bespoke lighting fixtures create an intimate evening ambiance.',
    'The Gourmet Kitchen': 'A chef-inspired modular kitchen with Calacatta marble countertops, premium European hardware, and fully integrated smart appliances. The island serves as both a culinary workspace and social centerpiece, with pendant lighting adding warmth.',
    'The Modern Workspace': 'A 15,000 sqft corporate office designed to inspire innovation. Features include acoustic glass partitions, ergonomic sit-stand desks, biophilic design elements, and a premium executive boardroom with motorized blinds and integrated AV systems.',
    'The Grand Entrance': 'A double-height foyer that sets the tone for this luxury villa. A crystal chandelier cascades from a coffered ceiling, complementing the Statuario marble staircase and hand-forged iron railings. Every element is designed to make a grand first impression.',
    'The Tranquil Retreat': 'A master bedroom sanctuary featuring a custom upholstered headboard, organic linen bedding, and walnut nightstands. Layered lighting with dimmers creates a spa-like atmosphere, while floor-length curtains in raw silk frame the garden view.',
    'The Boutique Experience': 'A boutique hotel lobby that blends Art Deco influences with contemporary luxury. Rich velvet seating, brushed brass accents, and a dramatic backlit onyx bar create a memorable arrival experience for every guest.',
  };

  portfolioItems.forEach(item => {
    item.addEventListener('click', () => openModal(item));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(item);
      }
    });
  });

  function openModal(item) {
    const img = item.querySelector('img');
    const title = item.querySelector('.portfolio__item-title').textContent;
    const category = item.querySelector('.portfolio__item-cat').textContent;

    modalImage.src = img.src;
    modalImage.alt = img.alt;
    modalTitle.textContent = title;
    modalCategory.textContent = category;
    modalDesc.textContent = projectDescriptions[title] || 'A carefully crafted space that exemplifies our commitment to design excellence, premium materials, and meticulous attention to every detail.';

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
  });

  // ── Testimonials Carousel ──
  const track = document.getElementById('testimonialTrack');
  const dots = document.querySelectorAll('.testimonials__dot');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  let currentSlide = 0;
  const totalSlides = document.querySelectorAll('.testimonial-card').length;
  let autoplayInterval;

  function goToSlide(index) {
    currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  }

  prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoplay(); });
  nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoplay(); });
  dots.forEach(dot => {
    dot.addEventListener('click', () => { goToSlide(parseInt(dot.dataset.index)); resetAutoplay(); });
  });

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }
  resetAutoplay();

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  const carousel = document.querySelector('.testimonials__carousel');

  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToSlide(currentSlide + 1);
      else goToSlide(currentSlide - 1);
      resetAutoplay();
    }
  }, { passive: true });

  // ── Before/After Slider ──
  const slider = document.getElementById('beforeAfterSlider');
  const handle = document.getElementById('baHandle');
  const beforeImg = slider.querySelector('.before-after__img--before');
  let isDragging = false;

  function updateSlider(clientX) {
    const rect = slider.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const percent = (x / rect.width) * 100;
    beforeImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    handle.style.left = percent + '%';
    slider.setAttribute('aria-valuenow', Math.round(percent));
  }

  slider.addEventListener('mousedown', (e) => { isDragging = true; updateSlider(e.clientX); });
  window.addEventListener('mousemove', (e) => { if (isDragging) updateSlider(e.clientX); });
  window.addEventListener('mouseup', () => { isDragging = false; });

  slider.addEventListener('touchstart', (e) => { isDragging = true; updateSlider(e.touches[0].clientX); }, { passive: true });
  slider.addEventListener('touchmove', (e) => { if (isDragging) updateSlider(e.touches[0].clientX); }, { passive: true });
  slider.addEventListener('touchend', () => { isDragging = false; }, { passive: true });

  // ── FAQ Accordion ──
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq__answer').style.maxHeight = '0';
        other.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ── Consultation Form ──
  const form = document.getElementById('consultationForm');
  const submitBtn = document.getElementById('form-submit-btn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple validation
    const name = document.getElementById('form-name').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const email = document.getElementById('form-email').value.trim();

    if (!name || !phone || !email) {
      highlightEmptyFields();
      return;
    }

    // Send via FormSubmit AJAX
    const formData = new FormData(form);
    const originalHTML = submitBtn.innerHTML;
    
    submitBtn.innerHTML = 'Sending...';
    submitBtn.disabled = true;

    fetch(form.action, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        submitBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          Thank You! We'll Be In Touch
        `;
        submitBtn.style.background = '#4CAF50';
        
        setTimeout(() => {
          form.reset();
          submitBtn.innerHTML = originalHTML;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 4000);
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        submitBtn.innerHTML = 'Error. Please try again.';
        submitBtn.style.background = '#e74c3c';
        
        setTimeout(() => {
          submitBtn.innerHTML = originalHTML;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 4000);
    });
  });

  function highlightEmptyFields() {
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#e74c3c';
        field.addEventListener('input', function handler() {
          field.style.borderColor = '';
          field.removeEventListener('input', handler);
        }, { once: true });
      }
    });
  }

  // ── Newsletter Form ──
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = newsletterForm.querySelector('.footer__newsletter-btn');
    const input = newsletterForm.querySelector('input');
    btn.textContent = '✓ Subscribed';
    btn.style.background = '#4CAF50';
    input.value = '';
    setTimeout(() => {
      btn.textContent = 'Subscribe';
      btn.style.background = '';
    }, 3000);
  });

  // ── Active Nav Link on Scroll ──
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = navLinks.querySelectorAll('a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

  sections.forEach(section => sectionObserver.observe(section));

  // ── Lazy Loading Images ──
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    lazyImages.forEach(img => imgObserver.observe(img));
  }

  // ── Smooth Scroll for Safari ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Set min date for consultation date picker ──
  const dateInput = document.getElementById('form-date');
  if (dateInput) {
    const today = new Date();
    today.setDate(today.getDate() + 1); // minimum tomorrow
    dateInput.min = today.toISOString().split('T')[0];
  }

});
