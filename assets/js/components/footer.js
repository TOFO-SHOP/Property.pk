function renderFooter(targetId = 'footer-root') {
  const target = document.getElementById(targetId);
  if (!target) return;
  const year = new Date().getFullYear();

  target.innerHTML = `
    <footer class="footer">
      <div class="container">
        <p>&copy; ${year} Property.pk — All rights reserved.</p>
        <div>
          <a href="./pages/privacy-policy.html">Privacy Policy</a> |
          <a href="./pages/terms.html">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  `;
}

document.addEventListener('DOMContentLoaded', () => renderFooter());
