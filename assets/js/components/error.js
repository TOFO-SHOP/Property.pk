function showError(targetId, message = 'Something went wrong.', onRetry = null) {
  const target = document.getElementById(targetId);
  if (!target) return;

  target.innerHTML = `
    <div class="error-wrapper">
      <p>${message}</p>
      ${onRetry ? `<button class="btn btn-primary" id="errorRetryBtn">Retry</button>` : ''}
    </div>
  `;

  if (onRetry) {
    document.getElementById('errorRetryBtn')?.addEventListener('click', onRetry);
  }
}
