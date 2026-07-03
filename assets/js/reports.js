// ===============================================
// LOZADA ERP
// REPORTS MODULE
// ===============================================

// ---------- INITIALIZE ----------

document.addEventListener("DOMContentLoaded", function(){

    loadSalesReport();

    loadSalesChart();

    loadBestSellers();

});
// ===============================================
// LOAD SALES REPORT
// ===============================================

function loadSalesReport(){

    const tbody = document.getElementById("salesTableBody");

    if(!tbody) return;

    const orders = JSON.parse(

        localStorage.getItem("orders")

    ) || [];

    if(orders.length === 0){

        tbody.innerHTML = `

        <tr>

            <td colspan="6" class="text-center">

                No Sales Record

            </td>

        </tr>

        `;

        return;

    }

    let html = "";

    let totalSales = 0;
    let cashSales = 0;
    let cardSales = 0;
    let digitalSales = 0;
    let dailySales = 0;
    let weeklySales = 0;
    let monthlySales = 0;

    orders.forEach(order=>{

        totalSales += Number(order.total);
        
        const orderDate = new Date(order.date);

const today = new Date();

const weekAgo = new Date();

weekAgo.setDate(today.getDate() - 7);

if(orderDate.toDateString() === today.toDateString()){

    dailySales += Number(order.total);

}

if(orderDate >= weekAgo){

    weeklySales += Number(order.total);

}

if(
    orderDate.getMonth() === today.getMonth() &&
    orderDate.getFullYear() === today.getFullYear()
){

    monthlySales += Number(order.total);

}
        
        switch(order.payment){

    case "Cash":
        cashSales += Number(order.total);
        break;

    case "Credit Card":
    case "Debit Card":
        cardSales += Number(order.total);
        break;

    case "GCash":
    case "Maya":
    case "Bank Transfer":
        digitalSales += Number(order.total);
        break;

}
        html += `

        <tr>

            <td>${order.receiptNo}</td>

            <td>${order.date}</td>

            <td>${order.table}</td>

            <td>${order.customer}</td>

            <td>${order.payment}</td>

            <td>₱${Number(order.total).toFixed(2)}</td>

        </tr>

        `;

    });

    tbody.innerHTML = html;

    document.getElementById("todaySales").innerHTML =
    "₱" + totalSales.toFixed(2);

    document.getElementById("todayOrders").innerHTML =
    orders.length;

    document.getElementById("todayCustomers").innerHTML =
    orders.length;

    document.getElementById("averageSale").innerHTML =
    "₱" + (totalSales/orders.length).toFixed(2);
    document.getElementById("cashSales").innerHTML =
"₱" + cashSales.toFixed(2);

document.getElementById("cardSales").innerHTML =
"₱" + cardSales.toFixed(2);

document.getElementById("digitalSales").innerHTML =
"₱" + digitalSales.toFixed(2);

document.getElementById("totalTransactions").innerHTML =
orders.length;
    document.getElementById("dailySales").innerHTML =
"₱" + dailySales.toFixed(2);

document.getElementById("weeklySales").innerHTML =
"₱" + weeklySales.toFixed(2);

document.getElementById("monthlySales").innerHTML =
"₱" + monthlySales.toFixed(2);

}
// ===============================================
// SEARCH SALES
// ===============================================

document.addEventListener("input", function(e){

    if(e.target.id !== "searchSales") return;

    const keyword = e.target.value.toLowerCase();

    const rows = document.querySelectorAll("#salesTableBody tr");

    rows.forEach(row=>{

        if(row.innerText.toLowerCase().includes(keyword)){

            row.style.display = "";

        }else{

            row.style.display = "none";

        }

    });

});
// ===============================================
// DATE FILTER
// ===============================================

document.addEventListener("click", function(e){

    if(e.target.id !== "btnFilter") return;

    const from = document.getElementById("fromDate").value;

    const to = document.getElementById("toDate").value;

    const rows = document.querySelectorAll("#salesTableBody tr");

    rows.forEach(row=>{

        if(row.children.length < 2) return;

        const dateText = row.children[1].innerText;

        const saleDate = new Date(dateText);

        let show = true;

        if(from){

            show = show && saleDate >= new Date(from);

        }

        if(to){

            const endDate = new Date(to);

            endDate.setHours(23,59,59,999);

            show = show && saleDate <= endDate;

        }

        row.style.display = show ? "" : "none";

    });

});
// ===============================================
// SALES CHART
// ===============================================

function loadSalesChart(){

    const canvas = document.getElementById("salesChart");

    if(!canvas) return;

    const orders = JSON.parse(
        localStorage.getItem("orders")
    ) || [];

    const labels = [];

    const values = [];

    orders.forEach(order=>{

        labels.push(order.receiptNo);

        values.push(Number(order.total));

    });

    new Chart(canvas,{

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

            maintainAspectRatio:false

        }

    });

}
// ===============================================
// TOP SELLING PRODUCTS
// ===============================================

function loadBestSellers(){

    const tbody = document.getElementById("bestSellerTable");

    if(!tbody) return;

    const orders = JSON.parse(

        localStorage.getItem("orders")

    ) || [];

    const products = {};

    orders.forEach(order=>{

        if(!order.items) return;

        order.items.forEach(item=>{

            if(!products[item.name]){

                products[item.name] = {

                    qty: 0,

                    sales: 0

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

            <td colspan="4" class="text-center">

                No Product Sales

            </td>

        </tr>

        `;

        return;

    }

    tbody.innerHTML="";

    ranking.forEach((product,index)=>{

        tbody.innerHTML += `

        <tr>

            <td>${index+1}</td>

            <td>${product[0]}</td>

            <td>${product[1].qty}</td>

            <td>₱${product[1].sales.toFixed(2)}</td>

        </tr>

        `;

    });

}
