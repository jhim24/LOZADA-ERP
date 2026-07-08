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
    initializeSidebarToggle();
  
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

    loadPaymentChart();

    loadBestSeller();
     
    loadNotifications();

    loadRecentOrders();

    loadBusinessSummary();

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

   if(
    window.salesChart &&
    typeof window.salesChart.destroy === "function"
){

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
// ======================================
// LOAD PAYMENT CHART
// ======================================

function loadPaymentChart(){

    const canvas = document.getElementById("categoryChart");

    if(!canvas) return;

    const orders = JSON.parse(

        localStorage.getItem("orders")

    ) || [];

    const payment = {

        "Cash":0,

        "Credit Card":0,

        "Debit Card":0,

        "GCash":0,

        "Maya":0,

        "Bank Transfer":0

    };

    orders.forEach(order=>{

        if(order.status !== "Paid") return;

        if(payment.hasOwnProperty(order.payment)){

            payment[order.payment]++;

        }

    });

   if(
    window.paymentChart &&
    typeof window.paymentChart.destroy === "function"
){

    window.paymentChart.destroy();

}
    window.paymentChart = new Chart(canvas,{

        type:"doughnut",

        data:{

            labels:Object.keys(payment),

            datasets:[{

                data:Object.values(payment)

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
// LOAD BEST SELLER
// ======================================

function loadBestSeller(){

    const tbody = document.getElementById("dashboardBestSeller");

    if(!tbody) return;

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

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

        tbody.innerHTML = `
        <tr>
            <td colspan="3" class="text-center">
                No Sales Yet
            </td>
        </tr>
        `;

        return;

    }

    tbody.innerHTML = "";

    ranking.forEach((item,index)=>{

        tbody.innerHTML += `

        <tr>

            <td>${index+1}</td>

            <td>${item[0]}</td>

            <td>${item[1]}</td>

        </tr>

        `;

    });

}
// ======================================
// LIVE NOTIFICATIONS
// ======================================

function loadNotifications(){

    const list = document.getElementById("dashboardNotifications");

    if(!list) return;

    list.innerHTML = "";

    const products = JSON.parse(localStorage.getItem("products")) || [];

    const tables = JSON.parse(localStorage.getItem("restaurantTables")) || [];

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    // LOW STOCK

    products.forEach(product=>{

        if(Number(product.stock) <= Number(product.reorderLevel || 10)){

            list.innerHTML += `
            <li class="list-group-item">
                🔴 Low Stock : <strong>${product.name}</strong>
            </li>`;
        }

    });

    // OCCUPIED TABLES

    const occupied = tables.filter(table=>table.status==="Occupied").length;

    if(occupied){

        list.innerHTML += `
        <li class="list-group-item">
            🍽 Occupied Tables : ${occupied}
        </li>`;
    }

    // PENDING ORDERS

    const pending = orders.filter(order=>order.status==="Pending").length;

    if(pending){

        list.innerHTML += `
        <li class="list-group-item">
            👨‍🍳 Pending Kitchen Orders : ${pending}
        </li>`;
    }

    if(list.innerHTML===""){

        list.innerHTML=`
        <li class="list-group-item text-success">
            ✅ No Notifications
        </li>`;
    }

}
// ======================================
// AUTO REFRESH DASHBOARD
// ======================================

setInterval(function(){

    loadDashboardCards();

    loadSalesChart();

    loadPaymentChart();

    loadBestSeller();
      
    loadNotifications();

    loadRecentOrders();

    loadBusinessSummary();

},5000);
// ======================================
// LIVE RECENT ORDERS
// ======================================

function loadRecentOrders(){

    const tbody = document.getElementById("dashboardRecentOrders");

    if(!tbody) return;

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    tbody.innerHTML = "";

    const recent = [...orders].reverse().slice(0,10);

    if(recent.length===0){

        tbody.innerHTML=`
        <tr>
            <td colspan="6" class="text-center">
                No Orders Yet
            </td>
        </tr>
        `;

        return;

    }

    recent.forEach(order=>{

        tbody.innerHTML += `

        <tr>

            <td>${order.receiptNo}</td>

            <td>${order.customer}</td>

            <td>${order.table}</td>

            <td>${order.payment || "-"}</td>

            <td>₱${Number(order.total).toFixed(2)}</td>

            <td>

                <span class="badge bg-${order.status==="Paid"?"success":"warning"}">

                    ${order.status}

                </span>

            </td>

        </tr>

        `;

    });

}
// ======================================
// BUSINESS SUMMARY
// ======================================

function loadBusinessSummary(){

    const orders = JSON.parse(
        localStorage.getItem("orders")
    ) || [];

    let cash = 0;

    let card = 0;

    let digital = 0;

    let transactions = 0;

    orders.forEach(order=>{

        if(order.status !== "Paid") return;

        transactions++;

        switch(order.payment){

            case "Cash":

                cash += Number(order.total || 0);

                break;

            case "Credit Card":

            case "Debit Card":

                card += Number(order.total || 0);

                break;

            case "GCash":

            case "Maya":

            case "Bank Transfer":

                digital += Number(order.total || 0);

                break;

        }

    });

    const expenses = 0;

    const netProfit =
        cash +
        card +
        digital -
        expenses;

    const setValue=(id,value)=>{

        const element=document.getElementById(id);

        if(element){

            element.innerHTML=value;

        }

    };

    setValue(
        "dashboardCashSales",
        "₱"+cash.toFixed(2)
    );

    setValue(
        "dashboardCardSales",
        "₱"+card.toFixed(2)
    );

    setValue(
        "dashboardDigitalSales",
        "₱"+digital.toFixed(2)
    );

    setValue(
        "dashboardExpenses",
        "₱"+expenses.toFixed(2)
    );

    setValue(
        "dashboardNetProfit",
        "₱"+netProfit.toFixed(2)
    );

    setValue(
        "dashboardTransactions",
        transactions
    );

}
// ======================================
// LIVE CLOCK
// ======================================

function updateDashboardClock(){

    const clock = document.getElementById("liveClock");

    if(!clock) return;

    const now = new Date();

    clock.innerHTML =
        now.toLocaleTimeString();

}

updateDashboardClock();

setInterval(updateDashboardClock,1000);

// ======================================
// SIDEBAR TOGGLE
// ======================================

document.addEventListener("click", function(e){

    const btn = e.target.closest("#toggleSidebar");

    if(!btn) return;

    document.body.classList.toggle("sidebar-collapsed");

    localStorage.setItem(
        "sidebarCollapsed",
        document.body.classList.contains("sidebar-collapsed")
    );

});

document.addEventListener("DOMContentLoaded", function(){

    if(localStorage.getItem("sidebarCollapsed") === "true"){

        document.body.classList.add("sidebar-collapsed");

    }

});
