function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value) {
  return /^[0-9]{10,15}$/.test(value);
}

function isStrongPassword(value) {
  return value.length >= 8;
}

function isNotEmpty(value) {
  return value !== null && value !== undefined && value.toString().trim() !== '';
}

function validateSignupForm(data) {
  const errors = {};
  if (!isNotEmpty(data.name)) errors.name = 'Name is required';
  if (!isEmail(data.email)) errors.email = 'Valid email is required';
  if (!isStrongPassword(data.password)) errors.password = 'Password must be at least 8 characters';
  return { valid: Object.keys(errors).length === 0, errors };
}
