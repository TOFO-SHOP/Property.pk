/* Signup page logic — form + real OTP via EmailJS */

const EMAILJS_PUBLIC_KEY = 'aXMmc7-ZNDdNqOdHi';
const EMAILJS_SERVICE_ID = 'service_v6f7tfa';
const EMAILJS_TEMPLATE_ID = 'template_72t78lx';

emailjs.init(EMAILJS_PUBLIC_KEY);

let pendingSignupData = null;
let generatedOtp = null;

document.addEventListener('DOMContentLoaded', () => {
  handleSignupForm();
  handleOtpForm();
  handleOtpInputs();
  handleResendOtp();
});

function showMessage(elId, text, type) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = `<p class="form-${type}">${text}</p>`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function goToStep(stepId) {
  document.querySelectorAll('.auth-step').forEach(el => el.classList.remove('active'));
  document.getElementById(stepId).classList.add('active');
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function sendOtpEmail(toEmail, otp) {
  return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    to_email: toEmail,
    otp_code: otp
  });
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

    if (name.length < 2) return showMessage('signupMessage', 'Please enter your full name.', 'error');
    if (!isValidEmail(email)) return showMessage('signupMessage', 'Please enter a valid email address.', 'error');
    if (phone.length < 10) return showMessage('signupMessage', 'Please enter a valid phone number.', 'error');
    if (password.length < 6) return showMessage('signupMessage', 'Password must be at least 6 characters.', 'error');
    if (password !== confirmPassword) return showMessage('signupMessage', 'Passwords do not match.', 'error');
    if (!agreed) return showMessage('signupMessage', 'Please agree to the Terms & Conditions.', 'error');

    pendingSignupData = { name, email, phone, role, password };
    generatedOtp = generateOtp();

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending code...';

    sendOtpEmail(email, generatedOtp)
      .then(() => {
        document.getElementById('otpSubtitle').textContent = `Enter the 6-digit code sent to ${email}.`;
        goToStep('stepOtp');
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        showMessage('signupMessage', 'Could not send verification code. Please try again.', 'error');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
      });
  });
}

function handleOtpInputs() {
  const digits = document.querySelectorAll('.otp-digit');
  digits.forEach((input, i) => {
    input.addEventListener('input', () => {
      if (input.value && i < digits.length - 1) digits[i + 1].focus();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && i > 0) digits[i - 1].focus();
    });
  });
}

function handleOtpForm() {
  const form = document.getElementById('otpForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const digits = document.querySelectorAll('.otp-digit');
    const enteredOtp = Array.from(digits).map(d => d.value).join('');

    if (enteredOtp.length < 6) return showMessage('otpMessage', 'Please enter the full 6-digit code.', 'error');
    if (enteredOtp !== generatedOtp) return showMessage('otpMessage', 'Incorrect code. Please try again.', 'error');

    showMessage('otpMessage', 'Verified! Creating your account...', 'success');

    setTimeout(() => {
      localStorage.setItem('propertypk_user', JSON.stringify({ ...pendingSignupData, verified: true, loggedIn: true }));
      window.location.href = './login.html';
    }, 600);
  });
}

function handleResendOtp() {
  const btn = document.getElementById('resendOtpBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!pendingSignupData) return;
    generatedOtp = generateOtp();

    btn.disabled = true;
    sendOtpEmail(pendingSignupData.email, generatedOtp)
      .then(() => showMessage('otpMessage', 'A new code has been sent.', 'success'))
      .catch((err) => {
        console.error('EmailJS error:', err);
        showMessage('otpMessage', 'Could not resend code. Please try again.', 'error');
      });

    let seconds = 30;
    btn.textContent = `Resend in ${seconds}s`;
    const timer = setInterval(() => {
      seconds--;
      btn.textContent = `Resend in ${seconds}s`;
      if (seconds <= 0) {
        clearInterval(timer);
        btn.disabled = false;
        btn.textContent = 'Resend Code';
      }
    }, 1000);
  });
      }
