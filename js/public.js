// js public.js
document.addEventListener('DOMContentLoaded', () => {

  /* -------------------- LANDING PAGE -------------------- */

  // Testimonial carousel
  const testimonialCards = Array.from(document.querySelectorAll('#testimonials .testimonial'));
  if (testimonialCards.length > 1) {
    let current = 0;
    testimonialCards.forEach((card, idx) => card.style.display = idx ? 'none' : 'block');

    setInterval(() => {
      testimonialCards[current].style.display = 'none';
      current = (current + 1) % testimonialCards.length;
      testimonialCards[current].style.display = 'block';
    }, 3000);
  }

  // Feature cards fade-in on scroll
  const features = document.querySelectorAll('#features .feature');
  const fadeInOnScroll = (elements) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    elements.forEach(el => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      observer.observe(el);
    });
  };
  if (features.length) fadeInOnScroll(features);

  /* -------------------- ABOUT PAGE -------------------- */

  // Hero text fade-in
  const aboutHeroText = document.querySelector('#about-hero .hero-text');
  if (aboutHeroText) {
    aboutHeroText.style.opacity = 0;
    aboutHeroText.style.transform = 'translateY(30px)';
    setTimeout(() => {
      aboutHeroText.style.transition = 'opacity 1s ease, transform 1s ease';
      aboutHeroText.style.opacity = 1;
      aboutHeroText.style.transform = 'translateY(0)';
    }, 200);
  }

  // Fade-in for mission, values, and team cards
  const aboutCards = document.querySelectorAll('#mission-vision .card, #values .step.card, #team .feature.card');
  if (aboutCards.length) fadeInOnScroll(aboutCards);

  // Team member hover: show extra info if any (optional)
  const teamCards = document.querySelectorAll('#team .feature.card');
  teamCards.forEach(card => {
    card.addEventListener('mouseenter', () => card.style.transform = 'scale(1.05)');
    card.addEventListener('mouseleave', () => card.style.transform = 'scale(1)');
  });

  /* -------------------- SITE-WIDE -------------------- */

  // Auto-update year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Scroll-to-top button
  const scrollBtn = document.createElement('button');
  scrollBtn.textContent = '↑';
  scrollBtn.id = 'scroll-top';
  scrollBtn.style.position = 'fixed';
  scrollBtn.style.bottom = '30px';
  scrollBtn.style.right = '30px';
  scrollBtn.style.padding = '10px 15px';
  scrollBtn.style.border = 'none';
  scrollBtn.style.borderRadius = '50%';
  scrollBtn.style.background = 'var(--green)';
  scrollBtn.style.color = 'white';
  scrollBtn.style.cursor = 'pointer';
  scrollBtn.style.display = 'none';
  scrollBtn.style.zIndex = 9999;
  document.body.appendChild(scrollBtn);

  scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });

});

