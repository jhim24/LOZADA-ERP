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

                <span class="badge bg-warning">

                    ${order.status}

                </span>

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

}
