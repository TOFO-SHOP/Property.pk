/* Home page logic — Hero Search + City Modal + Browse Panel + Filters + Property Sections */

document.addEventListener('DOMContentLoaded', () => {
  populateFilterOptions();
  handleSearchSubmit();
  handleStatusToggle();
  handleCityModal();
  handleBrowseTabs();
  handleBrowseChips();
  renderBrowseGrid();
  handleFiltersToggle();
  handlePriceSlider();
  handleApplyFilters();
  handleBottomSearchBtn();
  renderHomeSections();
});

/* ---- Safe fallbacks ---- */
if (typeof formatPrice === 'undefined') {
  window.formatPrice = (n) => 'PKR ' + Number(n || 0).toLocaleString();
}
if (typeof truncateText === 'undefined') {
  window.truncateText = (str, len) => (str && str.length > len) ? str.slice(0, len) + '…' : (str || '');
}
if (typeof showError === 'undefined') {
  window.showError = (elId, msg) => {
    const el = document.getElementById(elId);
    if (el) el.innerHTML = `<p style="padding:16px;color:var(--color-text-muted);">${msg}</p>`;
  };
}

/* ============================================
   STATE
   ============================================ */
const homeState = {
  status: 'For Sale',   // Buy / Rent
  browseType: 'House',  // House / Plot / Commercial
  city: 'Lahore'
};

/* ============================================
   FILTER DROPDOWNS (advanced panel)
   ============================================ */
function populateFilterOptions() {
  const citySelect = document.getElementById('filterCity');
  const typeSelect = document.getElementById('filterType');

  if (citySelect && typeof CITIES !== 'undefined') {
    CITIES.forEach(city => citySelect.appendChild(new Option(city, city)));
  }
  if (typeSelect && typeof PROPERTY_TYPES !== 'undefined') {
    PROPERTY_TYPES.forEach(type => typeSelect.appendChild(new Option(type, type)));
  }
}

function handleSearchSubmit() {
  const form = document.getElementById('searchForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    goToPropertyPage();
  });
}

function goToPropertyPage() {
  const params = new URLSearchParams();
  const query = document.getElementById('searchInput')?.value.trim();
  if (query) params.set('q', query);
  if (homeState.status) params.set('status', homeState.status);
  if (homeState.browseType) params.set('type', homeState.browseType);
  if (homeState.city) params.set('city', homeState.city);
  window.location.href = `./pages/property.html?${params.toString()}`;
}

function handleBottomSearchBtn() {
  const btn = document.getElementById('bottomSearchBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    document.getElementById('searchInput')?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================
   BUY / RENT STATUS TOGGLE
   ============================================ */
function handleStatusToggle() {
  const toggle = document.getElementById('statusToggle');
  if (!toggle) return;

  toggle.querySelectorAll('.status-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      toggle.querySelectorAll('.status-pill').forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');
      homeState.status = pill.dataset.status;

      const statusSelect = document.getElementById('filterStatus');
      if (statusSelect) statusSelect.value = homeState.status;

      updateSearchPlaceholder();
      renderBrowseGrid();
    });
  });
}

function updateSearchPlaceholder() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  const labelMap = { House: 'Houses', Plot: 'Plots', Commercial: 'Commercial' };
  input.placeholder = `Search for ${labelMap[homeState.browseType] || 'Properties'}`;
}

/* ============================================
   CITY SELECT MODAL
   ============================================ */
function handleCityModal() {
  const overlay = document.getElementById('cityModalOverlay');
  const openBtn = document.getElementById('cityPillBtn');
  const closeBtn = document.getElementById('cityModalClose');
  const searchInput = document.getElementById('citySearchInput');
  const popularGrid = document.getElementById('popularCitiesGrid');
  const allList = document.getElementById('allCitiesList');
  if (!overlay || !openBtn) return;

  const popularCities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi'];
  const allCities = (typeof CITIES !== 'undefined' && CITIES.length) ? CITIES : popularCities;

  function renderPopular() {
    popularGrid.innerHTML = popularCities.map(city => `
      <button type="button" data-city="${city}" class="${city === homeState.city ? 'active' : ''}">
        <span class="city-modal-city-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 9h1"/><path d="M14 9h1"/><path d="M9 13h1"/><path d="M14 13h1"/></svg>
        </span>
        <span>${city}</span>
      </button>
    `).join('');

    popularGrid.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => selectCity(btn.dataset.city));
    });
  }

  function renderAll(filter = '') {
    const list = allCities
      .filter(c => c.toLowerCase().includes(filter.toLowerCase()))
      .slice(0, 200);

    allList.innerHTML = list.map(city => `<button type="button" data-city="${city}">${city}</button>`).join('')
      || `<p style="padding:12px 4px;color:var(--color-text-muted);font-size:14px;">No cities found.</p>`;

    allList.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => selectCity(btn.dataset.city));
    });
  }

  function selectCity(city) {
    homeState.city = city;
    document.getElementById('cityPillLabel').textContent = city;
    document.getElementById('currentCityLabel').textContent = city;
    const citySelect = document.getElementById('filterCity');
    if (citySelect) citySelect.value = city;
    closeModal();
  }

  function openModal() {
    renderPopular();
    renderAll();
    if (searchInput) searchInput.value = '';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  searchInput?.addEventListener('input', (e) => renderAll(e.target.value));
}

/* ============================================
   BROWSE PROPERTIES TABS + CHIPS + GRID
   ============================================ */
function handleBrowseTabs() {
  const tabs = document.getElementById('browseTabs');
  if (!tabs) return;

  tabs.querySelectorAll('.browse-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.querySelectorAll('.browse-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      homeState.browseType = tab.dataset.type;

      const typeSelect = document.getElementById('filterType');
      if (typeSelect) typeSelect.value = homeState.browseType;

      updateSearchPlaceholder();
      renderBrowseGrid();
    });
  });
}

function handleBrowseChips() {
  const row = document.getElementById('browseChipRow');
  if (!row) return;

  row.querySelectorAll('.browse-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      row.querySelectorAll('.browse-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderBrowseGrid(chip.dataset.filter);
    });
  });
}

/* Quick-shortcut data shown inside the Browse Properties card,
   grouped by tab (Homes / Plots / Commercial) and by chip (Popular / Type / Location / Area Size) */
const BROWSE_SHORTCUTS = {
  House: {
    popular: [
      { title: '5 Marla', sub: 'Houses' }, { title: '10 Marla', sub: 'Houses' }, { title: '1 Kanal', sub: 'Houses' },
      { title: 'New', sub: 'Houses' }, { title: 'Low Price', sub: 'Houses' }, { title: 'For Rent', sub: 'Houses' }
    ],
    type: [
      { title: 'Single Story', sub: 'Houses' }, { title: 'Double Story', sub: 'Houses' }, { title: 'Upper Portion', sub: 'Houses' },
      { title: 'Lower Portion', sub: 'Houses' }, { title: 'Farm House', sub: 'Houses' }, { title: 'Penthouse', sub: 'Houses' }
    ],
    location: [
      { title: 'DHA', sub: 'Lahore' }, { title: 'Bahria Town', sub: 'Lahore' }, { title: 'Gulberg', sub: 'Lahore' },
      { title: 'Johar Town', sub: 'Lahore' }, { title: 'DHA', sub: 'Karachi' }, { title: 'Bahria Town', sub: 'Karachi' }
    ],
    area: [
      { title: '3 Marla', sub: 'Houses' }, { title: '5 Marla', sub: 'Houses' }, { title: '7 Marla', sub: 'Houses' },
      { title: '10 Marla', sub: 'Houses' }, { title: '1 Kanal', sub: 'Houses' }, { title: '2 Kanal', sub: 'Houses' }
    ]
  },
  Plot: {
    popular: [
      { title: '5 Marla', sub: 'Residential Plots' }, { title: '10 Marla', sub: 'Residential Plots' }, { title: '1 Kanal', sub: 'Residential Plots' },
      { title: '3 Marla', sub: 'Residential Plots' }, { title: 'On Installments', sub: 'Residential Plots' }, { title: 'On Installments', sub: 'Commercial Plots' }
    ],
    type: [
      { title: 'Residential', sub: 'Plots' }, { title: 'Commercial', sub: 'Plots' }, { title: 'Agricultural', sub: 'Plots' },
      { title: 'Industrial', sub: 'Plots' }, { title: 'Farm House', sub: 'Land' }, { title: 'File', sub: 'Plots' }
    ],
    location: [
      { title: 'Bahria Town', sub: 'Lahore' }, { title: 'DHA', sub: 'Lahore' }, { title: 'Bahria Town', sub: 'Karachi' },
      { title: 'DHA', sub: 'Islamabad' }, { title: 'Gwadar', sub: 'Balochistan' }, { title: 'Multan Road', sub: 'Lahore' }
    ],
    area: [
      { title: '2 Marla', sub: 'Plots' }, { title: '3 Marla', sub: 'Plots' }, { title: '5 Marla', sub: 'Plots' },
      { title: '10 Marla', sub: 'Plots' }, { title: '1 Kanal', sub: 'Plots' }, { title: '4 Kanal', sub: 'Plots' }
    ]
  },
  Commercial: {
    popular: [
      { title: 'Small', sub: 'Offices' }, { title: 'New', sub: 'Offices' }, { title: 'On Installments', sub: 'Shops' },
      { title: 'Small', sub: 'Shops' }, { title: 'New', sub: 'Shops' }, { title: 'Running', sub: 'Shops' }
    ],
    type: [
      { title: 'Office', sub: 'Space' }, { title: 'Shop', sub: 'Commercial' }, { title: 'Warehouse', sub: 'Commercial' },
      { title: 'Factory', sub: 'Commercial' }, { title: 'Building', sub: 'Commercial' }, { title: 'Plaza', sub: 'Commercial' }
    ],
    location: [
      { title: 'Main Boulevard', sub: 'Lahore' }, { title: 'I.I. Chundrigar', sub: 'Karachi' }, { title: 'Blue Area', sub: 'Islamabad' },
      { title: 'DHA', sub: 'Lahore' }, { title: 'Gulberg', sub: 'Lahore' }, { title: 'Bahria Town', sub: 'Karachi' }
    ],
    area: [
      { title: 'Under 500 sqft', sub: 'Shops' }, { title: '500-1000 sqft', sub: 'Shops' }, { title: '1-2 Marla', sub: 'Offices' },
      { title: '3-5 Marla', sub: 'Offices' }, { title: '1 Kanal', sub: 'Buildings' }, { title: '2 Kanal+', sub: 'Buildings' }
    ]
  }
};

function renderBrowseGrid(filter) {
  const grid = document.getElementById('browseGrid');
  if (!grid) return;

  const activeFilter = filter || document.querySelector('.browse-chip.active')?.dataset.filter || 'popular';
  const items = (BROWSE_SHORTCUTS[homeState.browseType] || BROWSE_SHORTCUTS.House)[activeFilter] || [];

  grid.innerHTML = items.map(item => `
    <button type="button" class="browse-card" data-title="${item.title}">
      <div class="browse-card-title">${item.title}</div>
      <div class="browse-card-sub">${item.sub}</div>
    </button>
  `).join('');

  grid.querySelectorAll('.browse-card').forEach(card => {
    card.addEventListener('click', () => goToPropertyPage());
  });
}

/* ============================================
   ADVANCED FILTERS PANEL
   ============================================ */
function handleFiltersToggle() {
  const btn = document.getElementById('filtersToggle');
  const panel = document.getElementById('filtersPanel');
  if (!btn || !panel) return;

  btn.addEventListener('click', () => {
    panel.classList.toggle('open');
  });
}

function formatPakPriceShort(value) {
  value = Number(value);
  if (value >= 50000000) return 'Rs 5 Crore+';
  if (value >= 10000000) return 'Rs ' + (value / 10000000).toFixed(value % 10000000 === 0 ? 0 : 1) + ' Crore';
  if (value >= 100000) return 'Rs ' + (value / 100000).toFixed(value % 100000 === 0 ? 0 : 1) + ' Lac';
  if (value === 0) return 'Rs 0';
  return 'Rs ' + value.toLocaleString();
}

function handlePriceSlider() {
  const minSlider = document.getElementById('priceMinSlider');
  const maxSlider = document.getElementById('priceMaxSlider');
  const rangeEl = document.getElementById('priceSliderRange');
  const minLabel = document.getElementById('priceMinLabel');
  const maxLabel = document.getElementById('priceMaxLabel');
  if (!minSlider || !maxSlider) return;

  function update() {
    let minVal = Number(minSlider.value);
    let maxVal = Number(maxSlider.value);

    if (minVal > maxVal - 100000) {
      minVal = maxVal - 100000;
      minSlider.value = minVal;
    }

    const range = Number(minSlider.max) - Number(minSlider.min);
    const minPercent = ((minVal - minSlider.min) / range) * 100;
    const maxPercent = ((maxVal - minSlider.min) / range) * 100;

    if (rangeEl) {
      rangeEl.style.left = minPercent + '%';
      rangeEl.style.width = (maxPercent - minPercent) + '%';
    }
    if (minLabel) minLabel.textContent = formatPakPriceShort(minVal);
    if (maxLabel) maxLabel.textContent = maxVal >= Number(maxSlider.max) ? 'Rs 5 Crore+' : formatPakPriceShort(maxVal);
  }

  minSlider.addEventListener('input', update);
  maxSlider.addEventListener('input', update);
  update();
}

function handleApplyFilters() {
  const btn = document.getElementById('applyFiltersBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const params = new URLSearchParams();
    const query = document.getElementById('searchInput')?.value.trim();
    const city = document.getElementById('filterCity')?.value || homeState.city;
    const type = document.getElementById('filterType')?.value || homeState.browseType;
    const status = document.getElementById('filterStatus')?.value || homeState.status;
    const minPrice = document.getElementById('priceMinSlider')?.value;
    const maxPrice = document.getElementById('priceMaxSlider')?.value;
    const rooms = document.getElementById('filterRooms')?.value;
    const bathrooms = document.getElementById('filterBathrooms')?.value;
    const floor = document.getElementById('filterFloor')?.value;

    if (query) params.set('q', query);
    if (city) params.set('city', city);
    if (type) params.set('type', type);
    if (status) params.set('status', status);
    if (minPrice && Number(minPrice) > 0) params.set('minPrice', minPrice);
    if (maxPrice && Number(maxPrice) < 50000000) params.set('maxPrice', maxPrice);
    if (rooms) params.set('rooms', rooms);
    if (bathrooms) params.set('bathrooms', bathrooms);
    if (floor) params.set('floor', floor);

    window.location.href = `./pages/property.html?${params.toString()}`;
  });
}

/* ============================================
   SVG ICONS
   ============================================ */
const ICONS = {
  bed: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/><path d="M3 18h18"/><path d="M3 12V6a2 2 0 0 1 2-2h4v6"/></svg>`,
  bath: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2Z"/><path d="M7 12V6a2 2 0 0 1 3-1.7"/><line x1="4" y1="19" x2="4" y2="21"/><line x1="18" y1="19" x2="18" y2="21"/></svg>`,
  ruler: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18v12H3z"/><path d="M7 6v4"/><path d="M11 6v4"/><path d="M15 6v4"/><path d="M19 6v4"/></svg>`,
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

/* ============================================
   SECTION RENDERING (Latest / Categories / Why Us)
   ============================================ */
function renderHomeSections() {
  const root = document.getElementById('homeSectionsRoot');
  if (!root) return;
  if (typeof dummyProperties === 'undefined') return;

  root.innerHTML = `
    <section class="section" id="latestPropertiesSection">
      <div class="section-head">
        <div>
