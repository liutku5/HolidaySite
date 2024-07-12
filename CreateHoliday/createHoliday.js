
let form = document.querySelector("#holidayForm");
let baseUrl = "http://127.0.0.1";
let port = ":8000";

form.addEventListener("submit", createHoliday);


function createHoliday(event) {
    event.preventDefault();
    const form = event.target;
    const formData = {
        photos : []
    };

    for (let field of form.elements) {
        if (field.name) {
            if(field.name == "photo1"){
                formData["photos"][0] = field.value;
            }
            else if(field.name == "photo2"){
                formData["photos"][1] = field.value;
            }
            else{
                formData[field.name] = field.value;
            }
        }
    }

    // Ensure that the rating is set to 0
    formData.rating = [0];

    fetch(`${baseUrl}${port}/createHoliday`, {
        method: "POST",
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            showAlert("Holiday was created");
            form.reset();
        }
    })
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