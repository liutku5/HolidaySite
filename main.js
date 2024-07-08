async function fetchHolidays() {
    try {
        const response = await fetch('http://localhost:8000/getHolidays');
        const holidays = await response.json();
        populateHolidayShowcase(holidays);
    } catch (error) {
        console.error('Error fetching holidays:', error);
    }
}

function populateHolidayShowcase(holidays) {
    const container = document.getElementById('holidayContainer');
    holidays.forEach((holiday, index) => {
        const carouselItem = document.createElement('div');
        carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        carouselItem.innerHTML = `
            <div class="card">
                <img src="${holiday.photos[0]}" class="card-img" alt="Holiday photo">
                <div class="card-body">
                    <h5 class="card-title">${holiday.title}</h5>
                    <p class="card-text"><strong>Country:</strong> ${holiday.country}</p>
                    <p class="card-text"><strong>City:</strong> ${holiday.city}</p>
                    <p class="card-text"><strong>Duration:</strong> ${holiday.duration}</p>
                    <p class="card-text"><strong>Season:</strong> ${holiday.season}</p>
                    <p class="card-text"><strong>Description:</strong> ${holiday.description}</p>
                    <p class="card-text"><strong>Price:</strong> $${holiday.price.toFixed(2)}</p>
                    <div class="card-text holiday-rating"><strong>Rating:</strong> ${holiday.rating[0]} / 5</div>
                </div>
            </div>
        `;
        container.appendChild(carouselItem);
    });
}

// Fetch and populate holiday data when the page loads
fetchHolidays();