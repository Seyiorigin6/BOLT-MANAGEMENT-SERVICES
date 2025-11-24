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

  /*---------------------------HELP PAGE-----------------------------*/
  (function () {
    const helpRoot = document.getElementById('help-page');
    if (!helpRoot) return;

    const faqItems = Array.from(helpRoot.querySelectorAll('.faq-item'));

    // initialize answers collapsed
    faqItems.forEach(item => {
      const ans = item.querySelector('.faq-a');
      if (!ans) return;
      ans.style.maxHeight = '0';
      ans.style.overflow = 'hidden';
      ans.style.padding = '0 1rem';
      ans.style.transition = 'max-height 0.32s ease, padding 0.32s ease';
      item.classList.remove('open');
    });

    function setAnswerMaxHeight(ans) {
      requestAnimationFrame(() => {
        // small buffer to avoid clipping (margins, inline spacing)
        const buffer = 20;
        ans.style.maxHeight = (ans.scrollHeight + buffer) + 'px';
      });
    }

    function openFaq(item) {
      const ans = item.querySelector('.faq-a');
      if (!ans) return;
      item.classList.add('open');

      // set padding first so scrollHeight accounts for it
      ans.style.padding = '0.75rem 1rem 1rem';
      setAnswerMaxHeight(ans);
    }

    function closeFaq(item) {
      const ans = item.querySelector('.faq-a');
      if (!ans) return;
      item.classList.remove('open');

      // collapse
      ans.style.maxHeight = '0';
      ans.style.padding = '0 1rem';
    }

    // Toggle handlers
    const qButtons = Array.from(helpRoot.querySelectorAll('.faq-q'));
    qButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        if (!item) return;
        if (item.classList.contains('open')) {
          closeFaq(item);
        } else {
          //close others first
          faqItems.forEach(i => i !== item && closeFaq(i));
          openFaq(item);
        }
      });
    });

    // Live search (unchanged)
    const searchBox = helpRoot.querySelector('#faq-search-box');
    if (searchBox) {
      searchBox.addEventListener('input', (e) => {
        const q = e.target.value.trim().toLowerCase();
        faqItems.forEach(item => {
          const qText = (item.querySelector('.faq-q')?.textContent || '').toLowerCase();
          const aText = (item.querySelector('.faq-a')?.textContent || '').toLowerCase();
          const visible = q === '' || qText.includes(q) || aText.includes(q);
          item.style.display = visible ? '' : 'none';
          // if visible and open, recompute maxHeight (in case content changed)
          if (visible && item.classList.contains('open')) {
            const ans = item.querySelector('.faq-a');
            if (ans) setAnswerMaxHeight(ans);
          }
        });
      });
    }

    // Recompute maxHeight for open answers on resize
    window.addEventListener('resize', () => {
      faqItems.forEach(item => {
        if (item.classList.contains('open')) {
          const ans = item.querySelector('.faq-a');
          if (ans) setAnswerMaxHeight(ans);
        }
      });
    });

    // Recompute when images inside answers load (images can change scrollHeight)
    faqItems.forEach(item => {
      const imgs = item.querySelectorAll('img');
      imgs.forEach(img => {
        if (!img.complete) {
          img.addEventListener('load', () => {
            if (item.classList.contains('open')) {
              const ans = item.querySelector('.faq-a');
              if (ans) setAnswerMaxHeight(ans);
            }
          });
        }
      });
    });

    // Contact form handling
    const supportForm = helpRoot.querySelector('#support-form');
    if (supportForm) {
      supportForm.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const name = (supportForm.querySelector('input[name="name"]')?.value || '').trim();
        const email = (supportForm.querySelector('input[name="email"]')?.value || '').trim();
        const message = (supportForm.querySelector('textarea[name="message"]')?.value || '').trim();
        if (!name || !email || !message) {
          alert('Please fill all fields before sending.');
          return;
        }
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!emailOk) {
          alert('Please enter a valid email address.');
          return;
        }
        alert('Thanks — your message was sent. We will contact you shortly.');
        supportForm.reset();
      });
    }
  })();

  /* -------------------- CONTACT PAGE-------------------- */
  (function contactPage() {
    const root = document.getElementById('contact-page');
    if (!root) return;

    const form = document.getElementById('contact-form');
    const statusEl = document.getElementById('contact-status');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (form.querySelector('input[name="name"]')?.value || '').trim();
      const email = (form.querySelector('input[name="email"]')?.value || '').trim();
      const message = (form.querySelector('textarea[name="message"]')?.value || '').trim();

      // basic validation
      if (!name || !email || !message) {
        statusEl.style.color = '#d9534f';
        statusEl.textContent = 'Please fill all fields.';
        return;
      }

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        statusEl.style.color = '#d9534f';
        statusEl.textContent = 'Please enter a valid email.';
        return;
      }

      // show "sending" state and fake async submit
      statusEl.style.color = 'var(--green)';
      statusEl.textContent = 'Sending...';

      // simulate network request (replace with fetch to real endpoint)
      setTimeout(() => {
        statusEl.style.color = 'var(--green)';
        statusEl.textContent = 'Message sent — we will reply soon.';
        form.reset();
        setTimeout(() => { statusEl.textContent = ''; }, 5000);
      }, 900); // short simulated delay
    });
  })();

  /*--------------------Login Page----------------------*/
  // login validation
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear previous errors
      document.getElementById('email-error').textContent = '';
      document.getElementById('password-error').textContent = '';

      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();
      let valid = true;

      // Email validation
      if (!email) {
        document.getElementById('email-error').textContent = 'Email is required';
        valid = false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        document.getElementById('email-error').textContent = 'Invalid email address';
        valid = false;
      }

      // Password validation
      if (!password) {
        document.getElementById('password-error').textContent = 'Password is required';
        valid = false;
      } else if (password.length < 6) {
        document.getElementById('password-error').textContent = 'Password must be at least 6  characters';
        valid = false;
      }

      if (valid){
        // Only redirect if both fields are valid
      window.location.href = 'customer/customerhome.html';
      }
    });
  }
  
  /* -------------------- Forgot Password  -------------------- */
  const page = document.getElementById("forgot-page");
  if (!page) return;

  const form = document.getElementById("forgot-form");
  const emailInput = document.getElementById("fp-email");
  const emailError = document.getElementById("fp-email-error");
  const statusMsg = document.getElementById("fp-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Reset states
    emailError.textContent = "";
    statusMsg.classList.add("hidden");
    statusMsg.textContent = "";

    const email = emailInput.value.trim();
    let valid = true;

    if (email === "") {
      emailError.textContent = "Please enter your email";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailError.textContent = "Please enter a valid email";
      valid = false;
    }

    if (!valid) return;

    statusMsg.textContent = "Sending reset link...";
    statusMsg.classList.remove("hidden");

    setTimeout(() => {
      statusMsg.textContent =
        "If this email is registered, a reset link has been sent.";
      form.reset();
    }, 1000);
  });

});
/*--------------------------Register-----------------------*/
// Register form validation and user type dashboard redirection
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  if (!registerForm) return;

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get field values
    const userType = document.getElementById('user-type').value.trim();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const dob = document.getElementById('dob').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    let hasError = false;

    // Validation
    if (!userType) { document.getElementById('user-type-error').textContent = 'User type is required'; hasError = true; }
    if (!name) { document.getElementById('name-error').textContent = 'Name is required'; hasError = true; }
    if (!phone) { document.getElementById('phone-error').textContent = 'Phone number is required'; hasError = true; }
    if (!dob) { document.getElementById('dob-error').textContent = 'Date of birth is required'; hasError = true; }
    if (!email) { document.getElementById('email-error').textContent = 'Email is required'; hasError = true; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('email-error').textContent = 'Invalid email address';
      hasError = true;
    }
    if (!password) { document.getElementById('password-error').textContent = 'Password is required'; hasError = true; }
    if (!confirmPassword) { document.getElementById('confirm-password-error').textContent = 'Please confirm your password'; hasError = true; }
    if (password && confirmPassword && password !== confirmPassword) {
      document.getElementById('confirm-password-error').textContent = 'Passwords do not match';
      hasError = true;
    }

    // If validation passes, redirect based on user type
    if (!hasError) {
      if (userType === 'customer') {
        window.location.href = 'customer/customerhome.html';
      } else if (userType === 'driver') {
        window.location.href = 'driver/driver-dashboard.html';
      } else if (userType === 'admin') {
        window.location.href = 'admin/admindashboard.html';
      } else {
        alert('Unknown user type');
      }
    }
  });
});

