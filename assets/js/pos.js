// =====================================
// LOZADA ERP POS
// Version 2
// =====================================

// -----------------------------
// COMPONENT LOADER
// -----------------------------

async function loadComponent(id, file) {

    try {

        const response = await fetch(file);

        if (!response.ok) throw new Error(file);

        const html = await response.text();

        document.getElementById(id).innerHTML = html;

    } catch (err) {

        console.error(err);

    }

}

// -----------------------------
// LOAD COMPONENTS
// -----------------------------

window.addEventListener("DOMContentLoaded", () => {

    loadComponent("sidebar","../components/sidebar.html");
    loadComponent("navbar","../components/navbar.html");
    loadComponent("pos-header","../components/pos-header.html");
    loadComponent("pos-categories","../components/pos-categories.html");
    loadComponent("pos-products","../components/pos-products.html");
    loadComponent("pos-cart","../components/pos-cart.html");
    loadComponent("pos-payment","../components/pos-payment.html");
    loadComponent("receipt-modal","../components/receipt-modal.html");

});

// =====================================
// LIVE CLOCK
// =====================================

function updateClock(){

    const now=new Date();

    const date=document.getElementById("currentDate");

    const time=document.getElementById("currentTime");

    if(date){

        date.innerHTML=now.toLocaleDateString();

    }

    if(time){

        time.innerHTML=now.toLocaleTimeString();

    }

}

setInterval(updateClock,1000);

// =====================================
// CATEGORY ACTIVE
// =====================================

document.addEventListener("click",(e)=>{

    const button=e.target.closest(".category-btn");

    if(!button) return;

    document.querySelectorAll(".category-btn").forEach(btn=>{

        btn.classList.remove("active");

    });

    button.classList.add("active");

});

// =====================================
// SEARCH
// =====================================

document.addEventListener("input",(e)=>{

    if(e.target.id!=="searchProduct") return;

    const keyword=e.target.value.toLowerCase();

    document.querySelectorAll(".product-card").forEach(card=>{

        const name=card.querySelector("h5").innerText.toLowerCase();

        if(name.includes(keyword)){

            card.style.display="block";

        }else{

            card.style.display="none";

        }

    });

});

// =====================================
// TEMP ADD TO CART
// =====================================

document.addEventListener("click",(e)=>{

    const btn=e.target.closest(".add-cart");

    if(!btn) return;

    const card=btn.closest(".product-card");

    const product=card.querySelector("h5").innerText;

    const price=card.querySelector(".price").innerText;

    alert(product+" added to cart.\nPrice: "+price);

});

// =====================================
// COMPUTE CHANGE
// =====================================

document.addEventListener("click",(e)=>{

    if(e.target.id!=="btnCompute") return;

    const total=parseFloat(document.getElementById("totalAmount").value)||0;

    const cash=parseFloat(document.getElementById("cashReceived").value)||0;

    const change=cash-total;

    document.getElementById("changeAmount").value=change.toFixed(2);

});

// =====================================
// RECEIPT DATE
// =====================================

window.addEventListener("load",()=>{

    setTimeout(()=>{

        const receipt=document.getElementById("receiptDate");

        if(receipt){

            receipt.innerHTML=new Date().toLocaleString();

        }

    },500);

});
