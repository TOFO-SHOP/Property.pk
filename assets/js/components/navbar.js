function renderNavbar(targetId = 'navbar-root') {
  const target = document.getElementById(targetId);
  if (!target) return;
  const isLoggedIn = !!localStorage.getItem('authToken');

  target.innerHTML = `
    <nav class="navbar">
      <a href="./index.html" class="navbar-logo">Property.pk</a>
      <button class="navbar-toggle" id="navbarToggle" aria-label="Toggle menu">&#9776;</button>
      <ul class="navbar-links" id="navbarLinks">
        <li><a href="./index.html">Home</a></li>
        <li><a href="./pages/property.html">Properties</a></li>
        <li><a href="./pages/about.html">About Us</a></li>
        <li><a href="./pages/contact.html">Contact</a></li>
      </ul>
      <div class="navbar-actions">
        ${isLoggedIn
          ? `<a href="./pages/buyer-dashboard.html" class="btn btn-outline">Dashboard</a>
             <button class="btn btn-primary" id="logoutBtn">Logout</button>`
          : `<a href="./pages/login.html" class="btn btn-outline">Login</a>
             <a href="./pages/signup.html" class="btn btn-primary">Sign Up</a>`}
      </div>
    </nav>
  `;

  const toggleBtn = document.getElementById('navbarToggle');
  const links = document.getElementById('navbarLinks');
  if (toggleBtn && links) {
    toggleBtn.addEventListener('click', () => links.classList.toggle('open'));
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('authToken');
      window.location.href = './index.html';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => renderNavbar());
