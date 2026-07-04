// ===============================================
// LOZADA ERP
// PURCHASE MODULE
// ===============================================

// ---------- COMPONENT LOADER ----------

async function loadComponent(id, file){

    try{

        const response = await fetch(file);

        if(!response.ok){

            throw new Error(file);

        }

        const html = await response.text();

        const element = document.getElementById(id);

        if(element){

            element.innerHTML = html;

        }

    }catch(error){

        console.error(error);

    }

}

// ---------- INITIALIZE ----------

document.addEventListener("DOMContentLoaded", async ()=>{

    await loadComponent(
        "sidebar",
        "../components/sidebar.html"
    );

    await loadComponent(
        "navbar",
        "../components/navbar.html"
    );

    initializePurchase();

});

// ===============================================
// INITIALIZE PURCHASE
// ===============================================

function initializePurchase(){

    generatePurchaseNumber();

    setToday();

    loadDashboard();

    loadSuppliers();

}
// ===============================================
// GENERATE PURCHASE NUMBER
// ===============================================

function generatePurchaseNumber(){

    const input = document.getElementById("purchaseNo");

    if(!input) return;

    const purchases = JSON.parse(
        localStorage.getItem("purchases")
    ) || [];

    const nextNumber = purchases.length + 1;

    input.value =
        "PO-" + String(nextNumber).padStart(6,"0");

}

// ===============================================
// SET TODAY DATE
// ===============================================

function setToday(){

    const input = document.getElementById("purchaseDate");

    if(!input) return;

    input.value = new Date().toISOString().split("T")[0];

}

// ===============================================
// LOAD DASHBOARD
// ===============================================

function loadDashboard(){

    const purchases = JSON.parse(
        localStorage.getItem("purchases")
    ) || [];

    let total = 0;

    let pending = 0;

    let received = 0;

    purchases.forEach(po=>{

        total += Number(po.grandTotal || 0);

        if(po.status === "Pending"){

            pending++;

        }

        if(po.status === "Received"){

            received++;

        }

    });

    document.getElementById("totalPurchaseAmount").innerHTML =
        "₱" + total.toFixed(2);

    document.getElementById("pendingPurchase").innerHTML =
        pending;

    document.getElementById("receivedPurchase").innerHTML =
        received;

    const suppliers = JSON.parse(
        localStorage.getItem("suppliers")
    ) || [];

    document.getElementById("supplierCount").innerHTML =
        suppliers.length;

}
// ===============================================
// LOAD SUPPLIERS
// ===============================================

function loadSuppliers(){

    const select = document.getElementById("supplierName");

    if(!select) return;

    const suppliers = JSON.parse(
        localStorage.getItem("suppliers")
    ) || [];

    select.innerHTML = `
        <option value="">
            Select Supplier
        </option>
    `;

    suppliers.forEach(supplier=>{

        select.innerHTML += `
            <option value="${supplier.name}">
                ${supplier.name}
            </option>
        `;

    });

}
