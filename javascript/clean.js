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

  // ========== ACCORDION ==========
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', function () {
      const item = this.parentElement;
      const content = item.querySelector('.accordion-content');
      const isActive = this.classList.contains('active');

      accordionHeaders.forEach(h => {
        h.classList.remove('active');
        h.parentElement.querySelector('.accordion-content').style.maxHeight = null;
      });

      if (!isActive) {
        this.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // ========== TABS ==========
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

  // ========== SERVICE FILTER / SEARCH ==========
  const searchInput = document.getElementById('serviceSearch');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  function filterServices() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const activeFilter = document.querySelector('.filter-btn.active');
    const category = activeFilter ? activeFilter.dataset.filter : 'all';

    serviceCards.forEach(card => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const description = card.querySelector('p')?.textContent.toLowerCase() || '';
      const cardCategory = card.dataset.category || '';

      const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
      const matchesCategory = category === 'all' || cardCategory === category;

      if (matchesSearch && matchesCategory) {
        card.style.display = 'block';
        card.classList.add('fade-in');
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

  // ========== GALLERY LIGHTBOX ==========
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  let currentIndex = 0;
  const galleryImages = [];

  galleryItems.forEach((item, index) => {
    galleryImages.push({
      emoji: item.textContent.trim() || '🧹',
      title: item.dataset.title || Cleaning Project ${index + 1}
    });

    item.addEventListener('click', () => {
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
    lightboxImg.innerHTML = `
      <div style="background: linear-gradient(135deg, #0A4D68, #00A896); 
                  width: 100%; height: 400px; border-radius: 8px; 
                  display: flex; flex-direction: column; align-items: center; 
                  justify-content: center; color: white; font-size: 5rem;">
        <div>${item.emoji}</div>
        <p style="font-size: 1.25rem; margin-top: 1rem;">${item.title}</p>
      </div>
    `;
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
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      updateLightboxContent();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % galleryImages.length;
      updateLightboxContent();
    });
  }

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

  // ========== LEAFLET MAP ==========
  const mapContainer = document.getElementById('map');
if (mapContainer && typeof L !== 'undefined') {
    const map = L.map('map').setView([-26.2041, 28.0473], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18
    }).addTo(map);

    const mainIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:#0A4D68; color:white; width:36px; height:36px; 
                        border-radius:50%; display:flex; align-items:center; 
                        justify-content:center; font-size:18px; border:3px solid white;
                        box-shadow:0 2px 8px rgba(0,0,0,0.3);">🧹</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    L.marker([-26.2041, 28.0473], { icon: mainIcon })
      .addTo(map)
      .bindPopup(`
        <strong>Hakeem's Ready Set Clean Services</strong><br>
        Johannesburg, Gauteng<br>
        Serving the greater Johannesburg area
      `)
      .openPopup();

    L.circle([-26.2041, 28.0473], {
      color: '#00A896',
      fillColor: '#00A896',
      fillOpacity: 0.15,
      radius: 15000
    }).addTo(map).bindPopup('Our main service coverage area');
  }

  // validating forms 
  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorEl = formGroup.querySelector('.error-message');
    input.classList.add('error');
    input.classList.remove('success');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('show');
    }
  }

  function showSuccess(input) {
    const formGroup = input.closest('.form-group');
    const errorEl = formGroup.querySelector('.error-message');
    input.classList.remove('error');
    input.classList.add('success');
    if (errorEl) {
      errorEl.classList.remove('show');
    }
  }

  function clearValidation(input) {
    const formGroup = input.closest('.form-group');
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

  // ===== ENQUIRY FORM =====
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      const name = document.getElementById('enqName');
      const email = document.getElementById('enqEmail');
      const phone = document.getElementById('enqPhone');
      const service = document.getElementById('enqService');
      const property = document.getElementById('enqProperty');
      const message = document.getElementById('enqMessage');
      const consent = document.getElementById('enqConsent');

      if (!name.value.trim() || name.value.trim().length < 2) {
        showError(name, 'Please enter your full name (at least 2 characters).');
        isValid = false;
      } else {
        showSuccess(name);
      }

      if (!email.value.trim()) {
        showError(email, 'Email address is required.');
        isValid = false;
      } else if (!isValidEmail(email.value.trim())) {
        showError(email, 'Please enter a valid email address.');
        isValid = false;
      } else {
        showSuccess(email);
      }

      if (!phone.value.trim()) {
        showError(phone, 'Phone number is required.');
        isValid = false;
      } else if (!isValidPhone(phone.value.trim())) {
        showError(phone, 'Please enter a valid South African phone number (e.g. 082 123 4567).');
        isValid = false;
      } else {
        showSuccess(phone);
      }

      if (!service.value) {
        showError(service, 'Please select a service.');
        isValid = false;
      } else {
        showSuccess(service);
      }

      if (!property.value) {
        showError(property, 'Please select a property type.');
        isValid = false;
      } else {
        showSuccess(property);
      }

      if (message.value.trim().length > 0 && message.value.trim().length < 10) {
        showError(message, 'Message should be at least 10 characters if provided.');
        isValid = false;
      } else {
        clearValidation(message);
      }

      if (!consent.checked) {
        showError(consent, 'You must agree to be contacted.');
        isValid = false;
      } else {
        showSuccess(consent);
      }

      if (isValid) {
        const formData = {
          name: name.value.trim(),
          email: email.value.trim(),
          phone: phone.value.trim(),
          service: service.value,
          property: property.value,
          message: message.value.trim(),
          date: new Date().toISOString()
        };

        const submitBtn = enquiryForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
          enquiryForm.style.display = 'none';
          const successBox = document.getElementById('enquirySuccess');
          if (successBox) {
            successBox.classList.add('show');
            const responseDetails = document.getElementById('responseDetails');
            if (responseDetails) {
              responseDetails.innerHTML = `
                <p><strong>Name:</strong> ${formData.name}</p>
                <p><strong>Service:</strong> ${formData.service}</p>
                <p><strong>Property:</strong> ${formData.property}</p>
                <p><strong>Contact:</strong> ${formData.email} | ${formData.phone}</p>
                <p style="margin-top:1rem;">We will contact you within 24 hours with a free quote and availability.</p>
              `;
            }
          }
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;