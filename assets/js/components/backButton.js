/* PAGE HEADER — back arrow + title, sub-pages ke liye (home page pe nahi chahiye) */

function renderPageHeader(title, targetId = 'page-header-root') {
  const target = document.getElementById(targetId);
  if (!target) return;

  target.innerHTML = `
    <div class="page-header">
      <button class="page-header-back" id="pageBackBtn" aria-label="Go back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
      <span class="page-header-title">${title}</span>
    </div>
  `;

  document.getElementById('pageBackBtn').addEventListener('click', () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = typeof withBase === 'function' ? withBase('index.html') : '../index.html';
    }
  });
}
