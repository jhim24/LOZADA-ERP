// ===============================================
// LOZADA ERP
// TABLE MANAGEMENT
// ===============================================

// ===============================================
// FIREBASE
// ===============================================

const firebaseConfig = {
    apiKey: "AIzaSyAV9T5w_1azmPHIJcZpraXP06TItj7HEuA",
    authDomain: "papprito-orders.firebaseapp.com",
    databaseURL: "https://papprito-orders-default-rtdb.firebaseio.com",
    projectId: "papprito-orders",
    storageBucket: "papprito-orders.firebasestorage.app",
    messagingSenderId: "831941801424",
    appId: "1:831941801424:web:40a99cdfb312dac2d275d5"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

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
    await loadComponent("table-form-modal","../components/table-form-modal.html");
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

    if(!template) return;

    db.ref("restaurantTables").once("value").then(snapshot=>{

        grid.innerHTML = "";

        let total = 0;
        let available = 0;
        let occupied = 0;
        let reserved = 0;

        snapshot.forEach(child=>{

            const table = child.val();

            total++;

            if(table.status === "Available") available++;
            if(table.status === "Occupied") occupied++;
            if(table.status === "Reserved") reserved++;

            if(table.floor !== floor) return;

            const clone = template.content.cloneNode(true);

            clone.querySelector(".table-name").innerHTML =
                table.name;

            clone.querySelector(".table-floor").innerHTML =
                table.floor;

            clone.querySelector(".table-capacity").innerHTML =
                table.seats;

            const badge =
                clone.querySelector(".table-status");

            badge.innerHTML = table.status;

            const card =
                clone.querySelector(".table-card");

            card.dataset.key = child.key;

            card.style.cursor = "pointer";

            switch(table.status){

                case "Available":

                    card.classList.add("table-available");

                    badge.className =
                    "badge bg-success table-status";

                    break;

                case "Occupied":

                    card.classList.add("table-occupied");

                    badge.className =
                    "badge bg-danger table-status";

                    break;

                case "Reserved":

                    card.classList.add("table-reserved");

                    badge.className =
                    "badge bg-primary table-status";

                    break;

                case "Bill Requested":

                    card.classList.add("table-bill");

                    badge.className =
                    "badge bg-warning text-dark table-status";

                    break;

            }

            grid.appendChild(clone);

        });

        document.getElementById("totalTables").innerHTML =
            total;

        document.getElementById("availableTables").innerHTML =
            available;

        document.getElementById("occupiedTables").innerHTML =
            occupied;

        document.getElementById("reservedTables").innerHTML =
            reserved;

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

document.addEventListener("click", function(e){

    const card = e.target.closest(".table-card");

    if(!card) return;

    document.querySelectorAll(".table-card").forEach(c=>{

        c.classList.remove("selected");

    });

    card.classList.add("selected");

    const tableKey = card.dataset.key;

    db.ref("restaurantTables/" + tableKey).once("value").then(snapshot=>{

        if(!snapshot.exists()) return;

        const table = snapshot.val();

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

        const btn = document.getElementById("btnOpenTable");

        btn.dataset.key = tableKey;

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

});
// ===============================================
// OPEN TABLE
// ===============================================

document.addEventListener("click", function(e){

    const btn = e.target.closest("#btnOpenTable");

    if(!btn) return;

    const tableKey = btn.dataset.key;

    if(!tableKey){

        alert("Please select a table.");

        return;

    }

    db.ref("restaurantTables/" + tableKey).once("value").then(snapshot=>{

        if(!snapshot.exists()){

            alert("Table not found.");

            return;

        }

        const table = snapshot.val();

        // ===============================================
        // ADD ORDER
        // ===============================================

        if(table.status === "Occupied"){

            localStorage.setItem("selectedTable", JSON.stringify({

                key: tableKey,
                floor: table.floor,
                table: table.name,
                customer: table.customer || "",
                guests: table.guests || 1,
                server: table.server || ""

            }));

            bootstrap.Modal.getInstance(
                document.getElementById("tableDetailsModal")
            ).hide();

            window.location.href = "pos.html";

            return;

        }

        // ===============================================
        // RECEIVE PAYMENT
        // ===============================================

        if(table.status === "Bill Requested"){

            localStorage.setItem("paymentMode","true");

            localStorage.setItem("selectedTable", JSON.stringify({

                key: tableKey,
                floor: table.floor,
                table: table.name,
                customer: table.customer || "",
                guests: table.guests || 1,
                server: table.server || ""

            }));

            db.ref("orders").once("value").then(orderSnapshot=>{

                orderSnapshot.forEach(child=>{

                    const order = child.val();

                    if(
                        order.floor === table.floor &&
                        order.table === table.name &&
                        order.status !== "Paid"
                    ){

                        localStorage.setItem(
                            "customerOrder",
                            JSON.stringify({

                                name: order.customerName,
                                orderType: order.orderType,
                                phone: order.customerPhone,
                                email: order.customerEmail,
                                address: order.deliveryAddress,
                                partner: order.deliveryPartner,
                                fee: order.deliveryFee,
                                notes: order.customerNotes,
                                requestedTime: order.requestedTime,
                                orderSource: order.orderSource

                            })
                        );

                    }

                });

            }).then(()=>{

                bootstrap.Modal.getInstance(
                    document.getElementById("tableDetailsModal")
                ).hide();

                window.location.href = "pos.html";

            });

            return;

        }

        // ===============================================
        // OPEN NEW TABLE
        // ===============================================

        localStorage.setItem("selectedTable", JSON.stringify({

            key: tableKey,
            floor: table.floor,
            table: table.name

        }));

        bootstrap.Modal.getInstance(
            document.getElementById("tableDetailsModal")
        ).hide();

        const startModal = new bootstrap.Modal(
            document.getElementById("startOrderModal")
        );

        startModal.show();

    });

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

        table.name===tableName &&

        table.floor===floor

    );

    if(index<0) return;

    // Change table status

    tables[index].status = "Bill Requested";

    localStorage.setItem(

        "restaurantTables",

        JSON.stringify(tables)

    );

    // Update Firebase order

    db.ref("orders").once("value").then(snapshot=>{

        const updates = [];

        snapshot.forEach(child=>{

            const order = child.val();

            if(

                order.floor===floor &&

                order.table===tableName &&

                order.status==="Pending"

            ){

                updates.push(

                    db.ref("orders/"+child.key).update({

                        status:"Bill Requested"

                    })

                );

            }

        });

        return Promise.all(updates);

    }).then(()=>{

        bootstrap.Modal.getInstance(

            document.getElementById("tableDetailsModal")

        ).hide();

        loadTables(floor);

        alert("Bill request sent successfully.");

    }).catch(error=>{

        console.error(error);

        alert("Unable to update bill request.");

    });

});
// ===============================================
// OPEN ADD TABLE MODAL
// ===============================================

document.addEventListener("click", function(e){

    const btn = e.target.closest("#btnAddTable");

    if(!btn) return;

    document.getElementById("tableFormTitle").innerHTML =
    "Add Table";

    document.getElementById("tableFloor").value =
    "Rooftop";

    document.getElementById("tableName").value = "";

    document.getElementById("tableSeats").value = 4;

    const modal = new bootstrap.Modal(

        document.getElementById("tableFormModal")

    );

    modal.show();

});
// ===============================================
// SAVE TABLE
// ===============================================

document.addEventListener("click", function(e){

    const btn = e.target.closest("#btnSaveTable");

    if(!btn) return;

    const floor = document.getElementById("tableFloor").value;

    const name = document.getElementById("tableName").value.trim();

    const seats = Number(document.getElementById("tableSeats").value);

    if(name === ""){

        alert("Please enter table name.");

        return;

    }

    let tables = JSON.parse(

        localStorage.getItem("restaurantTables")

    ) || [];

    const exists = tables.some(table=>

        table.floor === floor &&

        table.name.toLowerCase() === name.toLowerCase()

    );

    if(exists){

        alert("Table already exists.");

        return;

    }

    tables.push({

        floor: floor,

        name: name,

        seats: seats,

        status: "Available",

        customer: "",

        guests: "",

        server: "",

        orderNo: ""

    });

    localStorage.setItem(

        "restaurantTables",

        JSON.stringify(tables)

    );

    bootstrap.Modal.getInstance(

        document.getElementById("tableFormModal")

    ).hide();

    loadTables(floor);

    alert("Table added successfully.");

});
// ===============================================
// LIVE DASHBOARD CARDS
// ===============================================

function updateDashboardCards(){

    const tables = JSON.parse(
        localStorage.getItem("restaurantTables")
    ) || [];

    const total = tables.length;

    const available = tables.filter(t =>
        t.status === "Available"
    ).length;

    const occupied = tables.filter(t =>
        t.status === "Occupied"
    ).length;

    const reserved = tables.filter(t =>
        t.status === "Reserved"
    ).length;

    const totalTables =
        document.getElementById("totalTables");

    if(totalTables){
        totalTables.innerHTML = total;
    }

    const availableTables =
        document.getElementById("availableTables");

    if(availableTables){
        availableTables.innerHTML = available;
    }

    const occupiedTables =
        document.getElementById("occupiedTables");

    if(occupiedTables){
        occupiedTables.innerHTML = occupied;
    }

    const reservedTables =
        document.getElementById("reservedTables");

    if(reservedTables){
        reservedTables.innerHTML = reserved;
    }

}
