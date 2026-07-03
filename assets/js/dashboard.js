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
// ======================================
// INITIALIZE DASHBOARD
// ======================================

function initDashboard(){

   loadDashboardCards();

loadSalesChart();
}
// ======================================
// LIVE DASHBOARD CARDS
// ======================================

function loadDashboardCards(){

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const tables = JSON.parse(localStorage.getItem("restaurantTables")) || [];

    const products = JSON.parse(localStorage.getItem("products")) || [];

    let totalSales = 0;

    let totalOrders = 0;

    let totalCustomers = 0;

    let totalProfit = 0;

    let availableTables = 0;

    let occupiedTables = 0;

    let lowStock = 0;

    const today = new Date().toDateString();
        orders.forEach(order=>{

        if(order.status !== "Paid") return;

        const orderDate = new Date(order.date).toDateString();

        if(orderDate !== today) return;

        totalSales += Number(order.total || 0);

        totalOrders++;

        totalCustomers++;

    });
        tables.forEach(table=>{

        if(table.status==="Available"){

            availableTables++;

        }

        if(table.status==="Occupied"){

            occupiedTables++;

        }

    });

    products.forEach(product=>{

        if(Number(product.stock)<=Number(product.reorderLevel||10)){

            lowStock++;

        }

    });

    const averageSale =

        totalOrders===0

        ? 0

        : totalSales/totalOrders;
    // ======================================
    // UPDATE DASHBOARD CARDS
    // ======================================

    const setValue = (id, value) => {

        const element = document.getElementById(id);

        if(element){

            element.innerHTML = value;

        }

    };

    setValue(
        "dashboardSales",
        "₱" + totalSales.toLocaleString(undefined,{
            minimumFractionDigits:2
        })
    );

    setValue(
        "dashboardOrders",
        totalOrders
    );

    setValue(
        "dashboardCustomers",
        totalCustomers
    );

    setValue(
        "dashboardAverageSale",
        "₱" + averageSale.toLocaleString(undefined,{
            minimumFractionDigits:2
        })
    );

    setValue(
        "dashboardProfit",
        "₱" + totalProfit.toLocaleString(undefined,{
            minimumFractionDigits:2
        })
    );

    setValue(
        "dashboardLowStock",
        lowStock
    );

    setValue(
        "dashboardAvailableTables",
        availableTables
    );

    setValue(
        "dashboardOccupiedTables",
        occupiedTables
    );

}
// ======================================
// LOAD SALES CHART
// ======================================

function loadSalesChart(){

    const canvas = document.getElementById("salesChart");

    if(!canvas) return;

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const sales = {};

    orders.forEach(order=>{

        if(order.status !== "Paid") return;

        const date = new Date(order.date).toLocaleDateString();

        if(!sales[date]){

            sales[date] = 0;

        }

        sales[date] += Number(order.total || 0);

    });

    const labels = Object.keys(sales);

    const values = Object.values(sales);

    if(window.salesChart){

        window.salesChart.destroy();

    }

    window.salesChart = new Chart(canvas,{

        type:"line",

        data:{

            labels:labels,

            datasets:[{

                label:"Daily Sales",

                data:values,

                fill:true,

                tension:.35,

                borderWidth:3

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false

        }

    });

}
