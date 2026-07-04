// ===============================================
// LOZADA ERP
// REPORTS MODULE (NEW)
// ===============================================

let orders = [];
let paidOrders = [];
let salesChart = null;

// ===============================================
// INITIALIZE
// ===============================================

document.addEventListener("DOMContentLoaded", () => {

    refreshReports();

    initializeEvents();

    // Auto Refresh every 2 seconds
    setInterval(refreshReports, 2000);

});
// ===============================================
// LOAD ORDERS
// ===============================================

function loadOrders(){

    orders = JSON.parse(

        localStorage.getItem("orders")

    ) || [];

    paidOrders = orders.filter(order =>

        order.status === "Paid"

    );

}
// ===============================================
// DASHBOARD CARDS
// ===============================================

function loadDashboard(){

    let totalSales = 0;

    let cashSales = 0;

    let cardSales = 0;

    let digitalSales = 0;

    let dailySales = 0;

    let weeklySales = 0;

    let monthlySales = 0;

    const today = new Date();

    const weekAgo = new Date();

    weekAgo.setDate(today.getDate() - 7);

    paidOrders.forEach(order=>{

        const amount = Number(order.total) || 0;

        totalSales += amount;

        const orderDate = new Date(order.date);

        // Daily

        if(orderDate.toDateString() === today.toDateString()){

            dailySales += amount;

        }

        // Weekly

        if(orderDate >= weekAgo){

            weeklySales += amount;

        }

        // Monthly

        if(

            orderDate.getMonth() === today.getMonth() &&

            orderDate.getFullYear() === today.getFullYear()

        ){

            monthlySales += amount;

        }

        // Payment Summary

        switch(order.payment){

            case "Cash":

                cashSales += amount;

                break;

            case "Credit Card":

            case "Debit Card":

                cardSales += amount;

                break;

            case "GCash":

            case "Maya":

            case "Bank Transfer":

                digitalSales += amount;

                break;

        }

    });

    document.getElementById("todaySales").innerHTML =
        "₱" + totalSales.toFixed(2);

    document.getElementById("todayOrders").innerHTML =
        paidOrders.length;

    document.getElementById("todayCustomers").innerHTML =
        paidOrders.length;

    document.getElementById("averageSale").innerHTML =
        "₱" + (
            paidOrders.length
            ? totalSales / paidOrders.length
            : 0
        ).toFixed(2);

    document.getElementById("cashSales").innerHTML =
        "₱" + cashSales.toFixed(2);

    document.getElementById("cardSales").innerHTML =
        "₱" + cardSales.toFixed(2);

    document.getElementById("digitalSales").innerHTML =
        "₱" + digitalSales.toFixed(2);

    document.getElementById("totalTransactions").innerHTML =
        paidOrders.length;

    document.getElementById("dailySales").innerHTML =
        "₱" + dailySales.toFixed(2);

    document.getElementById("weeklySales").innerHTML =
        "₱" + weeklySales.toFixed(2);

    document.getElementById("monthlySales").innerHTML =
        "₱" + monthlySales.toFixed(2);

}
// ===============================================
// SALES TABLE
// ===============================================

function loadSalesTable(){

    const tbody = document.getElementById("salesTableBody");

    if(!tbody) return;

    if(paidOrders.length === 0){

        tbody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center">
                No Sales Record
            </td>
        </tr>
        `;

        return;

    }

    tbody.innerHTML = "";

    paidOrders.forEach(order=>{

        tbody.innerHTML += `
        <tr>

            <td>${order.receiptNo}</td>

            <td>${order.date}</td>

            <td>${order.table || "-"}</td>

            <td>${order.customer || "Walk-in"}</td>

            <td>${order.payment || "-"}</td>

            <td>₱${Number(order.total).toFixed(2)}</td>

        </tr>
        `;

    });

}
// ===============================================
// SALES CHART
// ===============================================

function loadSalesChart(){

    const canvas = document.getElementById("salesChart");

    if(!canvas) return;

    // Destroy old chart
    if(salesChart){

        salesChart.destroy();

    }

    const labels = [];

    const values = [];

    paidOrders.forEach(order=>{

        labels.push(order.receiptNo);

        values.push(Number(order.total));

    });

    salesChart = new Chart(canvas,{

        type:"bar",

        data:{

            labels:labels,

            datasets:[{

                label:"Sales",

                data:values

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    display:true

                }

            }

        }

    });

}
// ===============================================
// TOP SELLING PRODUCTS
// ===============================================

function loadBestSellers(){

    const tbody = document.getElementById("bestSellerTable");

    if(!tbody) return;

    const products = {};

    paidOrders.forEach(order=>{

        if(!order.items) return;

        order.items.forEach(item=>{

            if(!products[item.name]){

                products[item.name] = {

                    qty:0,

                    sales:0

                };

            }

            products[item.name].qty += Number(item.qty);

            products[item.name].sales +=
                Number(item.price) * Number(item.qty);

        });

    });

    const ranking = Object.entries(products)

        .sort((a,b)=>b[1].qty-a[1].qty)

        .slice(0,10);

    if(ranking.length===0){

        tbody.innerHTML=`
        <tr>
            <td colspan="5" class="text-center">
                No Product Sales
            </td>
        </tr>
        `;

        return;

    }

    const grandTotal = ranking.reduce((sum,p)=>
        sum + p[1].sales,0
    );

    tbody.innerHTML="";

    ranking.forEach((product,index)=>{

        let medal=index+1;

        if(index===0) medal="🥇";
        else if(index===1) medal="🥈";
        else if(index===2) medal="🥉";

        const percent=((product[1].sales/grandTotal)*100).toFixed(1);

        tbody.innerHTML += `

        <tr>

            <td>${medal}</td>

            <td>${product[0]}</td>

            <td>${product[1].qty}</td>

            <td>₱${product[1].sales.toFixed(2)}</td>

            <td>${percent}%</td>

        </tr>

        `;

    });

}
// ===============================================
// SEARCH SALES
// ===============================================

function initializeEvents(){

    // Search
    document.getElementById("searchSales")?.addEventListener("input", function(){

        const keyword = this.value.toLowerCase();

        const rows = document.querySelectorAll("#salesTableBody tr");

        rows.forEach(row=>{

            if(row.innerText.toLowerCase().includes(keyword)){

                row.style.display="";

            }else{

                row.style.display="none";

            }

        });

    });

    // Filter Button
    document.getElementById("btnFilter")?.addEventListener("click", filterSales);

}
// ===============================================
// DATE FILTER
// ===============================================

function filterSales(){

    const from = document.getElementById("fromDate").value;

    const to = document.getElementById("toDate").value;

    const rows = document.querySelectorAll("#salesTableBody tr");

    rows.forEach(row=>{

        if(row.children.length < 2) return;

        const saleDate = new Date(row.children[1].innerText);

        let visible = true;

        if(from){

            visible = visible && saleDate >= new Date(from);

        }

        if(to){

            const endDate = new Date(to);

            endDate.setHours(23,59,59,999);

            visible = visible && saleDate <= endDate;

        }

        row.style.display = visible ? "" : "none";

    });

}
// ===============================================
// REFRESH REPORTS
// ===============================================

function refreshReports(){

    loadOrders();

    loadDashboard();

    loadSalesTable();

    loadSalesChart();

    loadBestSellers();

}
