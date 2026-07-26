/* Edit Property form logic */

let editingListingId = null;

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  populateCityOptions();
  loadListingData();
  handleEditPropertyForm();
});

function checkAuth() {
  const isLoggedIn = !!localStorage.getItem('authToken');
  if (!isLoggedIn) window.location.href = './auth/login.html';
}

function populateCityOptions() {
  const select = document.getElementById('epCity');
  if (!select || typeof CITIES === 'undefined') return;
  CITIES.forEach(city => select.appendChild(new Option(city, city)));
}

function showEpMessage(text, type) {
  const el = document.getElementById('epMessage');
  if (!el) return;
  el.innerHTML = `<p class="form-${type}">${text}</p>`;
}

function getMyListings() {
  return JSON.parse(localStorage.getItem('propertypk_my_listings') || '[]');
}

function loadListingData() {
  const params = new URLSearchParams(window.location.search);
  editingListingId = Number(params.get('id'));

  const listings = getMyListings();
  const listing = listings.find(l => l.id === editingListingId);

  if (!listing) {
    document.querySelector('.static-page-card').innerHTML = '<p class="form-error">Listing not found.</p>';
    return;
  }

  document.getElementById('epStatus').value = listing.status;
  document.getElementById('epType').value = listing.type;
  document.getElementById('epTitle').value = listing.title;
  document.getElementById('epDescription').value = listing.description;
  document.getElementById('epCity').value = listing.city;
  document.getElementById('epArea').value = listing.area;
  document.getElementById('epPrice').value = listing.price;
  document.getElementById('epMarla').value = listing.marla;
  document.getElementById('epBedrooms').value = listing.bedrooms;
  document.getElementById('epBathrooms').value = listing.bathrooms;
  document.getElementById('epFloors').value = listing.floors || 'Single Story';
  document.getElementById('epImages').value = (listing.images || []).join(', ');
  document.getElementById('epPhone').value = listing.contactPhone || '';
  document.getElementById('epWhatsapp').value = listing.contactWhatsapp || '';

  const a = listing.amenities || {};
  document.getElementById('epParking').checked = !!a.parking;
  document.getElementById('epGas').checked = !!a.gas;
  document.getElementById('epElectricityBackup').checked = !!a.electricityBackup;
  document.getElementById('epWaterSupply').checked = !!a.waterSupply;
  document.getElementById('epSecurity').checked = !!a.security;
  document.getElementById('epElevator').checked = !!a.elevator;
  document.getElementById('epGarden').checked = !!a.garden;
  document.getElementById('epFurnished').checked = !!a.furnished;
}

function handleEditPropertyForm() {
  const form = document.getElementById('editPropertyForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const imagesRaw = document.getElementById('epImages').value.trim();
    const images = imagesRaw.split(',').map(s => s.trim()).filter(Boolean);

    if (images.length === 0) {
      showEpMessage('Please provide at least one image URL.', 'error');
      return;
    }

    const listings = getMyListings();
    const index = listings.findIndex(l => l.id === editingListingId);
    if (index === -1) {
      showEpMessage('Listing not found.', 'error');
      return;
    }

    listings[index] = {
      ...listings[index],
      status: document.getElementById('epStatus').value,
      type: document.getElementById('epType').value,
      title: document.getElementById('epTitle').value.trim(),
      description: document.getElementById('epDescription').value.trim(),
      city: document.getElementById('epCity').value,
      area: document.getElementById('epArea').value.trim(),
      price: Number(document.getElementById('epPrice').value),
      marla: Number(document.getElementById('epMarla').value),
      bedrooms: Number(document.getElementById('epBedrooms').value),
      bathrooms: Number(document.getElementById('epBathrooms').value),
      floors: document.getElementById('epFloors').value,
      amenities: {
        parking: document.getElementById('epParking').checked,
        gas: document.getElementById('epGas').checked,
        electricityBackup: document.getElementById('epElectricityBackup').checked,
        waterSupply: document.getElementById('epWaterSupply').checked,
        security: document.getElementById('epSecurity').checked,
        elevator: document.getElementById('epElevator').checked,
        garden: document.getElementById('epGarden').checked,
        furnished: document.getElementById('epFurnished').checked
      },
      images: images,
      image: images[0],
      contactPhone: document.getElementById('epPhone').value.trim(),
      contactWhatsapp: document.getElementById('epWhatsapp').value.trim()
    };

    // TODO: replace with real API call (PUT /properties/:id) once backend is connected
    localStorage.setItem('propertypk_my_listings', JSON.stringify(listings));

    showEpMessage('Listing updated successfully!', 'success');

    setTimeout(() => {
      window.location.href = './seller-dashboard.html';
    }, 1000);
  });
      }
