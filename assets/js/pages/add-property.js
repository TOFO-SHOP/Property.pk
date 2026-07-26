/* Add Property form logic */

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  populateCityOptions();
  handleAddPropertyForm();
});

function checkAuth() {
  const isLoggedIn = !!localStorage.getItem('authToken');
  if (!isLoggedIn) window.location.href = './auth/login.html';
}

function populateCityOptions() {
  const select = document.getElementById('apCity');
  if (!select || typeof CITIES === 'undefined') return;
  CITIES.forEach(city => select.appendChild(new Option(city, city)));
}

function showApMessage(text, type) {
  const el = document.getElementById('apMessage');
  if (!el) return;
  el.innerHTML = `<p class="form-${type}">${text}</p>`;
}

function getMyListings() {
  return JSON.parse(localStorage.getItem('propertypk_my_listings') || '[]');
}

function handleAddPropertyForm() {
  const form = document.getElementById('addPropertyForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const imagesRaw = document.getElementById('apImages').value.trim();
    const images = imagesRaw.split(',').map(s => s.trim()).filter(Boolean);

    if (images.length === 0) {
      showApMessage('Please provide at least one image URL.', 'error');
      return;
    }

    const user = JSON.parse(localStorage.getItem('propertypk_user') || '{}');

    const listing = {
      id: Date.now(),
      status: document.getElementById('apStatus').value,
      approvalStatus: 'Pending',
      type: document.getElementById('apType').value,
      title: document.getElementById('apTitle').value.trim(),
      description: document.getElementById('apDescription').value.trim(),
      city: document.getElementById('apCity').value,
      area: document.getElementById('apArea').value.trim(),
      price: Number(document.getElementById('apPrice').value),
      marla: Number(document.getElementById('apMarla').value),
      bedrooms: Number(document.getElementById('apBedrooms').value),
      bathrooms: Number(document.getElementById('apBathrooms').value),
      floors: document.getElementById('apFloors').value,
      amenities: {
        parking: document.getElementById('apParking').checked,
        gas: document.getElementById('apGas').checked,
        electricityBackup: document.getElementById('apElectricityBackup').checked,
        waterSupply: document.getElementById('apWaterSupply').checked,
        security: document.getElementById('apSecurity').checked,
        elevator: document.getElementById('apElevator').checked,
        garden: document.getElementById('apGarden').checked,
        furnished: document.getElementById('apFurnished').checked
      },
      images: images,
      image: images[0],
      contactPhone: document.getElementById('apPhone').value.trim(),
      contactWhatsapp: document.getElementById('apWhatsapp').value.trim(),
      sellerEmail: user.email || '',
      views: 0,
      postedDate: new Date().toISOString().slice(0, 10)
    };

    if (!listing.title || !listing.area || !listing.city || !listing.contactPhone) {
      showApMessage('Please fill in all required fields.', 'error');
      return;
    }

    // TODO: replace with real API call (POST /properties) once backend is connected
    const listings = getMyListings();
    listings.unshift(listing);
    localStorage.setItem('propertypk_my_listings', JSON.stringify(listings));

    showApMessage('Listing submitted successfully! It will appear in your dashboard as Pending review.', 'success');

    setTimeout(() => {
      window.location.href = './seller-dashboard.html';
    }, 1200);
  });
                    }
