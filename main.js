
let form = document.querySelector("#holidayForm");
let baseUrl = "http://127.0.0.1";
let port = ":8000";

form.addEventListener("submit", createHoliday);


function createHoliday(event) {
    event.preventDefault();
    const form = event.target;
    const formData = {};

    for (let field of form.elements) {
        if (field.name) {
            formData[field.name] = field.value;
        }
    }

    // Ensure that the rating is set to 0
    formData.rating = [0];

    fetch(`${baseUrl}${port}/createHoliday`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            showAlert("Holiday was created");
            form.reset();
        }
    })
    .catch(error => {
        console.error("Error creating holiday:", error);
        showAlert("Failed to create holiday");
    });
}

function showAlert(status) {
    alertsContainer.innerHTML = `
        <div class="alert alert-success">
            <strong>Success!</strong> Holiday was created! ${status}.
        </div>
    `;
    setTimeout(() => {
        alertsContainer.innerHTML = ''; 
    }, 3000);
}
