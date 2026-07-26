/* Property Listing / Search Results page logic */

document.addEventListener('DOMContentLoaded', () => {
  populateFilterOptions();
  prefillFromUrlParams();
  handleFiltersToggle();
  handleSearchForm();
  handleApplyFilters();
  handleSortChange();
  renderResults();
});

function safeFormatPrice(price) {
  return typeof formatPrice === 'function' ? formatPrice(price) : 'PKR ' + Number(price || 0).toLocaleString();
}

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

function prefillFromUrlParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('q')) document.getElementById('listingSearchInput').value = params.get('q');
  if (params.get('city')) document.getElementById('filterCity').value = params.get('city');
  if (params.get('type')) document.getElementById('filterType').value = params.get('type');
  if (params.get('status')) document.getElementById('filterStatus').value = params.get('status');
  if (params.get('rooms')) document.getElementById('filterRooms').value = params.get('rooms');
  if (params.get('floor')) document.getElementById('filterFloor').value = params.get('floor');
}

function handleFiltersToggle() {
  const btn = document.getElementById('listingFiltersToggle');
  const panel = document.getElementById('listingFiltersPanel');
  if (!btn || !panel) return;
  btn.addEventListener('click', () => {
    panel.classList.toggle('open');
    btn.classList.toggle('active');
  });
}

function handleSearchForm() {
  const form = document.getElementById('listingSearchForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    renderResults();
  });
}

function handleApplyFilters() {
  const btn = document.getElementById('applyFiltersBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    document.getElementById('listingFiltersPanel').classList.remove('open');
    document.getElementById('listingFiltersToggle').classList.remove('active');
    renderResults();
  });
}

function handleSortChange() {
  const sortSelect = document.getElementById('listingSort');
  if (!sortSelect) return;
  sortSelect.addEventListener('change', renderResults);
}

function getFilteredProperties() {
  const query = (document.getElementById('listingSearchInput').value || '').trim().toLowerCase();
  const city = document.getElementById('filterCity').value;
  const type = document.getElementById('filterType').value;
  const status = document.getElementById('filterStatus').value;
  const rooms = document.getElementById('filterRooms').value;
  const bathrooms = document.getElementById('filterBathrooms').value;
  const floor = document.getElementById('filterFloor').value;
  const minPrice = document.getElementById('filterMinPrice').value;
  const maxPrice = document.getElementById('filterMaxPrice').value;

  let results = [...dummyProperties];

  if (query) {
    results = results.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.city.toLowerCase().includes(query) ||
      p.area.toLowerCase().includes(query)
    );
  }
  if (city) results = results.filter(p => p.city === city);
  if (type) results = results.filter(p => p.type === type);
  if (status) results = results.filter(p => p.status === status);
  if (rooms) results = results.filter(p => p.bedrooms >= Number(rooms));
  if (bathrooms) results = results.filter(p => p.bathrooms >= Number(bathrooms));
  if (floor) results = results.filter(p => p.floors === floor);
  if (minPrice) results = results.filter(p => p.price >= Number(minPrice));
  if (maxPrice) results = results.filter(p => p.price <= Number(maxPrice));

  const sortBy = document.getElementById('listingSort').value;
  if (sortBy === 'newest') results.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
  if (sortBy === 'oldest') results.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
  if (sortBy === 'price-low') results.sort((a, b) => a.price - b.price);
  if (sortBy === 'price-high') results.sort((a, b) => b.price - a.price);
  if (sortBy === 'bedrooms') results.sort((a, b) => b.bedrooms - a.bedrooms);

  return results;
}

function listingCardHTML(p) {
  const saved = JSON.parse(localStorage.getItem('propertypk_saved') || '[]').includes(p.id);
  return `
    <a href="./property-details.html?id=${p.id}" class="listing-card">
      <div class="listing-card-media">
        <img src="${p.image}" alt="${p.title}" loading="lazy">
        <button class="save-heart-btn ${saved ? 'saved' : ''}" data-id="${p.id}" onclick="event.preventDefault(); event.stopPropagation(); toggleListingSave(${p.id});">
          <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
        </button>
        <span class="listing-status-tag">${p.status}</span>
      </div>
      <div class="listing-card-body">
        <div class="listing-card-price">${safeFormatPrice(p.price)}</div>
        <h3 class="listing-card-title">${p.title}</h3>
        <p class="listing-card-location">${p.city}, ${p.area}</p>
        <div class="listing-card-meta">
          <span>${p.bedrooms} Rooms</span>
          <span>${p.bathrooms} Baths</span>
          <span>${p.marla} Marla</span>
        </div>
      </div>
    </a>
  `;
}

function emptyResultsState() {
  return `
    <div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <p>No properties match your search. Try adjusting your filters.</p>
    </div>
  `;
}

function renderResults() {
  const results = getFilteredProperties();
  document.getElementById('listingResultsCount').textContent = `${results.length} propert${results.length === 1 ? 'y' : 'ies'} found`;
  const grid = document.getElementById('listingResultsGrid');
  grid.innerHTML = results.length ? results.map(listingCardHTML).join('') : emptyResultsState();
}

function toggleListingSave(id) {
  let saved = JSON.parse(localStorage.getItem('propertypk_saved') || '[]');
  if (saved.includes(id)) {
    saved = saved.filter(x => x !== id);
  } else {
    saved.push(id);
  }
  localStorage.setItem('propertypk_saved', JSON.stringify(saved));
  renderResults();
    }
