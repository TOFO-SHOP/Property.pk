function showLoading(targetId, message = 'Loading...') {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = `
    <div class="loading-wrapper">
      <div class="spinner"></div>
      <p>${message}</p>
    </div>
  `;
}

function hideLoading(targetId) {
  const target = document.getElementById(targetId);
  if (target) target.innerHTML = '';
}
