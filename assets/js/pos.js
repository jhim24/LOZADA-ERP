// LIVE CLOCK

function updateClock(){

const now=new Date();

document.getElementById("currentDate").innerHTML=
now.toLocaleDateString();

document.getElementById("currentTime").innerHTML=
now.toLocaleTimeString();

}

setInterval(updateClock,1000);

updateClock();
// CATEGORY BUTTONS

const categoryButtons=document.querySelectorAll(".category-btn");

categoryButtons.forEach(button=>{

button.addEventListener("click",()=>{

categoryButtons.forEach(btn=>btn.classList.remove("active"));

button.classList.add("active");

});

});
