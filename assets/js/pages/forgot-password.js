/* Forgot Password page logic — email → real OTP via EmailJS → reset */

const EMAILJS_PUBLIC_KEY = 'aXMmc7-ZNDdNqOdHi';
const EMAILJS_SERVICE_ID = 'service_v6f7tfa';
const EMAILJS_TEMPLATE_ID = 'template_72t78lx';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

let resetEmail = null;
let generatedOtp = null;

document.addEventListener('DOMContentLoaded', () => {
  handleForgotForm();
  handleOtpForm();
  handleOtpInputs();
  handleResendOtp();
  handleResetForm();
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

function handleForgotForm() {
  const form = document.getElementById('forgotForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value.trim();

    if (!isValidEmail(email)) return showMessage('forgotMessage', 'Please enter a valid email address.', 'error');

    resetEmail = email;
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
        showMessage('forgotMessage', 'Could not send code. Please try again.', 'error');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Code';
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

    goToStep('stepReset');
  });
}

function handleResendOtp() {
  const btn = document.getElementById('resendOtpBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!resetEmail) return;
    generatedOtp = generateOtp();

    btn.disabled = true;
    sendOtpEmail(resetEmail, generatedOtp)
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

function handleResetForm() {
  const form = document.getElementById('resetForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (newPassword.length < 8) return showMessage('resetMessage', 'Password must be at least 8 characters.', 'error');
    if (newPassword !== confirmNewPassword) return showMessage('resetMessage', 'Passwords do not match.', 'error');

    // TODO: real backend call — POST /auth/reset-password { email: resetEmail, newPassword }
    showMessage('resetMessage', 'Password reset successfully! Redirecting to login...', 'success');

    setTimeout(() => {
      window.location.href = './login.html';
    }, 1200);
  });
  }
