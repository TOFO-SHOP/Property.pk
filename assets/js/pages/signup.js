/* Signup page logic */

document.addEventListener('DOMContentLoaded', () => {
  handleSignupForm();
});

function showMessage(elId, text, type) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = `<p class="form-${type}">${text}</p>`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function handleSignupForm() {
  const form = document.getElementById('signupForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const role = document.getElementById('signupRole').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const agreed = document.getElementById('agreeTerms').checked;

    if (name.length < 2) {
      showMessage('signupMessage', 'Please enter your full name.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showMessage('signupMessage', 'Please enter a valid email address.', 'error');
      return;
    }
    if (phone.length < 10) {
      showMessage('signupMessage', 'Please enter a valid phone number.', 'error');
      return;
    }
    if (password.length < 6) {
      showMessage('signupMessage', 'Password must be at least 6 characters.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showMessage('signupMessage', 'Passwords do not match.', 'error');
      return;
    }
    if (!agreed) {
      showMessage('signupMessage', 'Please agree to the Terms & Conditions.', 'error');
      return;
    }

    showMessage('signupMessage', 'Creating your account...', 'success');

    // TODO: replace with real API call once backend is connected
    setTimeout(() => {
      localStorage.setItem('propertypk_user', JSON.stringify({ name, email, phone, role, loggedIn: true }));
      window.location.href = './login.html';
    }, 600);
  });
                        }
