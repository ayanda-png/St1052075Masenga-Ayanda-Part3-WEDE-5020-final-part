
document.addEventListener('DOMContentLoaded', function () {

  // Menu to accomodate mobile phones 
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      mobileMenu.classList.toggle('active');
      const spans = hamburger.querySelectorAll('span');

      if (mobileMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // Adding accordations
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', function () {
      const content = this.parentElement.querySelector('.accordion-content');
      const isActive = this.classList.contains('active');

      
      accordionHeaders.forEach(h => {
        h.classList.remove('active');
        const c = h.parentElement.querySelector('.accordion-content');
        if (c) c.style.maxHeight = null;
      });

      // Open clicked one
      if (!isActive) {
        this.classList.add('active');
        if (content) content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // For Tabs
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const target = this.dataset.tab;

      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      this.classList.add('active');
      const targetContent = document.getElementById(target);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // Adding Search filter
  const searchInput = document.getElementById('serviceSearch');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  function filterServices() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const activeFilter = document.querySelector('.filter-btn.active');
    const category = activeFilter ? activeFilter.dataset.filter : 'all';

    serviceCards.forEach(card => {
      const title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
      const description = card.querySelector('p') ? card.querySelector('p').textContent.toLowerCase() : '';
      const cardCategory = card.dataset.category || '';

      const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
      const matchesCategory = category === 'all' || cardCategory === category;

      if (matchesSearch && matchesCategory) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterServices);
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      filterServices();
    });
  });

  // Gallery lightbox
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  let currentIndex = 0;
  const galleryImages = [];

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    galleryImages.push({
      src: img ? img.src : '',
      title: item.dataset.title || ('Cleaning Project ' + (index + 1)),
      emoji: item.textContent.trim()
    });

    item.addEventListener('click', function () {
      currentIndex = index;
      openLightbox();
    });
  });

  function openLightbox() {
    if (!lightbox) return;
    lightbox.classList.add('active');
    updateLightboxContent();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    if (!lightboxImg) return;
    const item = galleryImages[currentIndex];

    if (item.src) {
      lightboxImg.innerHTML = `
        <img src="${item.src}" alt="${item.title}" style="max-width:100%; max-height:80vh; border-radius:8px; display:block;">
        <p style="color:white; text-align:center; margin-top:1rem;">${item.title}</p>
      `;
    } else {
      lightboxImg.innerHTML = `
        <div style="background:linear-gradient(135deg,#0A4D68,#00A896); width:100%; height:400px; border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:white; font-size:5rem;">
          <div>${item.emoji || '🧹'}</div>
          <p style="font-size:1.25rem; margin-top:1rem;">${item.title}</p>
        </div>
      `;
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      updateLightboxContent();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', function (e) {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % galleryImages.length;
      updateLightboxContent();
    });
  }

  // Keyboard support for lightbox
  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      updateLightboxContent();
    }
    if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % galleryImages.length;
      updateLightboxContent();
    }
  });

  // Map of Pretoria
  const mapContainer = document.getElementById('map');

  if (mapContainer && typeof L !== 'undefined') {
    const map = L.map('map').setView([-25.7479, 28.2293], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 18
    }).addTo(map);

    const mainIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:#0A4D68; color:white; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:18px; border:3px solid white; box-shadow:0 2px 8px rgba(0,0,0,0.3);">🧹</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    L.marker([-25.7479, 28.2293], { icon: mainIcon })
      .addTo(map)
      .bindPopup(`
        <strong>Hakeem's Ready Set Clean Services</strong><br>
        Pretoria / Mamelodi<br>
        Serving the greater Pretoria area
      `)
      .openPopup();

    L.circle([-25.7479, 28.2293], {
      color: '#00A896',
      fillColor: '#00A896',
      fillOpacity: 0.15,
      radius: 15000
    }).addTo(map).bindPopup('Our main service coverage area');
  }

  // forms
  function showError(input, message) {
    if (!input) return;
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    const errorEl = formGroup.querySelector('.error-message');
    input.classList.add('error');
    input.classList.remove('success');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('show');
    }
  }

  function showSuccess(input) {
    if (!input) return;
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    const errorEl = formGroup.querySelector('.error-message');
    input.classList.remove('error');
    input.classList.add('success');
    if (errorEl) errorEl.classList.remove('show');
  }

  function clearValidation(input) {
    if (!input) return;
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    const errorEl = formGroup.querySelector('.error-message');
    input.classList.remove('error', 'success');
    if (errorEl) errorEl.classList.remove('show');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return /^(\+27|0)[6-8][0-9]{8}$/.test(cleaned) || /^0[0-9]{9}$/.test(cleaned);
  }

  // Enquiry form
  const enquiryForm = document.getElementById('enquiryForm');

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      const name = document.getElementById('enqName') || document.getElementById('name');
      const email = document.getElementById('enqEmail') || document.getElementById('email');
      const phone = document.getElementById('enqPhone') || document.getElementById('phone');
      const service = document.getElementById('enqService') || document.getElementById('service');
      const property = document.getElementById('enqProperty');
      const message = document.getElementById('enqMessage') || document.getElementById('message');
      const consent = document.getElementById('enqConsent');

      if (name && (!name.value.trim() || name.value.trim().length < 2)) {
        showError(name, 'Please enter your full name.');
        isValid = false;
      } else if (name) {
        showSuccess(name);
      }

      if (email && !email.value.trim()) {
        showError(email, 'Email is required.');
        isValid = false;
      } else if (email && !isValidEmail(email.value.trim())) {
        showError(email, 'Please enter a valid email.');
        isValid = false;
      } else if (email) {
        showSuccess(email);
      }

      if (phone && !phone.value.trim()) {
        showError(phone, 'Phone number is required.');
        isValid = false;
      } else if (phone && !isValidPhone(phone.value.trim())) {
        showError(phone, 'Please enter a valid phone number.');
        isValid = false;
      } else if (phone) {
        showSuccess(phone);
      }

      if (service && !service.value) {
        showError(service, 'Please select a service.');
        isValid = false;
      } else if (service) {
        showSuccess(service);
      }

      if (property && !property.value) {
        showError(property, 'Please select a property type.');
        isValid = false;
      } else if (property) {
        showSuccess(property);
      }

      if (consent && !consent.checked) {
        showError(consent, 'You must agree to be contacted.');
        isValid = false;
      }

      if (isValid) {
        const submitBtn = enquiryForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.textContent = 'Sending...';
          submitBtn.disabled = true;
        }

        setTimeout(function () {
          enquiryForm.style.display = 'none';
          const successBox = document.getElementById('enquirySuccess');
          if (successBox) {
            successBox.style.display = 'block';
            successBox.classList.add('show');
          }
          if (submitBtn) {
            submitBtn.textContent = 'Submit Enquiry';
            submitBtn.disabled = false;
          }
        }, 1000);
      }
    });
  }

  // Contact form
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      const name = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const phone = document.getElementById('contactPhone');
      const subject = document.getElementById('contactSubject');
      const message = document.getElementById('contactMessage');

      if (name && (!name.value.trim() || name.value.trim().length < 2)) {
        showError(name, 'Please enter your full name.');
        isValid = false;
      } else if (name) showSuccess(name);

      if (email && !email.value.trim()) {
        showError(email, 'Email is required.');
        isValid = false;
      } else if (email && !isValidEmail(email.value.trim())) {
        showError(email, 'Please enter a valid email.');
        isValid = false;
      } else if (email) showSuccess(email);

      if (subject && !subject.value) {
        showError(subject, 'Please select a subject.');
        isValid = false;
      } else if (subject) showSuccess(subject);

      if (message && (!message.value.trim() || message.value.trim().length < 10)) {
        showError(message, 'Please enter a message.');
        isValid = false;
      } else if (message) showSuccess(message);

      if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.textContent = 'Sending...';
          submitBtn.disabled = true;
        }

        setTimeout(function () {
          contactForm.style.display = 'none';
          const successBox = document.getElementById('contactSuccess');
          if (successBox) {
            successBox.style.display = 'block';
            successBox.classList.add('show');
          }
        }, 1000);
      }
    });
  }

  // Navigation link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

});