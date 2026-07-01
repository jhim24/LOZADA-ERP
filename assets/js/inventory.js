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

    loadInventory();

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

  // ===============================================
// ADD OR UPDATE
// ===============================================

if(editInventoryIndex >= 0){

    items[editInventoryIndex] = item;

    editInventoryIndex = -1;

}else{

    items.push(item);

}

localStorage.setItem(

    "inventory",

    JSON.stringify(items)

);

    alert("Inventory Item Saved.");
loadInventory();

bootstrap.Modal.getInstance(

document.getElementById("inventoryModal")

).hide();
    
}
// ===============================================
// LOAD INVENTORY
// ===============================================

function loadInventory(){

    const tbody = document.getElementById("inventoryTableBody");

    if(!tbody) return;

    const items = JSON.parse(

        localStorage.getItem("inventory")

    ) || [];

    tbody.innerHTML = "";

    if(items.length===0){

        tbody.innerHTML = `

        <tr>

            <td colspan="10" class="text-center text-muted">

                No Inventory Items

            </td>

        </tr>

        `;

        return;

    }

    items.forEach((item,index)=>{

        tbody.innerHTML += `

        <tr>

            <td>${item.code}</td>

            <td>${item.name}</td>

            <td>${item.category}</td>

            <td>${item.unit}</td>

            <td class="text-center">${item.stock}</td>

            <td class="text-center">${item.minStock}</td>

            <td class="text-end">

                ₱${item.cost.toFixed(2)}

            </td>

            <td>${item.supplier}</td>

            <td class="text-center">

                In Stock

            </td>

           <td class="text-center">

    <button
    class="btn btn-primary btn-sm btn-edit-item"
    data-index="${index}">

        <i class="fa-solid fa-pen"></i>

    </button>

    <button
    class="btn btn-danger btn-sm btn-delete-item"
    data-index="${index}">

        <i class="fa-solid fa-trash"></i>

    </button>

</td>
        </tr>

        `;

    });
updateInventorySummary(items);
}
// ===============================================
// INVENTORY SUMMARY
// ===============================================

function updateInventorySummary(items){

    let totalItems = items.length;

    let inStock = 0;

    let lowStock = 0;

    let outStock = 0;

    items.forEach(item=>{

        if(item.stock <= 0){

            outStock++;

        }
        else if(item.stock <= item.minStock){

            lowStock++;

        }
        else{

            inStock++;

        }

    });

    document.getElementById("totalItems").innerHTML = totalItems;

    document.getElementById("stockAvailable").innerHTML = inStock;

    document.getElementById("lowStock").innerHTML = lowStock;

    document.getElementById("outStock").innerHTML = outStock;

}
// ===============================================
// EDIT INVENTORY ITEM
// ===============================================

let editInventoryIndex = -1;

document.addEventListener("click", function(e){

    const btn = e.target.closest(".btn-edit-item");

    if(!btn) return;

    const index = Number(btn.dataset.index);

    const items = JSON.parse(localStorage.getItem("inventory")) || [];

    const item = items[index];

    editInventoryIndex = index;

    document.getElementById("itemCode").value = item.code;
    document.getElementById("itemName").value = item.name;
    document.getElementById("itemCategory").value = item.category;
    document.getElementById("itemUnit").value = item.unit;
    document.getElementById("itemStock").value = item.stock;
    document.getElementById("itemMinStock").value = item.minStock;
    document.getElementById("itemCost").value = item.cost;
    document.getElementById("itemSupplier").value = item.supplier;
    document.getElementById("itemBarcode").value = item.barcode;
    document.getElementById("itemRemarks").value = item.remarks;

    const modal = new bootstrap.Modal(

        document.getElementById("inventoryModal")

    );

    modal.show();

});
// ===============================================
// DELETE INVENTORY ITEM
// ===============================================

document.addEventListener("click", function(e){

    const btn = e.target.closest(".btn-delete-item");

    if(!btn) return;

    const index = Number(btn.dataset.index);

    if(!confirm("Are you sure you want to delete this item?")){

        return;

    }

    let items = JSON.parse(

        localStorage.getItem("inventory")

    ) || [];

    items.splice(index,1);

    localStorage.setItem(

        "inventory",

        JSON.stringify(items)

    );

    loadInventory();

});
// ===============================================
// SEARCH INVENTORY
// ===============================================

document.addEventListener("input", function(e){

    if(e.target.id !== "searchInventory") return;

    const keyword = e.target.value.toLowerCase();

    document.querySelectorAll("#inventoryTableBody tr").forEach(row=>{

        const text = row.innerText.toLowerCase();

        row.style.display = text.includes(keyword)

            ? ""

            : "none";

    });

});
// ===============================================
// CATEGORY FILTER
// ===============================================

document.addEventListener("change", function(e){

    if(e.target.id !== "filterCategory") return;

    const category = e.target.value;

    document.querySelectorAll("#inventoryTableBody tr").forEach(row=>{

        if(category === "All"){

            row.style.display = "";

            return;

        }

        const rowCategory = row.cells[2].innerText;

        row.style.display = rowCategory === category

            ? ""

            : "none";

    });

});
