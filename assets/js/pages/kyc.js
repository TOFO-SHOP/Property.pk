/* Seller KYC verification logic */

let uploadedImages = { cnicFront: null, cnicBack: null, selfie: null };

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  formatCnicInput();
  handleFileUpload('kycCnicFront', 'previewCnicFront', 'cnicFront');
  handleFileUpload('kycCnicBack', 'previewCnicBack', 'cnicBack');
  handleFileUpload('kycSelfie', 'previewSelfie', 'selfie');
  handleKycForm();
});

function checkAuth() {
  const isLoggedIn = !!localStorage.getItem('authToken');
  if (!isLoggedIn) window.location.href = './auth/login.html';
}

function showKycMessage(text, type) {
  const el = document.getElementById('kycMessage');
  if (!el) return;
  el.innerHTML = `<p class="form-${type}">${text}</p>`;
}

function formatCnicInput() {
  const input = document.getElementById('kycCnic');
  if (!input) return;
  input.addEventListener('input', () => {
    let digits = input.value.replace(/\D/g, '').slice(0, 13);
    let formatted = digits;
    if (digits.length > 5) formatted = digits.slice(0, 5) + '-' + digits.slice(5);
    if (digits.length > 12) formatted = formatted.slice(0, 13) + '-' + digits.slice(12);
    input.value = formatted;
  });
}

function handleFileUpload(inputId, previewId, key) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (!input || !preview) return;

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImages[key] = e.target.result;
      preview.innerHTML = `<img src="${e.target.result}" alt="Uploaded">`;
      preview.classList.add('has-image');
    };
    reader.readAsDataURL(file);
  });
}

function handleKycForm() {
  const form = document.getElementById('kycForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const cnic = document.getElementById('kycCnic').value.trim();

    if (cnic.length < 15) {
      showKycMessage('Please enter a valid 13-digit CNIC number.', 'error');
      return;
    }
    if (!uploadedImages.cnicFront || !uploadedImages.cnicBack || !uploadedImages.selfie) {
      showKycMessage('Please upload all required photos.', 'error');
      return;
    }

    // TODO: replace with real API call (POST /kyc) once backend + Admin Panel (Phase 8) exist.
    // For now, submission is auto-approved since there's no manual review system yet.
    const kycRecord = {
      status: 'Verified',
      cnicNumber: cnic,
      cnicFront: uploadedImages.cnicFront,
      cnicBack: uploadedImages.cnicBack,
      selfie: uploadedImages.selfie,
      submittedDate: new Date().toISOString().slice(0, 10)
    };

    try {
      localStorage.setItem('propertypk_kyc', JSON.stringify(kycRecord));
    } catch (err) {
      showKycMessage('Could not save verification — photos may be too large. Try smaller images.', 'error');
      return;
    }

    showKycMessage('Verification submitted! Your account is now marked as Verified.', 'success');

    setTimeout(() => {
      window.location.href = './seller-dashboard.html';
    }, 1200);
  });
    }
