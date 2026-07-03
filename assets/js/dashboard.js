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
loadDashboardBestSeller();
loadDashboardNotifications();
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
      // ======================================
// LIVE PAYMENT CHART
// ======================================

const categoryCanvas = document.getElementById("categoryChart");

if(categoryCanvas){

    const orders = JSON.parse(

        localStorage.getItem("orders")

    ) || [];

    const paymentSummary = {

        "Cash":0,

        "Credit Card":0,

        "Debit Card":0,

        "GCash":0,

        "Maya":0,

        "Bank Transfer":0

    };

    orders.forEach(order=>{

        if(order.status !== "Paid") return;

        if(paymentSummary.hasOwnProperty(order.payment)){

            paymentSummary[order.payment]++;

        }

    });

    new Chart(categoryCanvas,{

        type:"doughnut",

        data:{

            labels:Object.keys(paymentSummary),

            datasets:[{

                data:Object.values(paymentSummary),

                backgroundColor:[

                    "#2563EB",

                    "#10B981",

                    "#F59E0B",

                    "#EC4899",

                    "#8B5CF6",

                    "#EF4444"

                ]

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    position:"bottom"

                }

            }

        }

    });

}
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
// ======================================
// DASHBOARD BEST SELLING
// ======================================

function loadDashboardBestSeller(){

    const tbody = document.getElementById("dashboardBestSeller");

    if(!tbody) return;

    const orders = JSON.parse(

        localStorage.getItem("orders")

    ) || [];

    const products = {};

    orders.forEach(order=>{

        if(order.status !== "Paid") return;

        if(!order.items) return;

        order.items.forEach(item=>{

            if(!products[item.name]){

                products[item.name] = 0;

            }

            products[item.name] += Number(item.qty);

        });

    });

    const ranking = Object.entries(products)

        .sort((a,b)=>b[1]-a[1])

        .slice(0,5);

    if(ranking.length===0){

        tbody.innerHTML=`

            <tr>

                <td colspan="3" class="text-center">

                    No Sales

                </td>

            </tr>

        `;

        return;

    }

    tbody.innerHTML="";

    ranking.forEach((product,index)=>{

        let medal = index + 1;

        if(index===0) medal="🥇";

        else if(index===1) medal="🥈";

        else if(index===2) medal="🥉";

        tbody.innerHTML += `

        <tr>

            <td>${medal}</td>

            <td>${product[0]}</td>

            <td>${product[1]}</td>

        </tr>

        `;

    });

}
// ======================================
// LIVE DASHBOARD NOTIFICATIONS
// ======================================

function loadDashboardNotifications(){

    const list = document.getElementById("dashboardNotifications");

    if(!list) return;

    list.innerHTML = "";

    const products = JSON.parse(localStorage.getItem("products")) || [];
    const tables = JSON.parse(localStorage.getItem("restaurantTables")) || [];
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    // Low Stock
    products.forEach(product=>{

        if(Number(product.stock) <= Number(product.reorderLevel || 10)){

            list.innerHTML += `
            <li class="list-group-item">
                🔴 Low Stock : <strong>${product.name}</strong>
            </li>`;
        }

    });

    // Occupied Tables
    const occupied = tables.filter(t=>t.status==="Occupied").length;

    if(occupied){

        list.innerHTML += `
        <li class="list-group-item">
            🍽 Occupied Tables : ${occupied}
        </li>`;
    }

    // Bill Requested
    const billRequested = tables.filter(t=>t.status==="Bill Requested").length;

    if(billRequested){

        list.innerHTML += `
        <li class="list-group-item">
            🧾 Waiting for Payment : ${billRequested}
        </li>`;
    }

    // Pending Kitchen Orders
    const pending = orders.filter(o=>o.status==="Pending").length;

    if(pending){

        list.innerHTML += `
        <li class="list-group-item">
            👨‍🍳 Kitchen Pending : ${pending}
        </li>`;
    }

    if(list.innerHTML===""){

        list.innerHTML=`
        <li class="list-group-item text-success">
            ✅ No notifications
        </li>`;
    }

}
