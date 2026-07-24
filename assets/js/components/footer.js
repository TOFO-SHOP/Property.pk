function renderFooter(targetId = 'footer-root') {
  const target = document.getElementById(targetId);
  if (!target) return;
  const year = new Date().getFullYear();
  const base = typeof withBase === 'function' ? withBase : (p) => './' + p;

  target.innerHTML = `
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-cols">

          <div class="footer-col footer-about">
            <div class="footer-brand">Property.pk</div>
            <p class="footer-tagline">Pakistan bhar ki verified properties ek hi jagah. Ghar, plot aur flat khareedne aur bechne ka bharosemand tareeqa.</p>
            <div class="footer-social">
              <a href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-2.9h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6v1.8h2.8L15.7 15h-2.3v7A10 10 0 0 0 22 12Z"/></svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>
              </a>
              <a href="#" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.2-.7-2.7-1.1-4.4-3.9-4.5-4.1-.1-.2-1.1-1.4-1.1-2.7s.7-1.9 .9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5c-.1.2-.3.3-.1.6.1.3.7 1.1 1.4 1.7.9.8 1.7 1 2 1.2.2.1.4.1.6-.1l.6-.7c.2-.2.3-.2.6-.1l1.9.9c.3.1.5.2.5.4.1.2.1.9-.1 1.4Z"/></svg>
              </a>
            </div>
          </div>

          <div class="footer-col">
            <h4 class="footer-heading">Explore</h4>
            <nav class="footer-links footer-links-col">
              <a href="${base('index.html')}">Home</a>
              <a href="${base('pages/property.html')}">Properties</a>
              <a href="${base('pages/about.html')}">About Us</a>
              <a href="${base('pages/contact.html')}">Contact</a>
            </nav>
          </div>

          <div class="footer-col">
            <h4 class="footer-heading">Company</h4>
            <nav class="footer-links footer-links-col">
              <a href="${base('pages/privacy-policy.html')}">Privacy Policy</a>
              <a href="${base('pages/terms.html')}">Terms &amp; Conditions</a>
            </nav>
          </div>

          <div class="footer-col">
            <h4 class="footer-heading">Contact</h4>
            <ul class="footer-contact">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z" fill="none"/><path d="M22 6l-10 7L2 6"/></svg>
                <a href="mailto:info@property.pk">info@property.pk</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.6 2.8a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.7 2Z"/></svg>
                <a href="tel:+923700132413">+92 370 0132413</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>Lahore, Pakistan</span>
              </li>
            </ul>
          </div>

        </div>

        <div class="footer-bottom">
          <span>&copy; ${year} Property.pk. All rights reserved.</span>
          <span class="footer-made">Made in Pakistan</span>
        </div>
      </div>
    </footer>
  `;
}

document.addEventListener('DOMContentLoaded', () => renderFooter());
