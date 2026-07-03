// ======================================
// LOZADA ERP
// DASHBOARD
// Version 2.0
// ======================================

// ======================================
// LOAD HTML COMPONENT
// ======================================

async function loadComponent(id, file){

    try{

        const response = await fetch(file);

        if(!response.ok){

            throw new Error("Cannot load " + file);

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

// ======================================
// INITIALIZE DASHBOARD
// ======================================

document.addEventListener("DOMContentLoaded", async function(){

    await loadComponent("sidebar","../components/sidebar.html");

    await loadComponent("navbar","../components/navbar.html");

    await loadComponent("dashboard-cards","../components/dashboard-cards.html");

    await loadComponent("dashboard-charts","../components/dashboard-charts.html");

    await loadComponent("dashboard-orders","../components/dashboard-orders.html");

    await loadComponent("dashboard-kitchen","../components/dashboard-kitchen.html");

    await loadComponent("dashboard-inventory","../components/dashboard-inventory.html");

    await loadComponent("dashboard-summary","../components/dashboard-summary.html");

    initDashboard();

});
