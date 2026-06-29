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
// ADD TO CART (Temporary)

document.querySelectorAll(".add-cart").forEach(button=>{

button.addEventListener("click",()=>{

alert("Product added to cart.");

});

});
// CART BUTTONS (Demo)

document.querySelectorAll(".qty-box button").forEach(btn=>{

btn.addEventListener("click",()=>{

console.log("Quantity changed");

});

});
