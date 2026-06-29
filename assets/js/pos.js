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
// ======================================
// COMPUTE CHANGE
// ======================================

const btnCompute=document.getElementById("btnCompute");

if(btnCompute){

btnCompute.addEventListener("click",()=>{

const total=parseFloat(document.getElementById("totalAmount").value);

const cash=parseFloat(document.getElementById("cashReceived").value)||0;

const change=cash-total;

document.getElementById("changeAmount").value=change.toFixed(2);

});

}
// ======================================
// RECEIPT DATE
// ======================================

const receiptDate=document.getElementById("receiptDate");

if(receiptDate){

receiptDate.innerHTML=new Date().toLocaleString();

}
