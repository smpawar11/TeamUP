document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const locationInput = document.getElementById('location-input').value.trim();

        if (locationInput) {
            console.log(`Searching for parks near: ${locationInput}`);
            // Open the search results in a new tab
            window.open(`parks.html?location=${encodeURIComponent(locationInput)}`, '_blank');
        } else {
            alert('Please enter a valid location.');
        }
    });
});
