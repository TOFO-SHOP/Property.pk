/* Property Details page logic */

let currentProperty = null;

document.addEventListener('DOMContentLoaded', () => {
  loadProperty();
});

function safeFormatPrice(price) {
  return typeof formatPrice === 'function' ? formatPrice(price) : 'PKR ' + Number(price || 0).toLocaleString();
}

function getPropertyIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get('id'));
}

function loadProperty() {
  const id = getPropertyIdFromUrl();
  const property = dummyProperties.find(p => p.id === id);
  const root = document.getElementById('detailsRoot');

  if (!property) {
    root.innerHTML = `
      <div class="empty-state" style="padding:60px 20px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p>This property could not be found. It may have been removed.</p>
        <a href="./property.html" class="btn btn-primary" style="margin-top:16px; display:inline-flex;">Browse Properties</a>
      </div>
    `;
    renderPageHeader('Property Details');
    return;
  }

  currentProperty = property;
  renderPageHeader(property.title);
  renderDetails(property);
  handleGalleryThumbnails();
  handleContactSeller(property);
  handleShareProperty(property);
  handleReportListing();
  renderSimilarProperties(property);
}

function amenityLabel(key) {
  const map = {
    parking: 'Parking', gas: 'Gas', electricityBackup: 'Electricity Backup',
    waterSupply: 'Water Supply', security: 'Security', elevator: 'Elevator',
    garden: 'Garden / Lawn', furnished: 'Furnished'
  };
  return map[key] || key;
}

function renderDetails(p) {
  const images = p.images && p.images.length ? p.images : [p.image];

  document.getElementById('detailsRoot').innerHTML = `
    <div class="details-gallery">
      <img src="${images[0]}" alt="${p.title}" class="details-gallery-main" id="detailsMainImage">
      ${images.length > 1 ? `
        <div class="details-gallery-thumbs">
          ${images.map((img, i) => `<img src="${img}" class="details-thumb ${i === 0 ? 'active' : ''}" data-src="${img}">`).join('')}
        </div>
      ` : ''}
    </div>

    <div class="details-content">
      <div class="details-top-row">
        <span class="status-badge ${p.status === 'For Sale' ? 'badge-approved' : 'badge-pending'}">${p.status}</span>
        <button class="details-icon-btn" id="shareBtn" aria-label="Share">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg>
        </button>
      </div>

      <div class="details-price">${safeFormatPrice(p.price)}</div>
      <h1 class="details-title">${p.title}</h1>
      <p class="details-location">${p.city}, ${p.area}</p>

      <div class="details-facts-row">
        <div class="details-fact"><strong>${p.bedrooms}</strong><span>Rooms</span></div>
        <div class="details-fact"><strong>${p.bathrooms}</strong><span>Baths</span></div>
        <div class="details-fact"><strong>${p.marla}</strong><span>Marla</span></div>
        <div class="details-fact"><strong>${p.floors || '—'}</strong><span>Stories</span></div>
      </div>

      <h2 class="details-section-title">Description</h2>
      <p class="details-description">${p.description || 'No description provided for this property.'}</p>

      ${p.amenities ? `
        <h2 class="details-section-title">Amenities</h2>
        <div class="details-amenities-grid">
          ${Object.entries(p.amenities).filter(([k, v]) => v).map(([k]) => `
            <div class="details-amenity"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>${amenityLabel(k)}</div>
          `).join('')}
        </div>
      ` : ''}

      <h2 class="details-section-title">Seller Information</h2>
      <div class="seller-card">
        <div class="seller-avatar">${(p.sellerName || 'S').charAt(0)}</div>
        <h3>${p.sellerName || 'Property.pk Seller'}</h3>
        <p style="color:var(--color-text-muted); font-size:13px;">Listed on ${p.postedDate}</p>
        <button class="btn btn-primary btn-block" id="contactSellerBtn" style="margin-top:14px;">Contact Seller</button>
        ${p.contactWhatsapp ? `<a href="https://wa.me/92${p.contactWhatsapp.replace(/\D/g,'').slice(1)}" target="_blank" class="btn btn-outline btn-block" style="margin-top:8px;">WhatsApp</a>` : ''}
      </div>

      <div id="contactFormWrapper" class="contact-form-wrapper" style="display:none;">
        <div id="inquiryMessage"></div>
        <form id="inquiryForm" class="auth-form">
          <div class="form-group">
            <label for="inquiryText">Your Message</label>
            <textarea id="inquiryText" rows="3" placeholder="I'm interested in this property..." required></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Send Inquiry</button>
        </form>
      </div>

<button class="report-listing-link" id="reportBtn">Report this listing</button>

      <div id="reportModalOverlay" class="report-modal-overlay">
        <div class="report-modal">
          <div class="report-modal-header">
            <h3>Why do you want to report this listing?</h3>
            <button type="button" class="report-modal-close" id="reportModalClose" aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>
            </button>
          </div>

          <div id="reportMessage"></div>

          <form id="reportForm">
            <div class="form-group">
              <label for="reportReason">Reason</label>
              <select id="reportReason" required>
                <option value="">Select a reason</option>
                <option value="Fake listing">Fake listing</option>
                <option value="Incorrect information">Incorrect information</option>
                <option value="Duplicate listing">Duplicate listing</option>
                <option value="Already sold/rented">Already sold or rented</option>
                <option value="Scam or fraud">Scam or fraud</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label for="reportExplanation">Please explain</label>
              <textarea id="reportExplanation" rows="4" placeholder="Provide more details about the issue..." required></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Submit Report</button>
          </form>
        </div>
      </div>

      <h2 class="details-section-title" style="margin-top:32px;">Similar Properties</h2>
      <div class="property-grid" id="similarPropertiesGrid"></div>
    </div>
  `;
}

function handleGalleryThumbnails() {
  const thumbs = document.querySelectorAll('.details-thumb');
  const mainImg = document.getElementById('detailsMainImage');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      mainImg.src = thumb.dataset.src;
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
}

function handleContactSeller(property) {
  const btn = document.getElementById('contactSellerBtn');
  const wrapper = document.getElementById('contactFormWrapper');
  const form = document.getElementById('inquiryForm');
  if (!btn || !form) return;

  btn.addEventListener('click', () => {
    const isLoggedIn = !!localStorage.getItem('authToken');
    if (!isLoggedIn) {
      window.location.href = './auth/login.html';
      return;
    }
    wrapper.style.display = wrapper.style.display === 'none' ? 'block' : 'none';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = document.getElementById('inquiryText').value.trim();
    if (!message) return;

    const inquiries = JSON.parse(localStorage.getItem('propertypk_inquiries') || '[]');
    inquiries.unshift({
      propertyId: property.id,
      propertyTitle: property.title,
      message: message,
      date: new Date().toISOString().slice(0, 10)
    });
    localStorage.setItem('propertypk_inquiries', JSON.stringify(inquiries));

    document.getElementById('inquiryMessage').innerHTML = '<p class="form-success">Your inquiry has been sent! You can view it anytime in your Buyer Dashboard.</p>';
    form.reset();
  });
}

function handleShareProperty(property) {
  const btn = document.getElementById('shareBtn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const shareData = {
      title: property.title,
      text: `Check out this property on Property.pk: ${property.title}`,
      url: window.location.href
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { /* user cancelled */ }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  });
}

function handleReportListing() {
  const btn = document.getElementById('reportBtn');
  const overlay = document.getElementById('reportModalOverlay');
  const closeBtn = document.getElementById('reportModalClose');
  const form = document.getElementById('reportForm');
  if (!btn || !overlay || !form) return;

  btn.addEventListener('click', () => {
    overlay.classList.add('open');
  });

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('open');
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const reason = document.getElementById('reportReason').value;
    const explanation = document.getElementById('reportExplanation').value.trim();
    const msgBox = document.getElementById('reportMessage');

    if (!reason) {
      msgBox.innerHTML = '<p class="form-error">Please select a reason.</p>';
      return;
    }
    if (!explanation) {
      msgBox.innerHTML = '<p class="form-error">Please explain the issue before submitting.</p>';
      return;
    }

    // TODO: replace with real API call (POST /reports) once backend + Admin Panel (Phase 8) exist
    const reports = JSON.parse(localStorage.getItem('propertypk_reports') || '[]');
    reports.unshift({
      propertyId: currentProperty.id,
      propertyTitle: currentProperty.title,
      reason: reason,
      explanation: explanation,
      date: new Date().toISOString().slice(0, 10)
    });
    localStorage.setItem('propertypk_reports', JSON.stringify(reports));

    msgBox.innerHTML = '<p class="form-success">Thank you. Your report has been submitted and will be reviewed.</p>';
    form.reset();

    setTimeout(() => {
      overlay.classList.remove('open');
      msgBox.innerHTML = '';
    }, 1800);
  });
      }

function renderSimilarProperties(property) {
  const similar = dummyProperties.filter(p => p.id !== property.id && p.city === property.city);
  const fallback = dummyProperties.filter(p => p.id !== property.id);
  const list = (similar.length ? similar : fallback).slice(0, 8);

  const grid = document.getElementById('similarPropertiesGrid');
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = '<p style="color:var(--color-text-muted); font-size:13px;">No similar properties available right now.</p>';
    return;
  }

  grid.innerHTML = list.map(p => `
    <a href="./property-details.html?id=${p.id}" class="property-card">
      <img src="${p.image}" alt="${p.title}" loading="lazy">
      <div class="property-card-body">
        <div class="property-card-price">${safeFormatPrice(p.price)}</div>
        <h3 class="property-card-title">${p.title}</h3>
        <div class="property-card-meta"><span>${p.city}, ${p.area}</span></div>
      </div>
    </a>
  `).join('');
            }
