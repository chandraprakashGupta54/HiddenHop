
// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
   
    setupEventListeners();
});
function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }}
    
    
    // Array of stations
console.log("Hello World"); 
const westernLineStations = [
    "Churchgate",
    "Marine Lines",
    "Charni Road",
    "Grant Road",
    "Mumbai Central",
    "Dadar",
    "Bandra",
    "Andheri",
    "Borivali",
    "Virar"
];

// Function to filter stations based on input of search bar
function filterStations() {
    const input = document.getElementById('stationSearch');
    const suggestions = document.getElementById('suggestions');

    if (!input || !suggestions) return;

    const query = input.value.toLowerCase().trim();

    if (query.length === 0) {
        suggestions.style.display = 'none';
        return;
    }

    // Filter stations 
    const filteredStations = westernLineStations.filter(station =>
        station.toLowerCase().includes(query)
    );

    // Show matching stations
    if (filteredStations.length > 0) {
        suggestions.innerHTML = filteredStations.map(station =>
            `<div class="suggestion-item" onclick="selectStation('${station}')">${station}</div>`
        ).join('');
        suggestions.style.display = 'block';
    } else {
        suggestions.style.display = 'none';
    }
}

// Function when user clicks a suggestion
function selectStation(station) {
    const input = document.getElementById('stationSearch');
    const suggestions = document.getElementById('suggestions');

    input.value = station;        // Fill input box
    suggestions.style.display = 'none'; // Hide dropdown

    // Show notification
     showNotification(` ${station} is selected. Now select the Category.`);
   // Show category section when the user select the station
    document.querySelector('.categories-preview').style.display = 'block';

    }

// Attach event listener to input
const stationSearch = document.getElementById('stationSearch');
if (stationSearch) {
    stationSearch.addEventListener('input', filterStations);
}

// when user selected the station the the Notification come
function showNotification(message) {
    // Create notification div
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Add it to body
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

//this is for showing notification when the categoty card is selected
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const category = card.getAttribute('data-category');
      const station = document.getElementById('stationSearch').value;
    if (!station) {
      showNotification("⚠️ Please select a station first!");
      return;
    }
    // Redirect to place.html with station + category
    window.location.href = `place.html?station=${encodeURIComponent(station)}&category=${encodeURIComponent(category)}`;
    });
});

