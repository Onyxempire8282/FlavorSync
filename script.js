/*
 * Flavor Sync Communications – Apply Now
 *
 * JavaScript to control the rotating hero background and testimonial
 * carousel. This file cycles through a predefined list of local
 * images every few seconds and fades testimonials in and out.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Rotating hero background
  const hero = document.querySelector('.hero');
  if (hero) {
    // List of hero image paths relative to the HTML file
    const images = [
      'assets/hero1.png',
      'assets/hero2.png',
      'assets/hero3.png',
      'assets/hero4.png',
    ];
    let heroIndex = 0;
    const changeHeroImage = () => {
      hero.style.backgroundImage = `url('${images[heroIndex]}')`;
      heroIndex = (heroIndex + 1) % images.length;
    };
    // Set initial image
    changeHeroImage();
    // Change every 5.5 seconds (5500 ms)
    setInterval(changeHeroImage, 5500);
  }

  // Testimonial carousel
  const testimonials = document.querySelectorAll('.testimonial');
  if (testimonials.length > 1) {
    let testimonialIndex = 0;
    const showTestimonial = () => {
      testimonials.forEach((t, idx) => {
        t.classList.toggle('active', idx === testimonialIndex);
      });
      testimonialIndex = (testimonialIndex + 1) % testimonials.length;
    };
    // Show first on load
    showTestimonial();
    // Change every 6.5 seconds
    setInterval(showTestimonial, 6500);
  }
});