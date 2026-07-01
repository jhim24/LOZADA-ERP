// ===============================================
// LOZADA ERP
// INVENTORY
// ===============================================

// ---------- COMPONENT LOADER ----------

async function loadComponent(id, file){

    try{

        const response = await fetch(file);

        if(!response.ok){

            throw new Error(file);

        }

        const html = await response.text();

        document.getElementById(id).innerHTML = html;

    }catch(err){

        console.error(err);

    }

}

// ---------- INITIALIZE ----------

document.addEventListener("DOMContentLoaded", async()=>{

    await loadComponent("sidebar","../components/sidebar.html");

    await loadComponent("navbar","../components/navbar.html");

    await loadComponent("inventory-header","../components/inventory-header.html");

    await loadComponent("inventory-content","../components/inventory-content.html");

    await loadComponent("inventory-modal","../components/inventory-modal.html");

});
// ===============================================
// OPEN INVENTORY MODAL
// ===============================================

document.addEventListener("click",function(e){

    const btn = e.target.closest("#btnAddStock");

    if(!btn) return;

    generateItemCode();

    const modal = new bootstrap.Modal(

        document.getElementById("inventoryModal")

    );

    modal.show();

});
// ===============================================
// GENERATE ITEM CODE
// ===============================================

function generateItemCode(){

    const items = JSON.parse(

        localStorage.getItem("inventory")

    ) || [];

    const next = items.length + 1;

    document.getElementById("itemCode").value =

    "INV-" + String(next).padStart(6,"0");

}
// ===============================================
// SAVE INVENTORY ITEM
// ===============================================

document.addEventListener("click",function(e){

    const btn = e.target.closest("#btnSaveInventory");

    if(!btn) return;

    saveInventoryItem();

});
// ===============================================
// SAVE ITEM FUNCTION
// ===============================================

function saveInventoryItem(){

    let items = JSON.parse(

        localStorage.getItem("inventory")

    ) || [];

    const item = {

        code: document.getElementById("itemCode").value,

        name: document.getElementById("itemName").value,

        category: document.getElementById("itemCategory").value,

        unit: document.getElementById("itemUnit").value,

        stock: Number(

            document.getElementById("itemStock").value

        ),

        minStock: Number(

            document.getElementById("itemMinStock").value

        ),

        cost: Number(

            document.getElementById("itemCost").value

        ),

        supplier: document.getElementById("itemSupplier").value,

        barcode: document.getElementById("itemBarcode").value,

        remarks: document.getElementById("itemRemarks").value

    };

    items.push(item);

    localStorage.setItem(

        "inventory",

        JSON.stringify(items)

    );

    alert("Inventory Item Saved.");

}
