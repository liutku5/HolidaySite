let holidays = [];
        let currentHolidayIndex = 0;
        let currentPhotoIndex = 0;
        let photoInterval;

        async function fetchHolidays() {
            try {
                const response = await fetch('http://localhost:8000/getHolidays');
                holidays = await response.json();
                populateHolidayShowcase(holidays[currentHolidayIndex]);
                startPhotoInterval();
            } catch (error) {
                console.error('Error fetching holidays:', error);
            }
        }

        function populateHolidayShowcase(holiday) {
            const averageRating = holiday.rating.reduce((acc, val) => acc + val, 0) / holiday.rating.length;
            const container = document.getElementById('holidayContainer');
            container.innerHTML = `
                <div class="card">
                    <img src="${holiday.photos[0]}" class="card-img" id="holidayPhoto" alt="Holiday photo">
                    <div class="card-body">
                        <h5 class="card-title">${holiday.title}</h5>
                        <p class="card-text"><strong>Country:</strong> ${holiday.country}</p>
                        <p class="card-text"><strong>City:</strong> ${holiday.city}</p>
                        <p class="card-text"><strong>Duration:</strong> ${holiday.duration}</p>
                        <p class="card-text"><strong>Season:</strong> ${holiday.season}</p>
                        <p class="card-text"><strong>Description:</strong> ${holiday.description}</p>
                        <p class="card-text"><strong>Price:</strong> $${holiday.price.toFixed(2)}</p>
                        <div class="card-text holiday-rating">
                            <strong>Rating:</strong> 
                            <span class="stars" style="--rating: ${(averageRating / 5) * 100}%"></span> 
                            (${averageRating.toFixed(1)} / 5)
                        </div>
                    </div>
                </div>
            `;
        }

        function startPhotoInterval() {
            clearInterval(photoInterval);
            photoInterval = setInterval(() => {
                const holiday = holidays[currentHolidayIndex];
                currentPhotoIndex = (currentPhotoIndex + 1) % holiday.photos.length;
                document.getElementById('holidayPhoto').src = holiday.photos[currentPhotoIndex];
            }, 7000);  // 7 seconds interval
        }

        document.getElementById('prevHoliday').addEventListener('click', (event) => {
            event.preventDefault();
            currentHolidayIndex = (currentHolidayIndex - 1 + holidays.length) % holidays.length;
            currentPhotoIndex = 0;
            populateHolidayShowcase(holidays[currentHolidayIndex]);
            startPhotoInterval();
        });

        document.getElementById('nextHoliday').addEventListener('click', (event) => {
            event.preventDefault();
            currentHolidayIndex = (currentHolidayIndex + 1) % holidays.length;
            currentPhotoIndex = 0;
            populateHolidayShowcase(holidays[currentHolidayIndex]);
            startPhotoInterval();
        });

        // Fetch and populate holiday data when the page loads
        fetchHolidays();