document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const location = urlParams.get('location');

    if (!location) {
        alert('No location specified.');
        return;
    }

    document.getElementById('location-name').textContent = location;

    try {
        console.log('Fetching parks for location:', location);

        const response = await fetch('http://localhost:3008/recommend-parks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location }),
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Received data:', data);

        if (data.parks && data.parks.length > 0) {
            displayParks(data.parks);
        } else {
            alert('No parks found for the given location.');
        }
    } catch (error) {
        console.error('Error fetching and displaying parks:', error);
        alert('An error occurred while fetching park data. Please try again later.');
    }
});

function displayParks(parks) {
    const parksContainer = document.getElementById('parks-container');
    parksContainer.innerHTML = ''; // Clear any existing content

    parks.forEach((park) => {
        const parkElement = document.createElement('div');
        parkElement.classList.add('park');

        const parkName = document.createElement('h3');
        parkName.textContent = park.name;

        const parkVicinity = document.createElement('p');
        parkVicinity.textContent = `Location: ${park.vicinity}`;

        const parkRating = document.createElement('p');
        parkRating.textContent = `Rating: ${park.rating || 'N/A'}`;

        const parkImage = document.createElement('img');
        parkImage.src = park.photoUrl || 'default-image.jpg'; // Use a default image if no photo URL is available
        parkImage.alt = park.name;

        parkElement.appendChild(parkName);
        parkElement.appendChild(parkVicinity);
        parkElement.appendChild(parkRating);
        parkElement.appendChild(parkImage);

        parksContainer.appendChild(parkElement);
    });
}
