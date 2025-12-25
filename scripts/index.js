/**
 * Flavor Sync Communications – Landing Page JavaScript
 *
 * Modern ES6+ JavaScript following Triple Ten bootcamp best practices
 * Features: Modular code, event delegation, accessibility support
 */

// ============================================
// CONFIGURATION & CONSTANTS
// ============================================

const CONFIG = {
  heroImageInterval: 5500, // milliseconds
  testimonialInterval: 6500, // milliseconds
  navbarHideDelay: 100, // scroll threshold
};

const HERO_IMAGES = [
  './assets/hero1.png',
  './assets/hero2.png',
  './assets/hero3.png',
  './assets/hero4.png',
];

// ============================================
// DOM ELEMENT SELECTORS
// ============================================

const elements = {
  navbar: document.getElementById('navbar'),
  navToggle: document.querySelector('.nav-toggle'),
  navMenu: document.querySelector('.nav-menu'),
  navLinks: document.querySelectorAll('.nav-link'),
  hero: document.querySelector('.hero'),
  testimonials: document.querySelectorAll('.testimonial'),
  form: document.querySelector('.apply-form'),
  videoPlaceholders: document.querySelectorAll('.video-placeholder'),
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function to limit rate of function execution
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================

class Navigation {
  constructor() {
    this.navbar = elements.navbar;
    this.navToggle = elements.navToggle;
    this.navMenu = elements.navMenu;
    this.navLinks = elements.navLinks;
    this.lastScrollY = window.scrollY;
    this.init();
  }

  init() {
    if (!this.navbar) return;

    // Mobile menu toggle
    this.navToggle?.addEventListener('click', () => this.toggleMobileMenu());

    // Close menu when clicking on links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        this.handleNavLinkClick(e);
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Handle scroll for navbar visibility
    window.addEventListener('scroll', debounce(() => this.handleScroll(), 100));

    // Handle ESC key to close mobile menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    const isActive = this.navMenu.classList.toggle('active');
    this.navToggle.classList.toggle('active');
    this.navToggle.setAttribute('aria-expanded', isActive);

    // Prevent body scroll when menu is open
    document.body.style.overflow = isActive ? 'hidden' : '';
  }

  closeMobileMenu() {
    this.navMenu.classList.remove('active');
    this.navToggle.classList.remove('active');
    this.navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  handleNavLinkClick(e) {
    const href = e.target.getAttribute('href');

    // Only handle internal links
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const navbarHeight = this.navbar.offsetHeight;
        const targetPosition = targetElement.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without scrolling
        history.pushState(null, null, href);

        // Close mobile menu if open
        this.closeMobileMenu();
      }
    }
  }

  handleScroll() {
    const currentScrollY = window.scrollY;

    // Show/hide navbar based on scroll direction
    if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
      this.navbar.style.transform = 'translateY(-100%)';
    } else {
      this.navbar.style.transform = 'translateY(0)';
    }

    this.lastScrollY = currentScrollY;
  }
}

// ============================================
// HERO BACKGROUND CAROUSEL
// ============================================

class HeroCarousel {
  constructor() {
    this.hero = elements.hero;
    this.images = HERO_IMAGES;
    this.currentIndex = 0;
    this.init();
  }

  init() {
    if (!this.hero) return;

    // Set initial background
    this.changeBackground();

    // Start carousel
    setInterval(() => this.changeBackground(), CONFIG.heroImageInterval);
  }

  changeBackground() {
    this.hero.style.backgroundImage = `url('${this.images[this.currentIndex]}')`;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }
}

// ============================================
// TESTIMONIALS CAROUSEL
// ============================================

class TestimonialCarousel {
  constructor() {
    this.testimonials = Array.from(elements.testimonials);
    this.currentIndex = 0;
    this.init();
  }

  init() {
    if (this.testimonials.length === 0) return;

    // Show first testimonial
    this.showTestimonial();

    // Auto-rotate testimonials
    setInterval(() => this.nextTestimonial(), CONFIG.testimonialInterval);
  }

  showTestimonial() {
    this.testimonials.forEach((testimonial, index) => {
      testimonial.classList.toggle('active', index === this.currentIndex);
    });
  }

  nextTestimonial() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    this.showTestimonial();
  }
}

// ============================================
// FORM VALIDATION
// ============================================

class FormValidator {
  constructor(form) {
    this.form = form;
    this.init();
  }

  init() {
    if (!this.form) return;

    // Prevent default HTML5 validation
    this.form.setAttribute('novalidate', 'true');

    // Real-time validation on blur
    const inputs = this.form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        // Clear error on input
        if (input.classList.contains('error')) {
          this.clearFieldError(input);
        }
      });
    });

    // Form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  validateField(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return true;

    const errorElement = formGroup.querySelector('.form-error');
    let isValid = true;
    let errorMessage = '';

    // Check required fields
    if (field.hasAttribute('required') && !field.value.trim()) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }

    // Phone validation (basic US format)
    if (field.type === 'tel' && field.value) {
      const phoneRegex = /^[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(field.value) || field.value.replace(/\D/g, '').length < 10) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }

    // Select validation
    if (field.tagName === 'SELECT' && field.hasAttribute('required') && !field.value) {
      isValid = false;
      errorMessage = 'Please make a selection';
    }

    // Checkbox validation
    if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
      isValid = false;
      errorMessage = 'This field must be checked';
    }

    if (!isValid) {
      formGroup.classList.add('error');
      if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
      }
      field.setAttribute('aria-invalid', 'true');
    } else {
      this.clearFieldError(field);
    }

    return isValid;
  }

  clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    const errorElement = formGroup.querySelector('.form-error');
    formGroup.classList.remove('error');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
    field.removeAttribute('aria-invalid');
  }

  validateForm() {
    const fields = this.form.querySelectorAll('input, select, textarea');
    let isValid = true;

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  handleSubmit(e) {
    // Validate all fields
    if (!this.validateForm()) {
      e.preventDefault();

      // Focus on first error
      const firstError = this.form.querySelector('.error input, .error select, .error textarea');
      if (firstError) {
        firstError.focus();

        // Scroll to error
        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
        const errorPosition = firstError.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
        window.scrollTo({
          top: errorPosition,
          behavior: 'smooth'
        });
      }

      return false;
    }

    // Form is valid - let Netlify handle submission
    return true;
  }
}

// ============================================
// VIDEO PLACEHOLDER INTERACTIONS
// ============================================

class VideoPlaceholders {
  constructor() {
    this.placeholders = elements.videoPlaceholders;
    this.init();
  }

  init() {
    this.placeholders.forEach(placeholder => {
      placeholder.addEventListener('click', () => this.handleClick(placeholder));
      placeholder.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleClick(placeholder);
        }
      });

      // Make keyboard accessible
      placeholder.setAttribute('tabindex', '0');
      placeholder.setAttribute('role', 'button');
    });
  }

  handleClick(placeholder) {
    // In production, this would load the actual video
    // For now, just show an alert
    const videoTitle = placeholder.querySelector('.video-overlay p')?.textContent || 'this video';
    console.log(`Video clicked: ${videoTitle}`);

    // You can replace this with actual video loading logic
    // For example, opening a modal with an embedded YouTube/Vimeo player
    alert(`Video functionality will be added here. Selected: ${videoTitle}`);
  }
}

// ============================================
// SMOOTH SCROLL FOR ALL ANCHOR LINKS
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (anchor.classList.contains('nav-link')) return; // Already handled by Navigation class

    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        return;
      }

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();
        const navbarHeight = elements.navbar?.offsetHeight || 0;
        const targetPosition = targetElement.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe sections for fade-in effect
  const sections = document.querySelectorAll('.benefit-card, .tool-card, .step');
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
}

// ============================================
// INITIALIZE ALL COMPONENTS
// ============================================

function init() {
  // Initialize all components when DOM is ready
  new Navigation();
  new HeroCarousel();
  new TestimonialCarousel();
  new FormValidator(elements.form);
  new VideoPlaceholders();
  initSmoothScroll();
  initScrollAnimations();

  // Log initialization (remove in production)
  console.log('✅ Flavor Sync Communications - All systems initialized');
}

// Run initialization when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Navigation,
    HeroCarousel,
    TestimonialCarousel,
    FormValidator,
    VideoPlaceholders
  };
}
