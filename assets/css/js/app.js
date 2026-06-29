document.querySelector("form").addEventListener("submit", function(e){

    e.preventDefault();

    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    if(email === "admin" && password === "admin123"){

        window.location.href = "pages/dashboard/dashboard.html";

    }else{

        alert("Invalid Username or Password");

    }

});
