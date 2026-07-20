/* Home page logic — Hero Search + Filters + Property Sections */

document.addEventListener('DOMContentLoaded', () => {
  populateFilterOptions();
  handleSearchSubmit();
  renderPropertySections();
  renderFeaturedCities();
  renderPropertyCategories();
  renderWhyChooseUs();
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
   LATEST + RECENT PROPERTIES
   ============================================ */

function renderPropertySections() {
  const root = document.getElementById('homeSectionsRoot');
  if (!root || typeof dummyProperties === 'undefined') return;

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

    <section class="section" id="featuredCitiesSection">
      <h2 class="section-title">Featured Cities</h2>
      <div class="city-grid" id="featuredCitiesGrid"></div>
    </section>

    <section class="section" id="propertyCategoriesSection">
      <h2 class="section-title">Property Categories</h2>
      <div class="category-grid" id="propertyCategoriesGrid"></div>
    </section>

    <section class="section" id="whyChooseUsSection">
      <h2 class="section-title">Why Choose Us</h2>
      <div class="why-grid" id="whyChooseUsGrid"></div>
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

/* ============================================
   FEATURED CITIES
   ============================================ */

function renderFeaturedCities() {
  const grid = document.getElementById('featuredCitiesGrid');
  if (!grid || typeof CITIES === 'undefined' || typeof dummyProperties === 'undefined') return;

  grid.innerHTML = CITIES.map(city => {
    const count = dummyProperties.filter(p => p.city === city).length;
    return `
      <a href="./pages/property.html?city=${encodeURIComponent(city)}" class="city-card">
        <h3>${city}</h3>
        <p>${count} Properties</p>
      </a>
    `;
  }).join('');
}

/* ============================================
   PROPERTY CATEGORIES
   ============================================ */

function renderPropertyCategories() {
  const grid = document.getElementById('propertyCategoriesGrid');
  if (!grid || typeof PROPERTY_TYPES === 'undefined') return;

  const icons = { House: '🏠', Flat: '🏢', Apartment: '🏬', Plot: '📐', Commercial: '🏪' };

  grid.innerHTML = PROPERTY_TYPES.map(type => `
    <a href="./pages/property.html?type=${encodeURIComponent(type)}" class="category-card">
      <div class="category-icon">${icons[type] || '🏘️'}</div>
      <h3>${type}</h3>
    </a>
  `).join('');
}

/* ============================================
   WHY CHOOSE US
   ============================================ */

function renderWhyChooseUs() {
  const grid = document.getElementById('whyChooseUsGrid');
  if (!grid) return;

  const points = [
    { icon: '✅', title: 'Verified Listings', desc: 'Har property manually check ki jaati hai.' },
    { icon: '🤝', title: 'Trusted Sellers', desc: 'Sirf verified buyers/sellers se deal karein.' },
    { icon: '🔍', title: 'Easy Search', desc: 'Powerful filters se jaldi property dhoondhein.' },
    { icon: '📞', title: '24/7 Support', desc: 'Hamari team hamesha aapki madad ke liye ready hai.' }
  ];

  grid.innerHTML = points.map(p => `
    <div class="why-card">
      <div class="why-icon">${p.icon}</div>
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
    </div>
  `).join('');
      }
