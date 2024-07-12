let holidays = [];
        let currentIndex = 0;

        async function fetchHolidays() {
            try {
                const response = await fetch('http://localhost:8000/getHolidays');
                holidays = await response.json();
                if (holidays.length > 0) {
                    populateShowcase(holidays[currentIndex]);
                    setInterval(updateShowcase, 5000); // Update every 5 seconds
                }
            } catch (error) {
                console.error('Error fetching holidays:', error);
            }
        }

        function populateShowcase(holiday) {
            document.getElementById('showcaseTitle').textContent = holiday.title;
            document.getElementById('showcasePhoto').src = holiday.photos[0];
            document.getElementById('showcaseLink').href = `http://localhost:8000/holiday/${holiday.id}`;
        }

        function updateShowcase() {
            currentIndex = (currentIndex + 1) % holidays.length;
            populateShowcase(holidays[currentIndex]);
        }

        fetchHolidays();