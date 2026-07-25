/* Profile page logic — view & edit account info */

document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  handleProfileForm();
});

function showMessage(elId, text, type) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = `<p class="form-${type}">${text}</p>`;
}

function loadProfile() {
  const isLoggedIn = !!localStorage.getItem('authToken');
  if (!isLoggedIn) {
    window.location.href = './auth/login.html';
    return;
  }

  const user = JSON.parse(localStorage.getItem('propertypk_user') || '{}');
  document.getElementById('profileName').value = user.name || '';
  document.getElementById('profileEmail').value = user.email || '';
  document.getElementById('profileRole').value = user.role || 'buyer';
}

function handleProfileForm() {
  const form = document.getElementById('profileForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('profileName').value.trim();
    const role = document.getElementById('profileRole').value;

    if (name.length < 2) {
      showMessage('profileMessage', 'Please enter your full name.', 'error');
      return;
    }

    // TODO: replace with real API call once backend is connected
    const existing = JSON.parse(localStorage.getItem('propertypk_user') || '{}');
    localStorage.setItem('propertypk_user', JSON.stringify({ ...existing, name, role }));

    showMessage('profileMessage', 'Profile updated successfully.', 'success');
  });
  }
