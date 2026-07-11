// ===============================================
// LOZADA ERP
// ORDER HISTORY
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

        document.getElementById(id).innerHTML =
            await response.text();

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
        "history-header",
        "../components/history-header.html"
    );

    await loadComponent(
        "history-table",
        "../components/history-table.html"
    );

    loadHistory();

});
// ===============================================
// LOAD ORDER HISTORY
// ===============================================

function loadHistory(){

    const tbody = document.getElementById("historyTableBody");

    if(!tbody) return;

    db.ref("orders/history").on("value", snapshot=>{

        let html = "";

        let totalOrders = 0;
        let totalSales = 0;
        let paidOrders = 0;
        let cancelledOrders = 0;

        snapshot.forEach(yearSnap=>{

            yearSnap.forEach(monthSnap=>{

                monthSnap.forEach(orderSnap=>{

                    const key = orderSnap.key;
                    const order = orderSnap.val();

                    totalOrders++;

                    totalSales += Number(order.total || 0);

                    if(order.status === "Paid"){

                        paidOrders++;

                    }

                    if(order.status === "Cancelled"){

                        cancelledOrders++;

                    }

                    html += `

<tr>

<td>${order.receiptNo || "-"}</td>

<td>${order.date || "-"}</td>

<td>${order.customerName || "Walk-in"}</td>

<td>${order.table || "-"}</td>

<td>${order.orderType || "-"}</td>

<td>

<span class="badge bg-success">

${order.status || "-"}

</span>

</td>

<td class="text-end">

₱${Number(order.total || 0).toFixed(2)}

</td>

<td class="text-center">

<button
class="btn btn-primary btn-sm btn-history-view"
data-key="${key}">

<i class="fa-solid fa-eye"></i>

</button>

<button
class="btn btn-secondary btn-sm btn-history-print"
data-key="${key}">

<i class="fa-solid fa-print"></i>

</button>

</td>

</tr>

`;

                });

            });

        });

        if(html === ""){

            html = `

<tr>

<td colspan="8" class="text-center text-muted">

No Order History Found

</td>

</tr>

`;

        }

        tbody.innerHTML = html;

        document.getElementById("historyTotalOrders").innerHTML =
            totalOrders;

        document.getElementById("historyTotalSales").innerHTML =
            "₱" + totalSales.toFixed(2);

        document.getElementById("historyPaidOrders").innerHTML =
            paidOrders;

        document.getElementById("historyCancelledOrders").innerHTML =
            cancelledOrders;

    });

}
