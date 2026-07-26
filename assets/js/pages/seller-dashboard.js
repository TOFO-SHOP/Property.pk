/* Seller Dashboard logic */

let currentFilter = 'All';

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  renderWelcome();
  renderStats();
  renderListings();
  handleFilterTabs();
});

function checkAuth() {
  const isLoggedIn = !!localStorage.getItem('authToken');
  if (!isLoggedIn) window.location.href = './auth/login.html';
}

function getMyListings() {
  return JSON.parse(localStorage.getItem('propertypk_my_listings') || '[]');
}

function saveMyListings(listings) {
  localStorage.setItem('propertypk_my_listings', JSON.stringify(listings));
}

function renderWelcome() {
  const user = JSON.parse(localStorage.getItem('propertypk_user') || '{}');
  const el = document.getElementById('sellerWelcomeName');
  if (el) el.textContent = user.name ? `Welcome back, ${user.name.split(' ')[0]}` : 'Welcome back';
}

function renderStats() {
  const listings = getMyListings();
  document.getElementById('statTotal').textContent = listings.length;
  document.getElementById('statViews').textContent = listings.reduce((sum, l) => sum + (l.views || 0), 0);
  document.getElementById('statSold').textContent = listings.filter(l => l.approvalStatus === 'Sold').length;
}

function safeFormatPrice(price) {
  return typeof formatPrice === 'function' ? formatPrice(price) : 'PKR ' + Number(price || 0).toLocaleString();
}

function statusBadgeClass(status) {
  if (status === 'Approved') return 'badge-approved';
  if (status === 'Sold') return 'badge-sold';
  if (status === 'Rejected') return 'badge-rejected';
  return 'badge-pending';
}

function listingCardHTML(l) {
  return `
    <div class="listing-row">
      <img src="${l.image}" alt="${l.title}">
      <div class="listing-row-body">
        <div class="listing-row-top">
          <h3>${l.title}</h3>
          <span class="status-badge ${statusBadgeClass(l.approvalStatus)}">${l.approvalStatus}</span>
        </div>
        <p class="listing-row-meta">${l.city}, ${l.area} · ${safeFormatPrice(l.price)}</p>
        <p class="listing-row-meta">${l.bedrooms} Rooms · ${l.bathrooms} Baths · ${l.marla} Marla · ${l.views || 0} views</p>
        <div class="listing-row-actions">
          <button class="btn-mini" onclick="markAsSold(${l.id})">Mark Sold</button>
          <button class="btn-mini btn-mini-danger" onclick="deleteListing(${l.id})">Delete</button>
        </div>
      </div>
    </div>
  `;
}

function emptyListingsState() {
  return `
    <div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      <p>No listings here yet. Tap "Add New Property" to create your first listing.</p>
    </div>
  `;
}

function renderListings() {
  const listings = getMyListings();
  const filtered = currentFilter === 'All' ? listings : listings.filter(l => l.approvalStatus === currentFilter);
  const container = document.getElementById('myListingsContainer');
  container.innerHTML = filtered.length ? filtered.map(listingCardHTML).join('') : emptyListingsState();
}

function handleFilterTabs() {
  const tabs = document.querySelectorAll('.dashboard-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderListings();
    });
  });
}

function markAsSold(id) {
  const listings = getMyListings();
  const listing = listings.find(l => l.id === id);
  if (listing) listing.approvalStatus = 'Sold';
  saveMyListings(listings);
  renderStats();
  renderListings();
}

function deleteListing(id) {
  if (!confirm('Are you sure you want to delete this listing?')) return;
  const listings = getMyListings().filter(l => l.id !== id);
  saveMyListings(listings);
  renderStats();
  renderListings();
}
