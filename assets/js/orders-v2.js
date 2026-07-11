// ===============================================
// LOZADA ERP
// ORDERS V2
// ===============================================

// ===============================================
// FIREBASE
// ===============================================

const firebaseConfig = {
    apiKey: "AIzaSyAV9T5w_1azmPHIJcZpraXP06TItj7HEuA",
    authDomain: "papprito-orders.firebaseapp.com",
    databaseURL: "https://papprito-orders-default-rtdb.firebaseio.com",
    projectId: "papprito-orders",
    storageBucket: "papprito-orders.firebasestorage.app",
    messagingSenderId: "831941801424",
    appId: "1:831941801424:web:40a99cdfb312dac2d275d5"
};

if(!firebase.apps.length){

    firebase.initializeApp(firebaseConfig);

}

const db = firebase.database();
// ===============================================
// COMPONENT LOADER
// ===============================================

async function loadComponent(id,file){

    try{

        const response = await fetch(file);

        if(!response.ok){

            throw new Error(file);

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

// ===============================================
// INITIALIZE
// ===============================================

document.addEventListener("DOMContentLoaded",async()=>{

    await loadComponent(
        "sidebar",
        "../components/sidebar.html"
    );

    await loadComponent(
        "navbar",
        "../components/navbar.html"
    );

    await loadComponent(
        "orders-header",
        "../components/orders-header.html"
    );

    await loadComponent(
        "orders-table",
        "../components/orders-table.html"
    );

    await loadComponent(
        "order-view-modal",
        "../components/order-view-modal.html"
    );

    // ===============================================
    // LOAD FIREBASE ORDERS
    // ===============================================

    loadOrders();

});
// ===============================================
// LOAD ORDERS FROM FIREBASE
// ===============================================

function loadOrders(){

    const tbody = document.getElementById("ordersTableBody");

    if(!tbody) return;

    db.ref("orders").on("value", snapshot=>{

        let html = "";

        let pending = 0;
        let preparing = 0;
        let ready = 0;
        let served = 0;

        snapshot.forEach(child=>{

            const key = child.key;
            const order = child.val();

            switch(order.status){

                case "Pending":
                    pending++;
                    break;

                case "Preparing":
                    preparing++;
                    break;

                case "Ready":
                    ready++;
                    break;

                case "Served":
                    served++;
                    break;

            }

            html += `

            <tr>

                <td>${order.receiptNo || "-"}</td>

                <td>${order.date || "-"}</td>

                <td>${order.customerName || "Walk-in"}</td>

                <td>${order.table || "-"}</td>

                <td>${order.orderType || "-"}</td>

                <td>

                    <span class="badge bg-primary">

                        ${order.status || "-"}

                    </span>

                </td>

                <td class="text-end">

                    ₱${Number(order.total || 0).toFixed(2)}

                </td>

                <td class="text-center">

                    <button
                        class="btn btn-primary btn-sm btn-view-order"
                        data-key="${key}">

                        <i class="fa-solid fa-eye"></i>

                    </button>

                    <button
                        class="btn btn-danger btn-sm btn-delete-order"
                        data-key="${key}">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </td>

            </tr>

            `;

        });

        if(html === ""){

            html = `

            <tr>

                <td colspan="8"
                    class="text-center text-muted">

                    No Orders Found

                </td>

            </tr>

            `;

        }

        tbody.innerHTML = html;

        const p = document.getElementById("pendingCount");
        const pr = document.getElementById("preparingCount");
        const r = document.getElementById("readyCount");
        const s = document.getElementById("servedCount");

        if(p) p.innerHTML = pending;
        if(pr) pr.innerHTML = preparing;
        if(r) r.innerHTML = ready;
        if(s) s.innerHTML = served;

    });

}
// ===============================================
// VIEW ORDER DETAILS
// ===============================================

document.addEventListener("click", function(e){

    const btn = e.target.closest(".btn-view-order");

    if(!btn) return;

    const key = btn.dataset.key;

    db.ref("orders/" + key).once("value").then(snapshot=>{

        if(!snapshot.exists()){

            alert("Order not found.");

            return;

        }

        const order = snapshot.val();
        window.currentOrder = order;
        document.getElementById("viewReceiptNo").innerHTML =
            order.receiptNo || "-";

        document.getElementById("viewDate").innerHTML =
            order.date || "-";

        document.getElementById("viewStatus").innerHTML =
            order.status || "-";

        document.getElementById("viewCustomer").innerHTML =
            order.customerName || "Walk-in";

        document.getElementById("viewTable").innerHTML =
            order.table || "-";

        document.getElementById("viewOrderType").innerHTML =
            order.orderType || "-";

        const tbody = document.getElementById("viewOrderItems");

        tbody.innerHTML = "";

        (order.items || []).forEach(item=>{

            tbody.innerHTML += `

            <tr>

                <td>${item.qty}</td>

                <td>${item.name}</td>

                <td class="text-end">

                    ₱${Number(item.price).toFixed(2)}

                </td>

                <td class="text-end">

                    ₱${Number(item.qty * item.price).toFixed(2)}

                </td>

            </tr>

            `;

        });

      // ===============================================
// ORDER INFORMATION
// ===============================================

document.getElementById("viewPayment").innerHTML =
    order.payment || "-";

document.getElementById("viewCashierName").innerHTML =
    order.cashier || "-";

document.getElementById("viewServer").innerHTML =
    order.server || "-";

document.getElementById("viewGuests").innerHTML =
    order.guests || "1";

document.getElementById("viewFloor").innerHTML =
    order.floor || "-";

// ===============================================
// TOTALS
// ===============================================

const subtotal = Number(order.total || 0);

document.getElementById("viewSubtotal").innerHTML =
    "₱" + subtotal.toFixed(2);

document.getElementById("viewGrandTotal").innerHTML =
    "₱" + subtotal.toFixed(2);

// ===============================================
// STATUS BADGE
// ===============================================

const statusColors = {

    Pending : "warning",

    Preparing : "primary",

    Ready : "success",

    Served : "info",

    Paid : "dark",

    Cancelled : "danger"

};

document.getElementById("viewStatus").innerHTML = `

<span class="badge bg-${statusColors[order.status] || "secondary"} fs-6">

    ${order.status || "-"}

</span>

`;

           const modal = new bootstrap.Modal(

    document.getElementById("orderViewModal")

);

modal.show();
    }).catch(error=>{

        console.error(error);

        alert("Unable to load order details.");

    });

});
// ===============================================
// DELETE ORDER
// ===============================================

document.addEventListener("click", function(e){

    const btn = e.target.closest(".btn-delete-order");

    if(!btn) return;

    const key = btn.dataset.key;

    if(!confirm("Are you sure you want to delete this order?")){

        return;

    }

    db.ref("orders/" + key)
        .remove()
        .then(()=>{

            alert("Order deleted successfully.");

        })
        .catch(error=>{

            console.error(error);

            alert("Unable to delete order.");

        });

});
// ===============================================
// PRINT RECEIPT
// ===============================================

document.addEventListener("click",function(e){

    if(e.target.id !== "btnPrintOrderReceipt") return;

    if(!window.currentOrder){

        alert("No order selected.");

        return;

    }

    const order = window.currentOrder;

    let items = "";

    (order.items || []).forEach(item=>{

        items += `

<tr>

<td>${item.qty}</td>

<td>${item.name}</td>

<td style="text-align:right">

₱${Number(item.price).toFixed(2)}

</td>

<td style="text-align:right">

₱${Number(item.qty * item.price).toFixed(2)}

</td>

</tr>

`;

    });

    const printWindow = window.open("","PRINT","width=800,height=700");

    printWindow.document.write(`

<html>

<head>

<title>Receipt</title>

<style>

body{

font-family:Arial,sans-serif;

padding:20px;

}

table{

width:100%;

border-collapse:collapse;

}

th,td{

border:1px solid #ccc;

padding:6px;

}

h2{

margin-bottom:5px;

}

.text-right{

text-align:right;

}

</style>

</head>

<body>

<h2>LOZADA ERP</h2>

<h4>Order Receipt</h4>

<hr>

<p><strong>Receipt:</strong> ${order.receiptNo}</p>

<p><strong>Date:</strong> ${order.date}</p>

<p><strong>Customer:</strong> ${order.customerName || "Walk-in"}</p>

<p><strong>Table:</strong> ${order.table || "-"}</p>

<p><strong>Order Type:</strong> ${order.orderType || "-"}</p>

<p><strong>Status:</strong> ${order.status}</p>

<hr>

<table>

<thead>

<tr>

<th>Qty</th>

<th>Item</th>

<th>Price</th>

<th>Total</th>

</tr>

</thead>

<tbody>

${items}

</tbody>

</table>

<h3 style="text-align:right">

Grand Total :

₱${Number(order.total).toFixed(2)}

</h3>

</body>

</html>

`);

    printWindow.document.close();

    printWindow.focus();

    printWindow.print();

});
