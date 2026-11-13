/**
 * Dan Žalud - Official Coach & Competitor Website
 * Interactive behaviors, form validation & UX enhancements
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const selectServiceBtns = document.querySelectorAll('.select-service-btn');
  const serviceSelect = document.getElementById('serviceSelect');
  const coachingForm = document.getElementById('coachingForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccessMessage = document.getElementById('formSuccessMessage');
  const successDetails = document.getElementById('successDetails');
  const resetFormBtn = document.getElementById('resetFormBtn');
  const mobileStickyCta = document.querySelector('.mobile-sticky-cta');
  const contactSection = document.getElementById('kontakt');

  // Input Error containers
  const fullNameInput = document.getElementById('fullName');
  const contactInfoInput = document.getElementById('contactInfo');
  const nameError = document.getElementById('nameError');
  const contactError = document.getElementById('contactError');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenis = null;

  const scrollToTarget = (el) => {
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el, { offset: -76, duration: 1.05 });
    } else {
      el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  };

  // --- 1. Sticky Header Background on Scroll ---
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Hide mobile sticky CTA if user is in or past the contact section
    if (mobileStickyCta && contactSection) {
      const contactRect = contactSection.getBoundingClientRect();
      if (contactRect.top < window.innerHeight && contactRect.bottom > 0) {
        mobileStickyCta.style.opacity = '0';
        mobileStickyCta.style.pointerEvents = 'none';
      } else {
        mobileStickyCta.style.opacity = '1';
        mobileStickyCta.style.pointerEvents = 'auto';
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- 2. Mobile Menu Drawer Toggle ---
  if (menuToggle && mobileDrawer) {
    const toggleMenu = (isOpen) => {
      const active = typeof isOpen === 'boolean' ? isOpen : !menuToggle.classList.contains('active');
      menuToggle.classList.toggle('active', active);
      mobileDrawer.classList.toggle('open', active);
      menuToggle.setAttribute('aria-expanded', active.toString());
      mobileDrawer.setAttribute('aria-hidden', (!active).toString());
      document.body.style.overflow = active ? 'hidden' : '';
      if (lenis) {
        if (active) lenis.stop();
        else lenis.start();
      }
    };

    menuToggle.addEventListener('click', () => toggleMenu());

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }

  // --- 3. Synchronize Service Cards with Form Selection ---
  selectServiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetService = btn.getAttribute('data-target-service');
      if (serviceSelect && targetService) {
        // Set select value
        serviceSelect.value = targetService;

        // Smooth scroll to contact section
        const contactEl = document.getElementById('kontakt');
        if (contactEl) {
          scrollToTarget(contactEl);

          // Subtle pulse animation on form card
          const formCard = document.querySelector('.contact-card');
          if (formCard) {
            formCard.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease';
            formCard.style.borderColor = '#fbbf24';
            formCard.style.boxShadow = '0 0 35px rgba(229, 169, 60, 0.4)';
            setTimeout(() => {
              formCard.style.borderColor = '';
              formCard.style.boxShadow = '';
            }, 1200);
          }
        }
      }
    });
  });

  // --- 4. Form Validation & Interactive Feedback ---
  const clearErrors = () => {
    if (nameError) nameError.textContent = '';
    if (contactError) contactError.textContent = '';
    if (fullNameInput) fullNameInput.style.borderColor = '';
    if (contactInfoInput) contactInfoInput.style.borderColor = '';
  };

  if (fullNameInput) {
    fullNameInput.addEventListener('input', () => {
      if (nameError.textContent) clearErrors();
    });
  }

  if (contactInfoInput) {
    contactInfoInput.addEventListener('input', () => {
      if (contactError.textContent) clearErrors();
    });
  }

  if (coachingForm) {
    coachingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      const nameVal = fullNameInput ? fullNameInput.value.trim() : '';
      const contactVal = contactInfoInput ? contactInfoInput.value.trim() : '';

      let hasError = false;

      // Validate Name
      if (!nameVal || nameVal.length < 2) {
        if (nameError) nameError.textContent = 'Prosím zadej své celé jméno a příjmení.';
        if (fullNameInput) fullNameInput.style.borderColor = '#f87171';
        hasError = true;
      }

      // Validate Contact (Phone, Email or Instagram)
      if (!contactVal || contactVal.length < 3) {
        if (contactError) contactError.textContent = 'Prosím vyplň telefon, e-mail nebo Instagram.';
        if (contactInfoInput) contactInfoInput.style.borderColor = '#f87171';
        hasError = true;
      }

      if (hasError) return;

      // Collect form values
      const formData = new FormData(coachingForm);
      const rawGoal = formData.get('goal') || 'Fitness cíl';
      const customGoalText = (formData.get('customGoal') || '').toString().trim();
      const selectedGoal = (rawGoal === 'Něco jiného' && customGoalText)
        ? `Něco jiného: ${customGoalText}`
        : rawGoal;
      const selectedService = formData.get('service') || 'Online Coaching';
      const userMessage = formData.get('message') || '';

      // Animate submit button
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
      }

      // Simulate sending inquiry (smooth response after 700ms)
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }

        // Hide form and show customized success card
        coachingForm.style.display = 'none';
        if (formSuccessMessage) {
          formSuccessMessage.style.display = 'block';
        }

        if (successDetails) {
          successDetails.innerHTML = `
            Skvělé, <strong>${escapeHtml(nameVal)}</strong>! Poptávka na <strong>${escapeHtml(selectedService)}</strong> (cíl: <em>${escapeHtml(selectedGoal)}</em>) byla úspěšně zaznamenána.<br><br>
            Ozvu se ti přímo na <strong>${escapeHtml(contactVal)}</strong> do 24 hodin s podrobnostmi a návrhem termínu.
          `;
        }

        // Save last inquiry in localStorage as record
        try {
          const lead = {
            name: nameVal,
            contact: contactVal,
            goal: selectedGoal,
            service: selectedService,
            message: userMessage,
            date: new Date().toISOString()
          };
          localStorage.setItem('dan_zalud_inquiry', JSON.stringify(lead));
        } catch (err) {
          console.warn('LocalStorage save error:', err);
        }
      }, 700);
    });
  }

  // Toggle optional custom goal field when "Něco jiného" is selected
  const customGoalGroup = document.getElementById('customGoalGroup');
  const customGoalInput = document.getElementById('customGoalInput');
  const goalRadios = document.querySelectorAll('input[name="goal"]');

  function syncCustomGoalVisibility() {
    if (!customGoalGroup) return;
    const checked = document.querySelector('input[name="goal"]:checked');
    const isOther = Boolean(checked && checked.value === 'Něco jiného');
    customGoalGroup.hidden = !isOther;
    if (isOther && customGoalInput) {
      customGoalInput.focus();
    }
  }

  goalRadios.forEach(radio => {
    radio.addEventListener('change', syncCustomGoalVisibility);
  });

  // Reset form handler
  if (resetFormBtn && coachingForm && formSuccessMessage) {
    resetFormBtn.addEventListener('click', () => {
      coachingForm.reset();
      clearErrors();
      if (customGoalGroup) customGoalGroup.hidden = true;
      formSuccessMessage.style.display = 'none';
      coachingForm.style.display = 'flex';
      if (fullNameInput) fullNameInput.focus();
    });
  }

  // --- 5. Legal Modals (<dialog> with light-dismiss fallback) ---
  const modalTriggers = document.querySelectorAll('[data-open-modal]');
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.getAttribute('data-open-modal');
      const dialog = targetId ? document.getElementById(targetId) : null;
      if (dialog && typeof dialog.showModal === 'function') {
        if (lenis) lenis.stop();
        dialog.showModal();
      }
    });
  });

  document.querySelectorAll('dialog.legal-dialog').forEach(dialog => {
    dialog.addEventListener('close', () => {
      if (lenis) lenis.start();
    });
  });

  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const isOutside = (e, dialog) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    for (const dialog of document.querySelectorAll('dialog[closedby="any"]')) {
      let pressedOutside = false;
      dialog.addEventListener('pointerdown', (e) => {
        pressedOutside = isOutside(e, dialog);
      });
      dialog.addEventListener('pointerup', (e) => {
        if (pressedOutside && isOutside(e, dialog)) {
          dialog.close();
        }
      });
    }
  }

  // --- 6. Lenis Smooth Scroll (darkroomengineering/lenis) ---
  if (!prefersReducedMotion && typeof window.Lenis === 'function') {
    lenis = new window.Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    lenis.on('scroll', handleScroll);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          scrollToTarget(targetEl);
        }
      });
    });
  }

  // --- 7. GSAP + ScrollTrigger (greensock/gsap) & Lenis Ticker Sync ---
  if (!prefersReducedMotion && typeof window.gsap !== 'undefined') {
    const { gsap, ScrollTrigger } = window;
    if (ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    if (lenis && ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else if (lenis) {
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }

    // Hero entrance timeline
    gsap.from('.hero-slogan, .hero-title, .hero-subtitle, .hero-cta-group, .hero-stat-item', {
      y: 22,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power3.out',
      clearProps: 'transform,opacity'
    });

    if (ScrollTrigger) {
      // Desktop subtle parallax scrub on hero background photo
      const mm = gsap.matchMedia();
      mm.add('(min-width: 901px)', () => {
        gsap.to('.hero-dan-photo', {
          yPercent: 7,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
      });

      // Staggered card & block reveals on scroll
      const revealGroups = [
        { container: '.pillars-grid', items: '.pillar-card' },
        { container: '.pricing-grid', items: '.pricing-card' },
        { container: '.packages-grid', items: '.package-card' },
        { container: '.process-grid', items: '.process-step' },
        { container: '.coop-grid', items: '.coop-card' }
      ];

      revealGroups.forEach(({ container, items }) => {
        const groupEl = document.querySelector(container);
        const itemEls = document.querySelectorAll(items);
        if (!groupEl || !itemEls.length) return;

        gsap.from(itemEls, {
          y: 28,
          opacity: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: groupEl,
            start: 'top 86%',
            once: true
          }
        });
      });

      gsap.utils.toArray('.trainer-content-col, .trainer-photo-col, .why-intro-card, .contact-info-col, .contact-card').forEach(el => {
        gsap.from(el, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            once: true
          }
        });
      });

      // React Bits BlurReveal pattern on mottos / key callouts
      gsap.utils.toArray('.trainer-motto, .why-highlight').forEach(el => {
        gsap.from(el, {
          filter: 'blur(8px)',
          y: 12,
          opacity: 0,
          duration: 0.75,
          ease: 'power2.out',
          clearProps: 'filter,transform,opacity',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true
          }
        });
      });
    }
  } else if (lenis) {
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  // --- 8. React Bits Vanilla Adaptations (DavidHDev/react-bits: CountUp & SpotlightCard) ---
  if (!prefersReducedMotion) {
    document.querySelectorAll('[data-countup]').forEach(el => {
      const target = parseInt(el.getAttribute('data-countup') || '0', 10);
      const suffix = el.getAttribute('data-suffix') || '';
      if (!Number.isFinite(target) || target <= 0) return;

      const durationMs = 1100;
      const startTime = performance.now();
      const step = (now) => {
        const progress = Math.min((now - startTime) / durationMs, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(eased * target);
        el.textContent = `${value}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = `${target}${suffix}`;
        }
      };
      requestAnimationFrame(step);
    });
  }

  const spotlightTargets = document.querySelectorAll(
    '.pillar-card, .pricing-card, .package-card, .process-step, .coop-card, .hero-stat-item'
  );
  spotlightTargets.forEach(card => {
    card.classList.add('rb-spotlight');
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });

  // Security helper to escape HTML in confirmation text
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
