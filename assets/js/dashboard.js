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

        const element = document.getElementById(id);

        if (element) {

            element.innerHTML = `
                <div style="padding:20px;color:red;">
                    Failed to load: ${file}
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

    loadComponent("dashboard-cards", "../components/dashboard-cards.html");

    loadComponent("dashboard-charts", "../components/dashboard-charts.html");

    loadComponent("dashboard-orders", "../components/dashboard-orders.html");

    loadComponent("dashboard-kitchen", "../components/dashboard-kitchen.html");

    loadComponent("dashboard-inventory", "../components/dashboard-inventory.html");

    loadComponent("dashboard-summary", "../components/dashboard-summary.html")
.then(() => {

    loadDashboardCards();

});

});
// ======================================
// CHART.JS
// ======================================

window.addEventListener("load", () => {

    setTimeout(() => {

      // ======================================
// LIVE SALES CHART
// ======================================

const salesCanvas = document.getElementById("salesChart");

if(salesCanvas){

    const orders = JSON.parse(

        localStorage.getItem("orders")

    ) || [];

    const dailySales = {};

    orders.forEach(order=>{

        if(order.status !== "Paid") return;

        const date = new Date(order.date).toLocaleDateString();

        if(!dailySales[date]){

            dailySales[date] = 0;

        }

        dailySales[date] += Number(order.total);

    });

    const labels = Object.keys(dailySales);

    const values = Object.values(dailySales);

    new Chart(salesCanvas,{

        type:"line",

        data:{

            labels:labels,

            datasets:[{

                label:"Daily Sales",

                data:values,

                borderColor:"#2563EB",

                backgroundColor:"rgba(37,99,235,.15)",

                fill:true,

                tension:.35

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false

        }

    });

}
        // CATEGORY CHART

        const categoryCanvas = document.getElementById("categoryChart");

        if (categoryCanvas) {

            new Chart(categoryCanvas, {

                type: "doughnut",

                data: {

                    labels: [

                        "Main Course",

                        "Beverages",

                        "Desserts",

                        "Snacks"

                    ],

                    datasets: [{

                        data: [

                            35,

                            25,

                            20,

                            20

                        ],

                        backgroundColor: [

                            "#2563EB",

                            "#10B981",

                            "#F59E0B",

                            "#EF4444"

                        ]

                    }]

                }

            });

        }

    },500);

});
// ======================================
// LIVE DASHBOARD
// ======================================

function loadDashboardCards(){

    // -----------------------
    // ORDERS
    // -----------------------

    const orders = JSON.parse(

        localStorage.getItem("orders")

    ) || [];

    // -----------------------
    // TABLES
    // -----------------------

    const tables = JSON.parse(

        localStorage.getItem("restaurantTables")

    ) || [];

    // -----------------------
    // PRODUCTS
    // -----------------------

    const products = JSON.parse(

        localStorage.getItem("products")

    ) || [];

    let totalSales = 0;

    let totalProfit = 0;

    let totalCustomers = 0;

    let todayOrders = 0;

    const today = new Date().toLocaleDateString();

    orders.forEach(order=>{

        if(order.status !== "Paid") return;

        const orderDate = new Date(order.date).toLocaleDateString();

        if(orderDate !== today) return;

        totalSales += Number(order.total);

        todayOrders++;

        totalCustomers++;

        if(order.items){

            order.items.forEach(item=>{

                const product = products.find(p=>

                    p.name === item.name

                );

                if(product){

                    const cost = Number(product.costPrice || 0);

                    const selling = Number(item.price);

                    totalProfit +=

                        (selling-cost) *

                        Number(item.qty);

                }

            });

        }

    });

    const availableTables = tables.filter(table=>

        table.status==="Available"

    ).length;

    const occupiedTables = tables.filter(table=>

        table.status==="Occupied"

    ).length;

    const lowStock = products.filter(product=>

        Number(product.stock) <=

        Number(product.reorderLevel || 10)

    ).length;

    const averageSale =

        todayOrders===0 ?

        0 :

        totalSales/todayOrders;

    // -----------------------
    // UPDATE DASHBOARD
    // -----------------------

    if(document.getElementById("dashboardSales"))

        document.getElementById("dashboardSales").innerHTML=

        "₱"+totalSales.toLocaleString(undefined,{minimumFractionDigits:2});

    if(document.getElementById("dashboardOrders"))

        document.getElementById("dashboardOrders").innerHTML=

        todayOrders;

    if(document.getElementById("dashboardProfit"))

        document.getElementById("dashboardProfit").innerHTML=

        "₱"+totalProfit.toLocaleString(undefined,{minimumFractionDigits:2});

    if(document.getElementById("dashboardLowStock"))

        document.getElementById("dashboardLowStock").innerHTML=

        lowStock;

    if(document.getElementById("dashboardAvailableTables"))

        document.getElementById("dashboardAvailableTables").innerHTML=

        availableTables;

    if(document.getElementById("dashboardOccupiedTables"))

        document.getElementById("dashboardOccupiedTables").innerHTML=

        occupiedTables;

    if(document.getElementById("dashboardCustomers"))

        document.getElementById("dashboardCustomers").innerHTML=

        totalCustomers;

    if(document.getElementById("dashboardAverageSale"))

        document.getElementById("dashboardAverageSale").innerHTML=

        "₱"+averageSale.toLocaleString(undefined,{minimumFractionDigits:2});

}
