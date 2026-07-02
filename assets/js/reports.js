// ===============================================
// LOZADA ERP
// REPORTS MODULE
// ===============================================

// ---------- INITIALIZE ----------

document.addEventListener("DOMContentLoaded", function(){

    loadSalesReport();

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

    orders.forEach(order=>{

        totalSales += Number(order.total);

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

}
