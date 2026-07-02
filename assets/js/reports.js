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
