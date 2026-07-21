function renderFooter(targetId = 'footer-root') {
  const target = document.getElementById(targetId);
  if (!target) return;
  const year = new Date().getFullYear();
  const base = typeof withBase === 'function' ? withBase : (p) => './' + p;

  target.innerHTML = `
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">Property.pk</div>
        <nav class="footer-links">
          <a href="${base('index.html')}">Home</a>
          <a href="${base('pages/property.html')}">Properties</a>
          <a href="${base('pages/about.html')}">About Us</a>
          <a href="${base('pages/contact.html')}">Contact</a>
          <a href="${base('pages/privacy-policy.html')}">Privacy Policy</a>
          <a href="${base('pages/terms.html')}">Terms & Conditions</a>
        </nav>
        <div class="footer-bottom">&copy; ${year} Property.pk. All rights reserved.</div>
      </div>
    </footer>
  `;
}

document.addEventListener('DOMContentLoaded', () => renderFooter());
