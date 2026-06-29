// ======================================
// LOZADA ERP Dashboard Loader
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

        document.getElementById(id).innerHTML =
            `<div style="padding:20px;color:red;">
                Failed to load: ${file}
             </div>`;
    }

}

// Load all dashboard components

loadComponent("sidebar", "components/sidebar.html");

loadComponent("navbar", "components/navbar.html");

loadComponent("dashboard-cards", "components/dashboard-cards.html");

loadComponent("dashboard-charts", "components/dashboard-charts.html");

loadComponent("dashboard-orders", "components/dashboard-orders.html");

loadComponent("dashboard-kitchen", "components/dashboard-kitchen.html");

loadComponent("dashboard-inventory", "components/dashboard-inventory.html");

loadComponent("dashboard-summary", "components/dashboard-summary.html");
