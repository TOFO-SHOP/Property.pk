function formatPrice(amount) {
  if (amount >= 10000000) return `Rs ${(amount / 10000000).toFixed(2)} Crore`;
  if (amount >= 100000) return `Rs ${(amount / 100000).toFixed(2)} Lakh`;
  return `Rs ${amount.toLocaleString()}`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function truncateText(text, maxLength = 100) {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
                                                         }
