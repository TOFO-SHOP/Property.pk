/* Home page logic — Hero Search + Filters */

document.addEventListener('DOMContentLoaded', () => {
  populateFilterOptions();
  handleSearchSubmit();
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

    // Property listing page Phase 6/7 mein banega, filters wahan use honge
    window.location.href = `./pages/property.html?${params.toString()}`;
  });
      }
