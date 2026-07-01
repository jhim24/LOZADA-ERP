// ===============================================
// LOZADA ERP
// ORDERS
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

   await loadComponent("orders-header","../components/orders-header.html");

await loadComponent("orders-table","../components/orders-table.html");

await loadComponent("order-view-modal","../components/order-view-modal.html");

loadOrders();
});

// ===============================================
// LOAD ORDERS
// ===============================================

function loadOrders(){

    const tbody=document.getElementById("ordersTableBody");

    if(!tbody) return;

    const orders=JSON.parse(localStorage.getItem("orders"))||[];

    tbody.innerHTML="";

    if(orders.length===0){

        tbody.innerHTML=`

        <tr>

            <td colspan="8" class="text-center text-muted">

                No Orders Found

            </td>

        </tr>

        `;

        return;

    }

    orders.forEach((order,index)=>{

        tbody.innerHTML+=`

        <tr>

            <td>${order.receiptNo}</td>

            <td>${order.date}</td>

            <td class="text-center">

                ${order.items.length}

            </td>

            <td class="text-end">

                ₱${Number(order.total).toFixed(2)}

            </td>

           <td>

<select
class="form-select form-select-sm order-status"
data-index="${index}">

<option
value="Pending"
${order.status==="Pending"?"selected":""}>

Pending

</option>

<option
value="Preparing"
${order.status==="Preparing"?"selected":""}>

Preparing

</option>

<option
value="Ready"
${order.status==="Ready"?"selected":""}>

Ready

</option>

<option
value="Served"
${order.status==="Served"?"selected":""}>

Served

</option>

<option
value="Cancelled"
${order.status==="Cancelled"?"selected":""}>

Cancelled

</option>

</select>

</td>

            <td>${order.payment}</td>

            <td>${order.cashier}</td>

            <td class="text-center">

                <button
                class="btn btn-primary btn-sm btn-view-order"
                data-index="${index}">

                    <i class="fa-solid fa-eye"></i>

                </button>

            </td>

        </tr>

        `;

    });
    // ===============================================
// VIEW ORDER
// ===============================================

document.addEventListener("click",function(e){

    const btn = e.target.closest(".btn-view-order");

    if(!btn) return;

    const index = Number(btn.dataset.index);

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const order = orders[index];

    document.getElementById("viewReceiptNo").innerHTML = order.receiptNo;

    document.getElementById("viewDate").innerHTML = order.date;

    const tbody = document.getElementById("viewOrderItems");

    tbody.innerHTML = "";

    order.items.forEach(item=>{

        tbody.innerHTML += `

        <tr>

            <td>${item.name}</td>

            <td>${item.qty}</td>

            <td>₱${Number(item.price).toFixed(2)}</td>

            <td>₱${Number(item.price * item.qty).toFixed(2)}</td>

        </tr>

        `;

    });

    document.getElementById("viewGrandTotal").innerHTML =
        "₱" + Number(order.total).toFixed(2);

    const modal = new bootstrap.Modal(

        document.getElementById("orderViewModal")

    );

    modal.show();

});

}
// ===============================================
// UPDATE ORDER STATUS
// ===============================================

document.addEventListener("change",function(e){

    const select = e.target.closest(".order-status");

    if(!select) return;

    const index = Number(select.dataset.index);

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders[index].status = select.value;

    localStorage.setItem(

        "orders",

        JSON.stringify(orders)

    );

    loadOrders();

});
