/* Buyer Dashboard logic */

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  renderWelcome();
  renderStats();
  renderTabs();
  handleTabSwitch();
});

function checkAuth() {
  const isLoggedIn = !!localStorage.getItem('authToken');
  if (!isLoggedIn) {
    window.location.href = './auth/login.html';
  }
}

function getSavedIds() {
  return JSON.parse(localStorage.getItem('propertypk_saved') || '[]');
}
function getRecentIds() {
  return JSON.parse(localStorage.getItem('propertypk_recent_viewed') || '[]');
}
function getInquiries() {
  return JSON.parse(localStorage.getItem('propertypk_inquiries') || '[]');
}

function renderWelcome() {
  const user = JSON.parse(localStorage.getItem('propertypk_user') || '{}');
  const el = document.getElementById('dashboardWelcomeName');
  if (el) el.textContent = user.name ? `Welcome back, ${user.name.split(' ')[0]}` : 'Welcome back';
}

function renderStats() {
  document.getElementById('statSaved').textContent = getSavedIds().length;
  document.getElementById('statRecent').textContent = getRecentIds().length;
  document.getElementById('statInquiries').textContent = getInquiries().length;
}

function safeFormatPrice(price) {
  return typeof formatPrice === 'function' ? formatPrice(price) : 'PKR ' + Number(price || 0).toLocaleString();
}

function propertyCardHTML(p) {
  return `
    <a href="./property-details.html?id=${p.id}" class="property-card">
      <img src="${p.image}" alt="${p.title}" loading="lazy">
      <div class="property-card-body">
        <div class="property-card-price">${safeFormatPrice(p.price)}</div>
        <h3 class="property-card-title">${p.title}</h3>
        <div class="property-card-meta"><span>${p.city}, ${p.area}</span></div>
      </div>
    </a>
  `;
}

function emptyState(message) {
  return `
    <div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
      <p>${message}</p>
    </div>
  `;
}

function renderTabs() {
  const savedIds = getSavedIds();
  const recentIds = getRecentIds();
  const inquiries = getInquiries();
  const properties = typeof dummyProperties !== 'undefined' ? dummyProperties : [];

  const savedProps = properties.filter(p => savedIds.includes(p.id));
  document.getElementById('tabSavedGrid').innerHTML = savedProps.length
    ? savedProps.map(propertyCardHTML).join('')
    : emptyState("You haven't saved any properties yet. Tap the heart icon on a listing to save it here.");

  const recentProps = recentIds.map(id => properties.find(p => p.id === id)).filter(Boolean);
  document.getElementById('tabRecentGrid').innerHTML = recentProps.length
    ? recentProps.map(propertyCardHTML).join('')
    : emptyState('Properties you view will show up here.');

  document.getElementById('tabInquiriesList').innerHTML = inquiries.length
    ? inquiries.map(i => `
        <div class="inquiry-item">
          <p class="inquiry-property">${i.propertyTitle}</p>
          <p class="inquiry-message">${i.message}</p>
          <span class="inquiry-date">${i.date}</span>
        </div>
      `).join('')
    : emptyState("You haven't contacted any sellers yet.");

  document.getElementById('tabNotificationsList').innerHTML = `
    <div class="notification-item">
      <p>Welcome to Property.pk! Complete your profile to get personalized property recommendations.</p>
    </div>
  `;
}

function handleTabSwitch() {
  const tabs = document.querySelectorAll('.dashboard-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.dashboard-tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(tab.dataset.target).classList.add('active');
    });
  });
    }
