let holidays = [];
let currentHolidayIndex = 0;
let currentPhotoIndex = 0;
let photoInterval;
const form = document.getElementById('editHolidayForm');
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
                <button class="btn btn-warning" onclick="editHoliday(${holiday.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteHoliday(${holiday.id})">Delete</button>
            </div>
        </div>
    `;

    // Add event listeners for the stars
    document.querySelectorAll('.holiday-rating .stars').forEach(star => {
        star.addEventListener('click', (event) => addRating(holiday.id, event.target.dataset.value));
    });
}

function startPhotoInterval() {
    clearInterval(photoInterval);
    photoInterval = setInterval(() => {
        const holiday = holidays[currentHolidayIndex];
        currentPhotoIndex = (currentPhotoIndex + 1) % holiday.photos.length;
        document.getElementById('holidayPhoto').src = holiday.photos[currentPhotoIndex];
    }, 3000);  
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

function editHoliday(id) {
    const holiday = holidays.find(h => h.id === id);
    if (!holiday) return;

    const form = document.getElementById('editHolidayForm');
    form.innerHTML = `
        <div class="form-group">
            <label for="editTitle">Title</label>
            <input type="text" class="form-control" id="editTitle" name="title" value="${holiday.title}" required>
        </div>
        <div class="form-group">
            <label for="editCountry">Country</label>
            <input type="text" class="form-control" id="editCountry" name="country" value="${holiday.country}" required>
        </div>
        <div class="form-group">
            <label for="editCity">City</label>
            <input type="text" class="form-control" id="editCity" name="city" value="${holiday.city}" required>
        </div>
        <div class="form-group">
            <label for="editDuration">Duration</label>
            <input type="text" class="form-control" id="editDuration" name="duration" value="${holiday.duration}" required>
        </div>
        <div class="form-group">
            <label for="editSeason">Season</label>
            <input type="text" class="form-control" id="editSeason" name="season" value="${holiday.season}" required>
        </div>
        <div class="form-group">
            <label for="editDescription">Description</label>
            <textarea class="form-control" id="editDescription" name="description" rows="3" required>${holiday.description}</textarea>
        </div>
        <div class="form-group">
            <label for="editPrice">Price</label>
            <input type="number" class="form-control" id="editPrice" name="price" step="0.01" value="${holiday.price}" required>
        </div>
        <div class="form-group">
            <label for="editPhotos">Photos</label>
            <textarea class="form-control" id="editPhotos" name="photo" rows="3" required>${holiday.photos.join(', ')}</textarea>
            <label for="editPhotos">Photos</label>
            <textarea class="form-control" id="editPhotos" name="photo2" rows="3" required>${holiday.photos.join(', ')}</textarea>
        </div>
    `;

    // Show the modal
    $('#editHolidayModal').modal('show');

    // Set up save changes button
    document.getElementById('saveEditHoliday').onclick = () => saveEditedHoliday(id);
}
// klada
function saveEditedHoliday(id) {
    console.log(`Attempting to update holiday with id: ${id}`); 
    const formData = {
        photos: []
    };

    for (let field of form.elements) {
        if (field.name) {
            if (field.name === "photo1") {
                formData.photos[0] = field.value;
            } else if (field.name === "photo2") {
                formData.photos[1] = field.value;
            } else {
                formData[field.name] = field.value;
            }
        }
    }

    fetch(`http://localhost:8000/updateHoliday`, {
        method: "POST",
        body: JSON.stringify({"id":id})
    })
    .then(response => {
        if (response.ok) {
            $('#editHolidayModal').modal('hide');
            fetchHolidays();
            showAlert("Holiday was updated!");
        } else {
            console.error("Failed to update holiday");
        }
    })
    .catch(error => {
        console.error("Error updating holiday:", error);
    });
}

function showAlert(status) {
    alertsContainer.innerHTML = `
        <div class="alert alert-success">
            <strong>Success!</strong>${status}
        </div>
    `;
    setTimeout(() => {
        alertsContainer.innerHTML = ''; 
    }, 3000);
}

function deleteHoliday(id) {
    console.log(`Attempting to delete holiday with id: ${id}`);
    fetch(`http://localhost:8000/deleteHoliday`, {
        method: "POST",
        body: JSON.stringify({"id":id})
    })
    .then(response => {
        if (response.ok) {
            fetchHolidays();
            showAlert("Holiday was deleted!");
            console.log(`Successfully deleted holiday with id: ${id}`);
        } else {
            console.error(`Failed to delete holiday with id: ${id}. Status: ${response.status}`);
        }
    })
    .catch(error => {
        console.error("Error deleting holiday:", error);
    });
}

function addRating(id, rating) {
    const holiday = holidays.find(h => h.id === id);
    if (!holiday) return;

    holiday.rating.push(parseInt(rating));

    fetch(`http://localhost:8000/updaterRating?id=${id}`, {
        method: "POST",
        body: JSON.stringify({ rating: holiday.rating })
    })
    .then(response => {
        if (response.ok) {
            fetchHolidays();
        } else {
            console.error("Failed to update rating");
        }
    })
    .catch(error => {
        console.error("Error updating rating:", error);
    });
}

fetchHolidays();
