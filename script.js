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
          contactEl.scrollIntoView({ behavior: 'smooth' });

          // Subtle pulse animation on form card
          const formCard = document.querySelector('.contact-card');
          if (formCard) {
            formCard.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease';
            formCard.style.borderColor = '#facc15';
            formCard.style.boxShadow = '0 0 35px rgba(250, 204, 21, 0.35)';
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
      const selectedGoal = formData.get('goal') || 'Fitness cíl';
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

  // Reset form handler
  if (resetFormBtn && coachingForm && formSuccessMessage) {
    resetFormBtn.addEventListener('click', () => {
      coachingForm.reset();
      clearErrors();
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
        dialog.showModal();
      }
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
