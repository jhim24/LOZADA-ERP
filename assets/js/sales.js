// ===============================================
// LOZADA ERP
// SALES REPORT
// ===============================================

// ---------- COMPONENT LOADER ----------

async function loadComponent(id,file){

    const response = await fetch(file);

    const html = await response.text();

    document.getElementById(id).innerHTML = html;

}

// ---------- INITIALIZE ----------

document.addEventListener("DOMContentLoaded", async()=>{

    await loadComponent("sidebar","../components/sidebar.html");

    await loadComponent("navbar","../components/navbar.html");

    await loadComponent("sales-header","../components/sales-header.html");

    await loadComponent("sales-content","../components/sales-content.html");

    loadSales();

});
// ===============================================
// LOAD SALES
// ===============================================

function loadSales(){

    const tbody = document.getElementById("salesTableBody");

    if(!tbody) return;

    const orders = JSON.parse(

        localStorage.getItem("orders")

    ) || [];

    if(orders.length===0){

        tbody.innerHTML=`

        <tr>

            <td colspan="7" class="text-center text-muted">

                No Sales Record

            </td>

        </tr>

        `;

        return;

    }

    let html="";

    let totalSales=0;

    orders.forEach(order=>{

        totalSales += Number(order.total);

        html += `

        <tr>

            <td>${order.receiptNo}</td>

            <td>${order.date}</td>

            <td>${order.table}</td>

            <td>${order.customer}</td>

            <td>${order.payment}</td>

            <td>

                ₱${Number(order.total).toFixed(2)}

            </td>

            <td>

                <button
                class="btn btn-sm btn-primary">

                    View

                </button>

            </td>

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
