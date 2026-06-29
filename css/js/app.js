document.addEventListener("DOMContentLoaded",()=>{

const form=document.getElementById("loginForm");

form.addEventListener("submit",(e)=>{

e.preventDefault();

const username=document.getElementById("username").value.trim();

const password=document.getElementById("password").value.trim();

if(username==="admin" && password==="admin123"){

window.location.href="dashboard.html";

}else{

alert("Invalid Username or Password");

}

});

});
