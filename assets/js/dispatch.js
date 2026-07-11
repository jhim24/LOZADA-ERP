// ===============================================
// LOZADA ERP
// DISPATCH AREA
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

        document.getElementById(id).innerHTML = html;

    }catch(error){

        console.error(error);

    }

}

// ===============================================
// INITIALIZE
// ===============================================

document.addEventListener("DOMContentLoaded", async()=>{

    await loadComponent("sidebar","../components/sidebar.html");

    await loadComponent("navbar","../components/navbar.html");

    await loadComponent("dispatch-header","../components/dispatch-header.html");

    await loadComponent("dispatch-board","../components/dispatch-board.html");

    loadDispatchOrders();

    setInterval(loadDispatchOrders,2000);

});
// ===============================================
// LOAD DISPATCH ORDERS
// ===============================================

function loadDispatchOrders(){

    const board = document.getElementById("dispatchBoard");

    if(!board) return;

    db.ref("orders").on("value",snapshot=>{

        let html = "";

        let ready = 0;
        let served = 0;
        let total = 0;

        snapshot.forEach(child=>{

            const key = child.key;
            const order = child.val();

            // Dispatch shows READY orders only
            if(order.status !== "Ready") return;

            total++;
            ready++;

            let items = "";

            (order.items || []).forEach(item=>{

                items += `
                    <div class="mb-1">
                        <b>${item.qty}x</b> ${item.name}
                    </div>
                `;

            });

            html += `

            <div class="col-lg-4">

                <div class="card shadow border-success">

                    <div class="card-header bg-success text-white">

                        Receipt # ${order.receiptNo || key}

                    </div>

                    <div class="card-body">

                        <p><b>Table:</b> ${order.table || "-"}</p>

                        <p><b>Customer:</b> ${order.customerName || order.customer || "Walk-in"}</p>

                        <p><b>Order Type:</b> ${order.orderType || "DINE-IN"}</p>

                        <hr>

                        ${items}

                        <hr>

                        <button
                            class="btn btn-primary w-100 btn-food-served"
                            data-key="${key}">

                            <i class="fa-solid fa-check"></i>

                            FOOD SERVED

                        </button>

                    </div>

                </div>

            </div>

            `;

        });

        if(html === ""){

            html = `
                <div class="col-12">
                    <div class="alert alert-secondary text-center">
                        No Ready Orders
                    </div>
                </div>
            `;

        }

        board.innerHTML = html;

        document.getElementById("dispatchReady").innerText = ready;
        document.getElementById("dispatchServed").innerText = served;
        document.getElementById("dispatchTotal").innerText = total;

    });

}
// ===============================================
// FOOD SERVED
// ===============================================

document.addEventListener("click", function(e){

    const btn = e.target.closest(".btn-food-served");

    if(!btn) return;

    const key = btn.dataset.key;

    db.ref("orders/" + key).update({

        status: "Served",

        servedTime: new Date().toISOString()

    }).then(()=>{

        alert("Order marked as Food Served.");

    }).catch(error=>{

        console.error(error);

        alert("Unable to update order.");

    });

});
