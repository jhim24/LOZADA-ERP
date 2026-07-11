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
