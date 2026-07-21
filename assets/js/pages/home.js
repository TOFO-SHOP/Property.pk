/* Home page logic — Hero Search + Filters + Property Sections */

document.addEventListener('DOMContentLoaded', () => {
  populateFilterOptions();
  handleSearchSubmit();
  renderHomeSections();
});

function populateFilterOptions() {
  const citySelect = document.getElementById('filterCity');
  const typeSelect = document.getElementById('filterType');
  const statusSelect = document.getElementById('filterStatus');

  if (citySelect && typeof CITIES !== 'undefined') {
    CITIES.forEach(city => citySelect.appendChild(new Option(city, city)));
  }
  if (typeSelect && typeof PROPERTY_TYPES !== 'undefined') {
    PROPERTY_TYPES.forEach(type => typeSelect.appendChild(new Option(type, type)));
  }
  if (statusSelect && typeof PROPERTY_STATUS !== 'undefined') {
    PROPERTY_STATUS.forEach(status => statusSelect.appendChild(new Option(status, status)));
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
    const rooms = document.getElementById('filterRooms')?.value;
const floor = document.getElementById('filterFloor')?.value;

    if (query) params.set('q', query);
    if (city) params.set('city', city);
    if (type) params.set('type', type);
    if (status) params.set('status', status);
    if (rooms) params.set('rooms', rooms);
if (floor) params.set('floor', floor);

    window.location.href = `./pages/property.html?${params.toString()}`;
  });
}

/* ============================================
   SVG ICONS (no emojis) — all have fill="none" now
   ============================================ */
const ICONS = {
  bed: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/><path d="M3 18h18"/><path d="M3 12V6a2 2 0 0 1 2-2h4v6"/></svg>`,
  bath: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2Z"/><path d="M7 12V6a2 2 0 0 1 3-1.7"/><line x1="4" y1="19" x2="4" y2="21"/><line x1="18" y1="19" x2="18" y2="21"/></svg>`,
  house: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/></svg>`,
  flat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="1"/><line x1="8" y1="7" x2="8" y2="7.01"/><line x1="12" y1="7" x2="12" y2="7.01"/><line x1="16" y1="7" x2="16" y2="7.01"/><line x1="8" y1="11" x2="8" y2="11.01"/><line x1="12" y1="11" x2="12" y2="11.01"/><line x1="16" y1="11" x2="16" y2="11.01"/><line x1="9" y1="21" x2="9" y2="15"/><line x1="15" y1="21" x2="15" y2="15"/></svg>`,
  apartment: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-8h6v8"/></svg>`,
  plot: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l7 7"/><path d="M21 3l-7 7"/><rect x="4" y="4" width="16" height="16" rx="1"/></svg>`,
  commercial: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 9h1"/><path d="M14 9h1"/><path d="M9 13h1"/><path d="M14 13h1"/><path d="M9 21v-4h6v4"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.4 8.4 8 11 4.6-2.6 8-6 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>`,
  handshake: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  headset: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5Z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5Z"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`
};

const CATEGORY_ICON_MAP = { House: 'house', Flat: 'flat', Apartment: 'apartment', Plot: 'plot', Commercial: 'commercial' };

const CITY_IMAGES = {
  Karachi: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&w=500&q=60',
  Lahore: 'https://images.unsplash.com/photo-1600100397608-f188cf59d7f9?auto=format&fit=crop&w=500&q=60',
  Islamabad: 'https://images.unsplash.com/photo-1580746738099-1a1e6db8b6d1?auto=format&fit=crop&w=500&q=60',
  Rawalpindi: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=500&q=60',
  Faisalabad: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=500&q=60'
};

/* ============================================
   SECTION RENDERING
   ============================================ */
function renderHomeSections() {
  const root = document.getElementById('homeSectionsRoot');
  if (!root || typeof dummyProperties === 'undefined') return;

  root.innerHTML = `
    <section class="section" id="latestPropertiesSection">
      <div class="section-head">
        <div><span class="section-eyebrow">Fresh on the market</span><h2 class="section-title">Latest Properties</h2></div>
        <a class="section-link" href="./pages/property.html">View all</a>
      </div>
      <div class="property-grid" id="latestPropertiesGrid"></div>
    </section>

    <section class="section section-alt" id="recentPropertiesSection">
      <div class="container">
        <div class="section-head">
          <div><span class="section-eyebrow">Just added</span><h2 class="section-title">Recently Added</h2></div>
        </div>
        <div class="property-grid" id="recentPropertiesGrid"></div>
      </div>
    </section>

    <section class="section" id="featuredCitiesSection">
      <div class="section-head">
        <div><span class="section-eyebrow">Explore by location</span><h2 class="section-title">Featured Cities</h2></div>
      </div>
      <div class="city-grid" id="featuredCitiesGrid"></div>
    </section>

    <section class="section section-alt" id="propertyCategoriesSection">
      <div class="container">
        <div class="section-head">
          <div><span class="section-eyebrow">Browse by type</span><h2 class="section-title">Property Categories</h2></div>
        </div>
        <div class="category-grid" id="propertyCategoriesGrid"></div>
      </div>
    </section>

    <section class="section" id="whyChooseUsSection">
      <div class="section-head">
        <div><span class="section-eyebrow">The Property.pk difference</span><h2 class="section-title">Why Choose Us</h2></div>
      </div>
      <div class="why-grid" id="whyChooseUsGrid"></div>
    </section>
  `;

  const latest = [...dummyProperties].sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate)).slice(0, 4);
  const recent = [...dummyProperties].slice(0, 4);

  renderPropertyCards('latestPropertiesGrid', latest);
  renderPropertyCards('recentPropertiesGrid', recent);
  renderFeaturedCities();
  renderPropertyCategories();
  renderWhyChooseUs();
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
        <div class="property-card-price">RS ${formatPrice(p.price)}</div>

<h3 class="property-card-title">
  ${truncateText(p.title, 40)}
</h3>

<div class="property-card-meta">
  <span>${ICONS.pin} ${p.city}, ${p.area}</span>
</div>

<div class="property-card-meta">
  <span>${ICONS.bed} ${p.bedrooms} Beds</span>
  <span>${ICONS.bath} ${p.bathrooms} Baths</span>
  <span>📐 ${p.areaSize || ''}</span>
</div>
      </div>
    </a>
  `).join('');
}

function renderFeaturedCities() {
  const grid = document.getElementById('featuredCitiesGrid');
  if (!grid || typeof CITIES === 'undefined' || typeof dummyProperties === 'undefined') return;

  grid.innerHTML = CITIES.map(city => {
    const count = dummyProperties.filter(p => p.city === city).length;
    const bg = CITY_IMAGES[city] || '';
    return `
      <a href="./pages/property.html?city=${encodeURIComponent(city)}" class="city-card" style="--city-bg:url('${bg}')">
        <div>
          <h3>${city}</h3>
          <p>${count} Properties</p>
        </div>
      </a>
    `;
  }).join('');
}

function renderPropertyCategories() {
  const grid = document.getElementById('propertyCategoriesGrid');
  if (!grid || typeof PROPERTY_TYPES === 'undefined') return;

  grid.innerHTML = PROPERTY_TYPES.map(type => `
    <a href="./pages/property.html?type=${encodeURIComponent(type)}" class="category-card">
      <div class="category-icon">${ICONS[CATEGORY_ICON_MAP[type]] || ICONS.flat}</div>
      <h3>${type}</h3>
    </a>
  `).join('');
}

function renderWhyChooseUs() {
  const grid = document.getElementById('whyChooseUsGrid');
  if (!grid) return;

  const points = [
    { icon: ICONS.shield, title: 'Verified Listings', desc: 'Every property is manually reviewed before it goes live.' },
    { icon: ICONS.handshake, title: 'Trusted Network', desc: 'Deal only with verified buyers, sellers and agents.' },
    { icon: ICONS.search, title: 'Powerful Search', desc: 'Filter by city, price, type and more to find the right fit fast.' },
    { icon: ICONS.headset, title: 'Dedicated Support', desc: 'Our team is on hand whenever you need help.' }
  ];

  grid.innerHTML = points.map(p => `
    <div class="why-card">
      <div class="why-icon">${p.icon}</div>
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
    </div>
  `).join('');
      }
