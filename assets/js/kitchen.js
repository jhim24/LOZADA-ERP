// ===============================================
// LOZADA ERP
// KITCHEN DISPLAY
// ===============================================

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
// LOAD KITCHEN ORDERS
// ===============================================

function loadKitchenOrders(){

    const board = document.getElementById("kitchenBoard");

    if(!board) return;

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    board.innerHTML = "";

    let pending = 0;
    let preparing = 0;
    let ready = 0;

    const kitchenOrders = orders.filter(order=>{

        return order.status==="Pending" ||

               order.status==="Preparing" ||

               order.status==="Ready";

    });

    if(kitchenOrders.length===0){

        board.innerHTML=`

        <div class="col-12">

            <div class="alert alert-secondary text-center">

                No Kitchen Orders

            </div>

        </div>

        `;

    }

    kitchenOrders.forEach((order,index)=>{

        if(order.status==="Pending") pending++;

        if(order.status==="Preparing") preparing++;

        if(order.status==="Ready") ready++;

        let itemsHTML="";

        order.items.forEach(item=>{

            itemsHTML+=`

            <li>

                ${item.qty} x ${item.name}

            </li>

            `;

        });

        board.innerHTML+=`

        <div class="col-lg-4 mb-4">

            <div class="card shadow border-0">

                <div class="card-header bg-dark text-white">

                    <h5 class="mb-0">

                        Order #${order.receiptNo}

                    </h5>

                    <small>${order.date}</small>

                </div>

                <div class="card-body">

                    <ul>

                        ${itemsHTML}

                    </ul>
<div class="mb-2">

    <strong>Table:</strong>

    ${order.floor} - ${order.table}

    <br>

    <strong>Customer:</strong>

    ${order.customer}

    <br>

    <strong>Guests:</strong>

    ${order.guests}

    <br>

    <strong>Server:</strong>

    ${order.server}

</div>

<hr>
                    <hr>

                   <div class="d-flex justify-content-between align-items-center mt-3">

    <span class="badge
    ${order.status==="Pending"?"bg-warning":
      order.status==="Preparing"?"bg-primary":
      "bg-success"}">

        ${order.status}

    </span>

    <div>

        <button
        class="btn btn-primary btn-sm btn-preparing"
        data-receipt="${order.receiptNo}">

            Preparing

        </button>

        <button
        class="btn btn-success btn-sm btn-ready"
        data-receipt="${order.receiptNo}">

            Ready

        </button>

    </div>

</div>
                </div>

            </div>

        </div>

        `;

    });

    document.getElementById("kitchenPending").innerHTML = pending;

    document.getElementById("kitchenPreparing").innerHTML = preparing;

    document.getElementById("kitchenReady").innerHTML = ready;

}
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
// UPDATE ORDER STATUS
// ===============================================

function updateKitchenStatus(receiptNo,status){

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const index = orders.findIndex(order=>{

        return String(order.receiptNo)===String(receiptNo);

    });

    if(index===-1) return;

    orders[index].status = status;
// Notify Cashier

localStorage.setItem(

    "kitchenNotification",

    JSON.stringify({

        receiptNo: receiptNo,

        status: status,

        time: new Date().toLocaleTimeString()

    })

);
    localStorage.setItem(

        "orders",

        JSON.stringify(orders)

    );

    loadKitchenOrders();

}
