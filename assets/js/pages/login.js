/* Login page logic */

document.addEventListener('DOMContentLoaded', () => {
  handleLoginForm();
});

function showMessage(elId, text, type) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = `<p class="form-${type}">${text}</p>`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function handleLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!isValidEmail(email)) {
      showMessage('loginMessage', 'Please enter a valid email address.', 'error');
      return;
    }
    if (password.length < 6) {
      showMessage('loginMessage', 'Password must be at least 6 characters.', 'error');
      return;
    }

    showMessage('loginMessage', 'Logging you in...', 'success');

    // TODO: replace with real API call once backend is connected
    setTimeout(() => {
      localStorage.setItem('propertypk_user', JSON.stringify({ email, loggedIn: true }));
      window.location.href = '../../index.html';
    }, 600);
  });
}
