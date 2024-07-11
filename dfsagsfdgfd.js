function createUser(event) {
    event.preventDefault();
    const form = event.target;
    const formData = {};
    for (let field of form.elements) {
        if (field.name) {
            formData[field.name] = field.value;
        }
    }
    fetch(`${baseUrl}${port}/createUser`, {
        method: "POST",
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (response.ok) {
                showAlert("sukurtas");
                form.reset();
                getUsers();
            }
        })
}
function updateUser(event) {
    event.preventDefault();
    const form = event.target;
    const formData = {};
    for (let field of form.elements) {
        if (field.name) {
            formData[field.name] = field.value;
        }
    }
    fetch(`${baseUrl}${port}/updateUser`, {
        method: "POST",
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (response.ok) {
                showAlert("atnaujintas");
                form.reset();
                getUsers();
                toggleForm(false);
            }
        })
}
function addEventListenersOnUpdate() {
    let updateBnts = document.querySelectorAll(".update");
    updateBnts.forEach(btn => {
        btn.addEventListener("click", function (event) {
            event.preventDefault();
            editUser(btn.getAttribute("userId"));
            window.scrollTo(0, 0);
        })
    });
}
