/* Home page logic — Hero Search + Filters + Latest/Recent Properties */

document.addEventListener('DOMContentLoaded', () => {
  populateFilterOptions();
  handleSearchSubmit();
  renderPropertySections();
});

function populateFilterOptions() {
  const citySelect = document.getElementById('filterCity');
  const typeSelect = document.getElementById('filterType');
  const statusSelect = document.getElementById('filterStatus');

  if (citySelect && typeof CITIES !== 'undefined') {
    CITIES.forEach(city => {
      const opt = document.createElement('option');
      opt.value = city;
      opt.textContent = city;
      citySelect.appendChild(opt);
    });
  }

  if (typeSelect && typeof PROPERTY_TYPES !== 'undefined') {
    PROPERTY_TYPES.forEach(type => {
      const opt = document.createElement('option');
      opt.value = type;
      opt.textContent = type;
      typeSelect.appendChild(opt);
    });
  }

  if (statusSelect && typeof PROPERTY_STATUS !== 'undefined') {
    PROPERTY_STATUS.forEach(status => {
      const opt = document.createElement('option');
      opt.value = status;
      opt.textContent = status;
      statusSelect.appendChild(opt);
    });
  }
}

function handleSearchSubmit() {
  const form = document.getElementById('searchForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    const query = document.getElementById('searchInput')?.value.trim();
    const city = document.getElementById('filterCity')?.value;
    const type = document.getElementById('filterType')?.value;
    const status = document.getElementById('filterStatus')?.value;
    const bedrooms = document.getElementById('filterBedrooms')?.value;

    if (query) params.set('q', query);
    if (city) params.set('city', city);
    if (type) params.set('type', type);
    if (status) params.set('status', status);
    if (bedrooms) params.set('bedrooms', bedrooms);

    window.location.href = `./pages/property.html?${params.toString()}`;
  });
}

/* ============================================
   LATEST + RECENT PROPERTIES SECTIONS
   ============================================ */

function renderPropertySections() {
  const root = document.getElementById('homeSectionsRoot');
  if (!root || typeof dummyProperties === 'undefined') return;

  // Latest = sabse naye postedDate wale, Recent = ulta order (dummy logic abhi ke liye)
  const latest = [...dummyProperties].sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate)).slice(0, 4);
  const recent = [...dummyProperties].slice(0, 4);

  root.innerHTML = `
    <section class="section" id="latestPropertiesSection">
      <h2 class="section-title">Latest Properties</h2>
      <div class="property-grid" id="latestPropertiesGrid"></div>
    </section>

    <section class="section" id="recentPropertiesSection">
      <h2 class="section-title">Recently Added</h2>
      <div class="property-grid" id="recentPropertiesGrid"></div>
    </section>
  `;

  renderPropertyCards('latestPropertiesGrid', latest);
  renderPropertyCards('recentPropertiesGrid', recent);
}

function renderPropertyCards(gridId, properties) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  if (properties.length === 0) {
    showError(gridId, 'No properties found right now.');
    return;
  }

  grid.innerHTML = properties.map(p => `
    <a href="./pages/property-details.html?id=${p.id}" class="property-card">
      <img src="${p.image}" alt="${p.title}">
      <div class="property-card-body">
        <div class="property-card-price">${formatPrice(p.price)}</div>
        <h3 class="property-card-title">${truncateText(p.title, 40)}</h3>
        <div class="property-card-meta">
          <span>${p.city}, ${p.area}</span>
        </div>
        <div class="property-card-meta">
          <span>🛏️ ${p.bedrooms} Beds</span>
          <span>🛁 ${p.bathrooms} Baths</span>
        </div>
      </div>
    </a>
  `).join('');
    }
