// State management
let allFavourites = [];
let filteredFavourites = [];

// Category icons mapping
const categoryIcons = {
    restaurant: 'fa-utensils',
    travel: 'fa-map-marked-alt',
    hospital: 'fa-hospital',
    college: 'fa-graduation-cap',
    printing: 'fa-print',
    store: 'fa-store'
};

// DOM Elements
const favouritesGrid = document.getElementById('favouritesGrid');
const emptyState = document.getElementById('emptyState');
const loadingState = document.getElementById('loadingState');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const stationFilter = document.getElementById('stationFilter');

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadFavourites();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    searchInput.addEventListener('input', handleSearch);
    categoryFilter.addEventListener('change', handleFilter);
    stationFilter.addEventListener('change', handleFilter);
}

// Load favourites from backend
async function loadFavourites() {
    try {
        showLoading(true);
        
        const response = await fetch('/api/favourites', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add authorization header if using authentication
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch favourites');
        }

        const data = await response.json();
        allFavourites = data.favourites || [];
        filteredFavourites = [...allFavourites];
        
        populateStationFilter();
        displayFavourites();
        
    } catch (error) {
        console.error('Error loading favourites:', error);
        showError('Failed to load favourites. Please try again later.');
    } finally {
        showLoading(false);
    }
}

// Display favourites in grid
function displayFavourites() {
    favouritesGrid.innerHTML = '';
    
    if (filteredFavourites.length === 0) {
        showEmptyState(true);
        return;
    }
    
    showEmptyState(false);
    
    filteredFavourites.forEach((fav, index) => {
        const card = createFavouriteCard(fav, index);
        favouritesGrid.appendChild(card);
    });
}

// Create favourite card element
function createFavouriteCard(favourite, index) {
    const card = document.createElement('div');
    card.className = 'favourite-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const icon = categoryIcons[favourite.category] || 'fa-map-marker-alt';
    
    card.innerHTML = `
        <div class="card-image">
            ${favourite.imgUrl ? 
                `<img src="${favourite.imgUrl}" alt="${favourite.placeName}" style="width: 100%; height: 100%; object-fit: cover;">` :
                `<i class="fas ${icon}"></i>`
            }
        </div>
        <div class="card-content">
            <span class="card-category ${favourite.category}">${favourite.category}</span>
            <h3 class="card-title">${favourite.placeName}</h3>
            <div class="card-station">
                <i class="fas fa-train"></i>
                <span>${favourite.station}</span>
            </div>
            <p class="card-description">${favourite.description || 'No description available'}</p>
            <div class="card-actions">
                <button class="btn-remove" onclick="removeFavourite('${favourite._id}', '${favourite.placeName}')">
                    <i class="fas fa-trash"></i>
                    Remove
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Remove favourite
async function removeFavourite(favouriteId, placeName) {
    if (!confirm(`Are you sure you want to remove "${placeName}" from favourites?`)) {
        return;
    }
    
    try {
        const response = await fetch(`/api/favourites/${favouriteId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // Add authorization header if using authentication
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to remove favourite');
        }

        // Update local state
        allFavourites = allFavourites.filter(fav => fav._id !== favouriteId);
        filteredFavourites = filteredFavourites.filter(fav => fav._id !== favouriteId);
        
        // Re-render
        displayFavourites();
        populateStationFilter();
        
        showNotification('Favourite removed successfully!', 'success');
        
    } catch (error) {
        console.error('Error removing favourite:', error);
        showNotification('Failed to remove favourite. Please try again.', 'error');
    }
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    filteredFavourites = allFavourites.filter(fav => {
        const matchesSearch = fav.placeName.toLowerCase().includes(searchTerm) ||
                            fav.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter.value || fav.category === categoryFilter.value;
        const matchesStation = !stationFilter.value || fav.station === stationFilter.value;
        
        return matchesSearch && matchesCategory && matchesStation;
    });
    
    displayFavourites();
}

// Handle filter
function handleFilter() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const selectedStation = stationFilter.value;
    
    filteredFavourites = allFavourites.filter(fav => {
        const matchesSearch = !searchTerm || 
                            fav.placeName.toLowerCase().includes(searchTerm) ||
                            fav.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !selectedCategory || fav.category === selectedCategory;
        const matchesStation = !selectedStation || fav.station === selectedStation;
        
        return matchesSearch && matchesCategory && matchesStation;
    });
    
    displayFavourites();
}

// Populate station filter dropdown
function populateStationFilter() {
    const stations = [...new Set(allFavourites.map(fav => fav.station))].sort();
    
    stationFilter.innerHTML = '<option value="">All Stations</option>';
    
    stations.forEach(station => {
        const option = document.createElement('option');
        option.value = station;
        option.textContent = station;
        stationFilter.appendChild(option);
    });
}

// Show/hide empty state
function showEmptyState(show) {
    emptyState.style.display = show ? 'block' : 'none';
    favouritesGrid.style.display = show ? 'none' : 'grid';
}

// Show/hide loading state
function showLoading(show) {
    loadingState.style.display = show ? 'block' : 'none';
    favouritesGrid.style.display = show ? 'none' : 'grid';
    emptyState.style.display = 'none';
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#00c49a' : '#ff4757'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Show error message
function showError(message) {
    favouritesGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
            <i class="fas fa-exclamation-circle" style="font-size: 4rem; color: #ff4757; margin-bottom: 1rem;"></i>
            <h3 style="color: #555; margin-bottom: 0.5rem;">Oops! Something went wrong</h3>
            <p style="color: #888;">${message}</p>
            <button onclick="loadFavourites()" style="margin-top: 1rem; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 25px; cursor: pointer;">
                Try Again
            </button>
        </div>
    `;
    showLoading(false);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);