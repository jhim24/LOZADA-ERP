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
    setInterval(updateOrderTimers,1000);
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

<div class="col-xl-3 col-lg-4 col-md-6 mb-4">

    <div class="card shadow-lg border-0 kitchen-order-card h-100">

        <div class="card-header bg-danger text-white">

            <div class="d-flex justify-content-between align-items-center">

                <h5 class="mb-0 fw-bold">

                    <i class="fa-solid fa-receipt"></i>

                    ${order.receiptNo || key}

                </h5>

                <span class="badge bg-light text-dark">

                    ${order.status}

                </span>

            </div>

        </div>

        <div class="card-body">

            <p class="mb-2">

                <i class="fa-solid fa-user"></i>

                <strong>

                    ${order.customerName || order.customer || "Walk-in"}

                </strong>

            </p>

           <p class="mb-2">

    <i class="fa-solid fa-utensils"></i>

    ${order.orderType || "DINE-IN"}

</p>

<p class="mb-3 kitchen-time">

    <i class="fa-regular fa-clock"></i>

    <span id="timer-${key}">

        00:00

    </span>

</p>

            <hr>

            ${items}

            <hr>

            <div class="d-grid gap-2">

                <button

                    class="btn btn-success"

                    onclick="updateKitchenStatus('${key}','Preparing')">

                    <i class="fa-solid fa-fire"></i>

                    START COOKING

                </button>

                <button

                    class="btn btn-primary"

                    onclick="updateKitchenStatus('${key}','Ready')">

                    <i class="fa-solid fa-circle-check"></i>

                    READY

                </button>

            </div>

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
/* ==========================================
   KITCHEN ORDER CARD
========================================== */

.kitchen-order-card{

    border-radius:18px;

    overflow:hidden;

    transition:.25s;

    background:#ffffff;

}

.kitchen-order-card:hover{

    transform:translateY(-5px);

    box-shadow:0 15px 35px rgba(0,0,0,.18);

}

.kitchen-order-card .card-header{

    padding:18px;

    font-size:20px;

    font-weight:700;

}

.kitchen-order-card .card-body{

    padding:20px;

}

.kitchen-order-card p{

    font-size:17px;

    margin-bottom:10px;

}

.kitchen-order-card hr{

    margin:18px 0;

}

.kitchen-order-card .btn{

    font-size:18px;

    font-weight:700;

    padding:14px;

    border-radius:10px;

}

.kitchen-order-card .badge{

    font-size:14px;

    padding:8px 12px;

}

.kitchen-order-card .mb-1{

    font-size:18px;

    padding:4px 0;

}
// ===============================================
// ORDER TIMER
// ===============================================

function updateOrderTimers(){

    db.ref("orders").once("value").then(snapshot=>{

        snapshot.forEach(child=>{

            const order = child.val();

            const key = child.key;

            if(!order.createdAt){

                return;

            }

            const timer = document.getElementById(

                "timer-" + key

            );

            if(!timer){

                return;

            }

            const diff = Math.floor(

                (Date.now() - order.createdAt) / 1000

            );

            const minutes = Math.floor(diff / 60);

            const seconds = diff % 60;

           timer.innerHTML =

    String(minutes).padStart(2,"0")

    +

    ":"

    +

    String(seconds).padStart(2,"0");

// Remove previous color classes

timer.classList.remove(

    "timer-green",

    "timer-yellow",

    "timer-red"

);

// Change color based on elapsed time

if(minutes < 5){

    timer.classList.add("timer-green");

}

else if(minutes < 10){

    timer.classList.add("timer-yellow");

}

else{

    timer.classList.add("timer-red");

}

        });

    });

}
/* ==========================================
   ORDER TIMER COLORS
========================================== */

.kitchen-time{

    font-size:18px;

    font-weight:700;

}

.timer-green{

    color:#16a34a;

}

.timer-yellow{

    color:#f59e0b;

}

.timer-red{

    color:#dc2626;

    animation:blinkTimer 1s infinite;

}

@keyframes blinkTimer{

    0%{

        opacity:1;

    }

    50%{

        opacity:.35;

    }

    100%{

        opacity:1;

    }

}
