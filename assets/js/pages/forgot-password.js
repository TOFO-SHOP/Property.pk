/* Forgot Password page logic */

document.addEventListener('DOMContentLoaded', () => {
  handleForgotForm();
});

function showMessage(elId, text, type) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = `<p class="form-${type}">${text}</p>`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function handleForgotForm() {
  const form = document.getElementById('forgotForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value.trim();

    if (!isValidEmail(email)) {
      showMessage('forgotMessage', 'Please enter a valid email address.', 'error');
      return;
    }

    // TODO: replace with real API call once backend is connected
    showMessage('forgotMessage', `If an account exists for ${email}, a reset link has been sent.`, 'success');
    form.reset();
  });
}
