// ===============================================
// LOZADA ERP
// KITCHEN DISPLAY
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

// ---------- COMPONENT LOADER ----------

async function loadComponent(id,file){

    try{

        const response = await fetch(file);

        if(!response.ok){

            throw new Error(file);

        }

        const html = await response.text();

        document.getElementById(id).innerHTML = html;

    }catch(err){

        console.error(err);

    }

}

// ---------- INITIALIZE ----------

document.addEventListener("DOMContentLoaded",async()=>{

    await loadComponent("sidebar","../components/sidebar.html");

    await loadComponent("navbar","../components/navbar.html");

    await loadComponent("kitchen-header","../components/kitchen-header.html");

    await loadComponent("kitchen-board","../components/kitchen-board.html");

    loadKitchenOrders();

    updateKitchenClock();

    setInterval(updateKitchenClock,1000);
setInterval(loadKitchenOrders,2000);
});

// ===============================================
// UPDATE STATUS FROM KITCHEN
// ===============================================

document.addEventListener("click",function(e){

    // PREPARING

    if(e.target.closest(".btn-preparing")){

        const receiptNo = e.target
            .closest(".btn-preparing")
            .dataset.receipt;

        updateKitchenStatus(receiptNo,"Preparing");

    }

    // READY

    if(e.target.closest(".btn-ready")){

        const receiptNo = e.target
            .closest(".btn-ready")
            .dataset.receipt;

        updateKitchenStatus(receiptNo,"Ready");

    }

});

// ===============================================
// LOAD KITCHEN ORDERS
// ===============================================

function loadKitchenOrders(){

const board = document.getElementById("kitchenBoard");

db.ref("orders").on("value",snapshot=>{

let html = "";

let pending = 0;
let preparing = 0;
let ready = 0;

snapshot.forEach(child=>{

    const order = child.val();
    const key = child.key;

    let items = "";

    // Show only kitchen orders
    if(
        order.status !== "Pending" &&
        order.status !== "Preparing" &&
        order.status !== "Ready"
    ){
        return;
    }

    // Counters
    if(order.status === "Pending"){

        pending++;

    }else if(order.status === "Preparing"){

        preparing++;

    }else if(order.status === "Ready"){

        ready++;

    }

    // Items
    (order.items || []).forEach(item=>{

        items += `
        <div class="mb-1">
            <b>${item.qty}x</b> ${item.name}
        </div>
        `;

    });

    // Card
    html += `

   <div class="col-xl-3 col-lg-4 col-md-6">

        <div class="card shadow border-warning">

            <div class="card-header bg-warning fw-bold">

                Receipt # ${order.receiptNo || key}

            </div>

            <div class="card-body">

                <p><b>Customer:</b> ${order.customerName || order.customer || "Walk-in"}</p>

                <p><b>Order Type:</b> ${order.orderType || "DINE-IN"}</p>

                <hr>

                ${items}

                <hr>

                <button
                    class="btn btn-success w-100"
                    onclick="updateKitchenStatus('${key}','Preparing')">

                    START COOKING

                </button>

                <button
                    class="btn btn-primary w-100 mt-2"
                    onclick="updateKitchenStatus('${key}','Ready')">

                    READY

                </button>

            </div>

        </div>

    </div>

    `;

});
    
if(html===""){

html = `
<div class="col-12">

<div class="alert alert-secondary text-center">

No Kitchen Orders

</div>

</div>
`;

}

board.innerHTML = html;

document.getElementById("kitchenPending").innerText = pending;
document.getElementById("kitchenPreparing").innerText = preparing;
document.getElementById("kitchenReady").innerText = ready;

});

}
// ===============================================
// UPDATE KITCHEN CLOCK
// ===============================================

function updateKitchenClock(){

    const clock = document.getElementById("currentKitchenTime");

    if(!clock) return;

    clock.innerHTML = new Date().toLocaleTimeString();

}

// ===============================================
// UPDATE ORDER STATUS
// ===============================================

function updateKitchenStatus(key,status){

    db.ref("orders/" + key).update({

        status: status

    }).then(()=>{

        loadKitchenOrders();

    });

}
