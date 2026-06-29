const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "admin" && password === "admin123") {

        alert("Login Successful!");

        window.location.href = "pages/dashboard/dashboard.html";

    } else {

        alert("Invalid Username or Password!");

    }

});
