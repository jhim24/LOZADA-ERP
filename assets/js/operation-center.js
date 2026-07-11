// ===============================================
// LOZADA ERP
// OPERATION CENTER
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

if (!firebase.apps.length) {

    firebase.initializeApp(firebaseConfig);

}

const db = firebase.database();

// ===============================================
// COMPONENT LOADER
// ===============================================

async function loadComponent(id, file){

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

document.addEventListener("DOMContentLoaded", async()=>{

    await loadComponent(
        "sidebar",
        "../components/sidebar.html"
    );

    await loadComponent(
        "navbar",
        "../components/navbar.html"
    );

    await loadComponent(
        "operation-header",
        "../components/operation-header.html"
    );

    await loadComponent(
        "operation-board",
        "../components/operation-board.html"
    );

    // Start Live Monitoring
    loadOperationCenter();

    // Auto Refresh
    setInterval(loadOperationCenter,2000);

});
// ===============================================
// LOAD OPERATION CENTER
// ===============================================

function loadOperationCenter(){

    db.ref("orders").on("value", snapshot=>{

        let pendingHTML = "";
        let preparingHTML = "";
        let readyHTML = "";
        let servedHTML = "";
        let paidHTML = "";

        let pending = 0;
        let preparing = 0;
        let ready = 0;
        let served = 0;
        let paid = 0;

        snapshot.forEach(child=>{

            const order = child.val();

            const card = `

            <div class="card shadow-sm mb-2">

                <div class="card-body p-2">

                    <small class="text-muted">

                        Receipt #${order.receiptNo || "-"}

                    </small>

                    <br>

                    <strong>

                        ${order.table || order.orderType || "-"}

                    </strong>

                    <br>

                    <small>

                        ${order.customerName || order.customer || "Walk-in"}

                    </small>

                </div>

            </div>

            `;

            switch(order.status){

                case "Pending":

                    pending++;

                    pendingHTML += card;

                    break;

                case "Preparing":

                    preparing++;

                    preparingHTML += card;

                    break;

                case "Ready":

                    ready++;

                    readyHTML += card;

                    break;

                case "Served":

                    served++;

                    servedHTML += card;

                    break;

                case "Paid":

                    paid++;

                    paidHTML += card;

                    break;

            }

        });

        document.getElementById("pendingBoard").innerHTML =
            pendingHTML || '<div class="alert alert-light text-center">No Pending Orders</div>';

        document.getElementById("preparingBoard").innerHTML =
            preparingHTML || '<div class="alert alert-light text-center">No Preparing Orders</div>';

        document.getElementById("readyBoard").innerHTML =
            readyHTML || '<div class="alert alert-light text-center">No Ready Orders</div>';

        document.getElementById("servedBoard").innerHTML =
            servedHTML || '<div class="alert alert-light text-center">No Served Orders</div>';

        document.getElementById("paidBoard").innerHTML =
            paidHTML || '<div class="alert alert-light text-center">No Paid Orders</div>';

        document.getElementById("pendingCount").innerText = pending;
        document.getElementById("preparingCount").innerText = preparing;
        document.getElementById("readyCount").innerText = ready;
        document.getElementById("servedCount").innerText = served;
        document.getElementById("paidCount").innerText = paid;

    });

}
