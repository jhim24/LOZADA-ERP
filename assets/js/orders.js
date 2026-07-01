// ===============================================
// LOZADA ERP
// ORDERS
// ===============================================

let orders = JSON.parse(localStorage.getItem("orders")) || [];

function loadOrders(){

    const tbody = document.getElementById("ordersTableBody");

    if(!tbody) return;

    orders = JSON.parse(localStorage.getItem("orders")) || [];

    tbody.innerHTML = "";

    if(orders.length===0){

        tbody.innerHTML = `

        <tr>

            <td colspan="8" class="text-center">

                No Orders Found

            </td>

        </tr>

        `;

        return;

    }

    orders.forEach((order,index)=>{

        tbody.innerHTML += `

        <tr>

            <td>${order.receiptNo}</td>

            <td>${order.date}</td>

            <td>${order.items.length}</td>

            <td>₱${order.total.toFixed(2)}</td>

            <td>

                <span class="badge bg-warning">

                    ${order.status}

                </span>

            </td>

            <td>

                ${order.payment}

            </td>

            <td>

                ${order.cashier}

            </td>

            <td>

                <button
                class="btn btn-primary btn-sm">

                View

                </button>

            </td>

        </tr>

        `;

    });

}

document.addEventListener("DOMContentLoaded",loadOrders);
