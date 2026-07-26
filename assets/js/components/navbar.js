/* Navbar — desktop links + mobile drawer, active link highlight, logout */

function renderNavbar(targetId = 'navbar-root') {
  const target = document.getElementById(targetId);
  if (!target) return;

  const isLoggedIn = !!localStorage.getItem('authToken');

  target.innerHTML = `
    <nav class="navbar">
      <a href="${withBase('index.html')}" class="navbar-logo">Property.pk</a>

      <!-- Desktop links -->
      <ul class="navbar-links">
        <li><a href="${withBase('index.html')}" class="${isActive('index.html')}">Home</a></li>
        <li><a href="${withBase('pages/property.html')}" class="${isActive('property.html')}">Properties</a></li>
        <li><a href="${withBase('pages/about.html')}" class="${isActive('about.html')}">About Us</a></li>
        <li><a href="${withBase('pages/contact.html')}" class="${isActive('contact.html')}">Contact</a></li>
        ${isLoggedIn ? `<li><a href="${withBase('pages/buyer-dashboard.html')}" class="${isActive('buyer-dashboard.html')}">Dashboard</a></li>` : ''}
      </ul>

      <!-- Desktop actions -->
      <div class="navbar-actions">
        ${isLoggedIn
          ? `<button class="btn btn-outline" id="logoutBtnDesktop">Logout</button>`
          : `<a href="${withBase('pages/auth/login.html')}" class="btn btn-outline">Login</a>
             <a href="${withBase('pages/auth/signup.html')}" class="btn btn-accent">Sign Up</a>`}
      </div>

      <!-- Mobile hamburger -->
      <button class="navbar-toggle" id="navDrawerOpen" aria-label="Open menu" aria-expanded="false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
          <line x1="4" y1="7" x2="20" y2="7"/>
          <line x1="4" y1="12" x2="20" y2="12"/>
          <line x1="4" y1="17" x2="20" y2="17"/>
        </svg>
      </button>
    </nav>

    <div class="nav-drawer-overlay" id="navDrawerOverlay"></div>

    <aside class="nav-drawer" id="navDrawer" aria-hidden="true">
      <div class="nav-drawer-header">
        <span class="navbar-logo">Property.pk</span>
        <button class="nav-drawer-close" id="navDrawerClose" aria-label="Close menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <line x1="5" y1="5" x2="19" y2="19"/>
            <line x1="19" y1="5" x2="5" y2="19"/>
          </svg>
        </button>
      </div>

      <div class="nav-drawer-links">
        <a href="${withBase('index.html')}" class="${isActive('index.html')}">Home</a>
        <a href="${withBase('pages/property.html')}" class="${isActive('property.html')}">Properties</a>
        <a href="${withBase('pages/about.html')}" class="${isActive('about.html')}">About Us</a>
        <a href="${withBase('pages/contact.html')}" class="${isActive('contact.html')}">Contact</a>
        ${isLoggedIn ? `<a href="${withBase('pages/buyer-dashboard.html')}" class="${isActive('buyer-dashboard.html')}">Dashboard</a>` : ''}
        ${isLoggedIn ? `<a href="${withBase('pages/profile.html')}" class="${isActive('profile.html')}">My Profile</a>` : ''}
      </div>

      <div class="nav-drawer-actions">
        ${isLoggedIn
          ? `<button class="btn btn-outline btn-block" id="logoutBtn">Logout</button>`
          : `<a href="${withBase('pages/auth/login.html')}" class="btn btn-outline btn-block">Login</a>
             <a href="${withBase('pages/auth/signup.html')}" class="btn btn-primary btn-block">Sign Up</a>`}
      </div>
    </aside>
  `;

  const openBtn = document.getElementById('navDrawerOpen');
  const closeBtn = document.getElementById('navDrawerClose');
  const overlay = document.getElementById('navDrawerOverlay');
  const drawer = document.getElementById('navDrawer');

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    openBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    openBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  openBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  // ESC key closes drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
  });

  // Any link inside drawer closes it before navigation
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  // Logout — mobile + desktop
  function handleLogout() {
    localStorage.removeItem('authToken');
    window.location.href = withBase('index.html');
  }
  document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
  document.getElementById('logoutBtnDesktop')?.addEventListener('click', handleLogout);
}

/* Root ya pages/ folder — links hamesha sahi jagah point karein */
function withBase(path) {
  const inPagesFolder = window.location.pathname.includes('/pages/');
  return inPagesFolder ? '../' + path : './' + path;
}

/* Current page ka link highlight */
function isActive(fileName) {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  return current === fileName ? 'active' : '';
}

document.addEventListener('DOMContentLoaded', () => renderNavbar());
  
