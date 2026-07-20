/* ============================================
   API CONFIG — Backend ready hone par sirf
   yeh BASE_URL update karni hai
   ============================================ */

const API_BASE_URL = 'http://localhost:5000/api'; // TODO: update on deploy

async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('authToken')
          ? { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
          : {})
      },
      ...options
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
      }
