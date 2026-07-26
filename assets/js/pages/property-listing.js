/* Property Listing / Search Results page logic — filters come from home page via URL params */

let activeFilters = {};

document.addEventListener('DOMContentLoaded', () => {
  loadFiltersFromUrl();
  handleSortChange();
  renderResults();
});

function safeFormatPrice(price) {
  return typeof formatPrice === 'function' ? formatPrice(price) : 'PKR ' + Number(price || 0).toLocaleString();
}

function loadFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);
  activeFilters = {
    q: params.get('q') || '',
    city: params.get('city') || '',
    type: params.get('type') || '',
    status: params.get('status') || '',
    rooms: params.get('rooms') || '',
    bathrooms: params.get('bathrooms') || '',
    floor: params.get('floor') || '',
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || ''
  };
}

function handleSortChange() {
  const sortSelect = document.getElementById('listingSort');
  if (!sortSelect) return;
  sortSelect.addEventListener('change', renderResults);
}

function getFilteredProperties() {
  let results = [...dummyProperties];
  const f = activeFilters;
  const query = (f.q || '').toLowerCase();

  if (query) {
    results = results.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.city.toLowerCase().includes(query) ||
      p.area.toLowerCase().includes(query)
    );
  }
  if (f.city) results = results.filter(p => p.city === f.city);
  if (f.type) results = results.filter(p => p.type === f.type);
  if (f.status) results = results.filter(p => p.status === f.status);
  if (f.rooms) results = results.filter(p => p.bedrooms >= Number(f.rooms));
  if (f.bathrooms) results = results.filter(p => p.bathrooms >= Number(f.bathrooms));
  if (f.floor) results = results.filter(p => p.floors === f.floor);
  if (f.minPrice) results = results.filter(p => p.price >= Number(f.minPrice));
  if (f.maxPrice) results = results.filter(p => p.price <= Number(f.maxPrice));

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
      <p>No properties match your search.</p>
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
