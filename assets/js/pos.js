// ======================================
// LOZADA ERP POS
// Component Loader
// ======================================

async function loadComponent(id, file) {

    try {

        const response = await fetch(file);

        if (!response.ok) {
            throw new Error("Cannot load " + file);
        }

        const html = await response.text();

        document.getElementById(id).innerHTML = html;

    } catch (error) {

        console.error(error);

        const element = document.getElementById(id);

        if (element) {
            element.innerHTML = `
                <div class="alert alert-danger m-3">
                    Failed to load ${file}
                </div>
            `;
        }

    }

}

// ======================================
// LOAD COMPONENTS
// ======================================

window.addEventListener("DOMContentLoaded", () => {

    loadComponent("sidebar", "../components/sidebar.html");

    loadComponent("navbar", "../components/navbar.html");

    loadComponent("pos-header", "../components/pos-header.html");

    loadComponent("pos-categories", "../components/pos-categories.html");

    loadComponent("pos-products", "../components/pos-products.html");

    loadComponent("pos-cart", "../components/pos-cart.html");

    loadComponent("pos-payment", "../components/pos-payment.html");

    loadComponent("receipt-modal", "../components/receipt-modal.html");

});

// ======================================
// LIVE DATE & TIME
// ======================================

function updateClock() {

    const now = new Date();

    const date = document.getElementById("currentDate");
    const time = document.getElementById("currentTime");

    if (date) {
        date.innerHTML = now.toLocaleDateString();
    }

    if (time) {
        time.innerHTML = now.toLocaleTimeString();
    }

}

setInterval(updateClock, 1000);

// ======================================
// COMPUTE CHANGE
// ======================================

document.addEventListener("click", function(e){

    if(e.target.id==="btnCompute"){

        const total=parseFloat(document.getElementById("totalAmount").value)||0;

        const cash=parseFloat(document.getElementById("cashReceived").value)||0;

        const change=cash-total;

        document.getElementById("changeAmount").value=change.toFixed(2);

    }

});

// ======================================
// CATEGORY ACTIVE
// ======================================

document.addEventListener("click", function(e){

    if(e.target.closest(".category-btn")){

        document.querySelectorAll(".category-btn").forEach(btn=>{

            btn.classList.remove("active");

        });

        e.target.closest(".category-btn").classList.add("active");

    }

});

// ======================================
// ADD TO CART (TEMPORARY)
// ======================================

document.addEventListener("click", function(e){

    if(e.target.closest(".add-cart")){

        alert("Product added to cart.");

    }

});
