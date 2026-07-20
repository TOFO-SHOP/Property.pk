/* AUTH API — abhi dummy hai, backend aane par activate karo */

async function loginApi(email, password) {
  console.warn('authApi.loginApi: backend not connected yet');
  return { success: false, message: 'API not connected yet' };
  // return apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

async function signupApi(userData) {
  console.warn('authApi.signupApi: backend not connected yet');
  return { success: false, message: 'API not connected yet' };
}

async function forgotPasswordApi(email) {
  console.warn('authApi.forgotPasswordApi: backend not connected yet');
  return { success: false, message: 'API not connected yet' };
}

async function logoutApi() {
  localStorage.removeItem('authToken');
  return { success: true };
}
