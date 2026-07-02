// ===============================================
// LOZADA ERP
// TABLE MANAGEMENT
// ===============================================

// ---------- COMPONENT LOADER ----------

async function loadComponent(id,file){

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

document.addEventListener("DOMContentLoaded",async()=>{

    await loadComponent("sidebar","../components/sidebar.html");

    await loadComponent("navbar","../components/navbar.html");

    await loadComponent("tables-header","../components/tables-header.html");

    await loadComponent("tables-content","../components/tables-content.html");

    await loadComponent("tables-card","../components/tables-card.html");
    await loadComponent("table-details-modal","../components/table-details-modal.html");
    await loadComponent("start-order-modal","../components/start-order-modal.html");
initializeTables();

loadTables("Rooftop");
});
// ===============================================
// INITIALIZE TABLES
// ===============================================

function initializeTables(){

    let tables = JSON.parse(

        localStorage.getItem("restaurantTables")

    );

    if(tables) return;

    tables = [];

    // Rooftop

    for(let i=1;i<=20;i++){

        tables.push({

            floor:"Rooftop",

            name:"Table "+i,

            seats:4,

            status:"Available"

        });

    }

    // Main Dining

    for(let i=1;i<=15;i++){

        tables.push({

            floor:"Main Dining",

            name:"Table "+i,

            seats:4,

            status:"Available"

        });

    }

    // Basement

    for(let i=1;i<=20;i++){

        tables.push({

            floor:"Basement",

            name:"Table "+i,

            seats:4,

            status:"Available"

        });

    }

    // VIP

    for(let i=1;i<=4;i++){

        tables.push({

            floor:"VIP Room",

            name:"VIP "+i,

            seats:8,

            status:"Available"

        });

    }

    localStorage.setItem(

        "restaurantTables",

        JSON.stringify(tables)

    );

}
// ===============================================
// LOAD TABLES
// ===============================================

function loadTables(floor){

    const grid = document.getElementById("tablesGrid");

    if(!grid) return;

    const template = document.getElementById("tableCardTemplate");

    const tables = JSON.parse(

        localStorage.getItem("restaurantTables")

    ) || [];

    grid.innerHTML = "";

    tables
    .filter(table => table.floor === floor)
    .forEach((table,index)=>{

        const clone = template.content.cloneNode(true);

        clone.querySelector(".table-name").innerHTML =
            table.name;

        clone.querySelector(".table-floor").innerHTML =
            table.floor;

        clone.querySelector(".table-capacity").innerHTML =
            table.seats;

        clone.querySelector(".table-status").innerHTML =
            table.status;
const card = clone.querySelector(".table-card");

const badge = clone.querySelector(".table-status");
switch(table.status){

    case "Available":

        card.classList.add("table-available");

        badge.className = "badge bg-success table-status";

        break;

    case "Occupied":

        card.classList.add("table-occupied");

        badge.className = "badge bg-danger table-status";

        break;

    case "Reserved":

        card.classList.add("table-reserved");

        badge.className = "badge bg-warning text-dark table-status";

        break;

    case "Cleaning":

        card.classList.add("table-cleaning");

        badge.className = "badge bg-secondary table-status";

        break;

        case "Bill Requested":

    card.classList.add("table-bill");

    badge.className = "badge bg-warning text-dark table-status";

    badge.innerHTML = "Bill Requested";

    break;

}
      card.dataset.index = index;

card.style.cursor = "pointer";

grid.appendChild(clone);
    });

}
// ===============================================
// FLOOR TAB CLICK
// ===============================================

document.addEventListener("click", function(e){

    const btn = e.target.closest(".floor-tab");

    if(!btn) return;

    // Remove active class from all tabs
    document.querySelectorAll(".floor-tab").forEach(tab=>{

        tab.classList.remove("active");

    });

    // Set active tab
    btn.classList.add("active");

    // Load selected floor
    loadTables(btn.dataset.floor);

});
// ===============================================
// OPEN TABLE DETAILS
// ===============================================

document.addEventListener("click",function(e){

    const card = e.target.closest(".table-card");

    if(!card) return;

    const index = Number(card.dataset.index);

    const floor = document.querySelector(".floor-tab.active").dataset.floor;

    const tables = JSON.parse(

        localStorage.getItem("restaurantTables")

    ) || [];

    const table = tables.filter(t=>t.floor===floor)[index];

    document.getElementById("modalTableName").innerHTML =
        table.name;

    document.getElementById("modalFloor").innerHTML =
        table.floor;

    document.getElementById("modalSeats").innerHTML =
        table.seats;

    document.getElementById("modalStatus").innerHTML =
        table.status;

    document.getElementById("modalCustomer").innerHTML =
        table.customer || "Walk-in";

    document.getElementById("modalOrder").innerHTML =
        table.orderNo || "-";
    // ===============================================
// CHANGE PRIMARY BUTTON
// ===============================================

const btn = document.getElementById("btnOpenTable");

if(table.status === "Available"){

    btn.innerHTML = "Open Table";

    btn.className = "btn btn-success";

}

else if(table.status === "Occupied"){

    btn.innerHTML = "Add Order";

    btn.className = "btn btn-primary";

}

else if(table.status === "Bill Requested"){

    btn.innerHTML = "Receive Payment";

    btn.className = "btn btn-warning";

}

else if(table.status === "Paid"){

    btn.innerHTML = "Close Table";

    btn.className = "btn btn-secondary";

}

    const modal = new bootstrap.Modal(

        document.getElementById("tableDetailsModal")

    );

    modal.show();

});
// ===============================================
// OPEN TABLE
// ===============================================

document.addEventListener("click",function(e){

    const btn = e.target.closest("#btnOpenTable");

    if(!btn) return;

    const tableName = document.getElementById("modalTableName").innerHTML;

    const floor = document.getElementById("modalFloor").innerHTML;
    
    const currentStatus =
    document.getElementById("modalStatus").innerHTML;

    let tables = JSON.parse(

        localStorage.getItem("restaurantTables")

    ) || [];

    const index = tables.findIndex(table=>

        table.name===tableName &&

        table.floor===floor

    );

    if(index<0) return;

    // ===============================================
// SMART BUTTON ACTION
// ===============================================

if(currentStatus === "Occupied"){

    bootstrap.Modal.getInstance(

        document.getElementById("tableDetailsModal")

    ).hide();

    window.location.href = "pos.html";

    return;

}

if(currentStatus === "Bill Requested"){

    localStorage.setItem(

        "paymentMode",

        "true"

    );
    
// SAVE TABLE FOR PAYMENT

localStorage.setItem(

    "paymentTable",

    JSON.stringify({

        floor: floor,

        table: tableName

    })

);

const tableInfo = tables[index];

localStorage.setItem(
    "selectedTable",
    JSON.stringify({
        floor: tableInfo.floor,
        table: tableInfo.name,
        customer: tableInfo.customer,
        guests: tableInfo.guests,
        server: tableInfo.server
    })
);
    bootstrap.Modal.getInstance(

        document.getElementById("tableDetailsModal")

    ).hide();

    window.location.href = "pos.html";

    return;

}

    tables[index].status = "Occupied";

    localStorage.setItem(

        "restaurantTables",

        JSON.stringify(tables)

    );

    localStorage.setItem(

        "selectedTable",

        JSON.stringify({

            floor:floor,

            table:tableName

        })

    );

  bootstrap.Modal.getInstance(

    document.getElementById("tableDetailsModal")

).hide();

const startModal = new bootstrap.Modal(

    document.getElementById("startOrderModal")

);

startModal.show();

});
// ===============================================
// START ORDER
// ===============================================

document.addEventListener("click", function(e){

    const btn = e.target.closest("#btnStartOrder");

    if(!btn) return;

    const customer = document.getElementById("customerName").value || "Walk-in";

    const guests = document.getElementById("numberGuests").value;

    const server = document.getElementById("serverName").value;

    const notes = document.getElementById("tableNotes").value;

    let selectedTable = JSON.parse(

        localStorage.getItem("selectedTable")

    ) || {};

    selectedTable.customer = customer;

    selectedTable.guests = guests;

    selectedTable.server = server;

    selectedTable.notes = notes;

    localStorage.setItem(

        "selectedTable",

        JSON.stringify(selectedTable)

    );

    bootstrap.Modal.getInstance(

        document.getElementById("startOrderModal")

    ).hide();

    window.location.href = "pos.html";

});
// ===============================================
// BILL OUT
// ===============================================

document.addEventListener("click", function(e){

    const btn = e.target.closest("#btnBillOut");

    if(!btn) return;

    const tableName = document.getElementById("modalTableName").innerHTML;

    const floor = document.getElementById("modalFloor").innerHTML;

    let tables = JSON.parse(
        localStorage.getItem("restaurantTables")
    ) || [];

    const index = tables.findIndex(table=>

        table.name === tableName &&
        table.floor === floor

    );

    if(index < 0) return;

    tables[index].status = "Bill Requested";
    
// UPDATE LATEST ORDER STATUS

let orders = JSON.parse(
    localStorage.getItem("orders")
) || [];

const orderIndex = orders
    .map(order =>
        order.floor === floor &&
        order.table === tableName
    )
    .lastIndexOf(true);

if(orderIndex >= 0){

    orders[orderIndex].status = "Bill Requested";

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

}
    localStorage.setItem(
        "restaurantTables",
        JSON.stringify(tables)
    );

    bootstrap.Modal.getInstance(
        document.getElementById("tableDetailsModal")
    ).hide();

    loadTables(floor);

});
