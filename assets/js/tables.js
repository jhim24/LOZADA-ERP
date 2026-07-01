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
