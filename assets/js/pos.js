// ===============================================
// LOZADA ERP POS
// pos.js
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

// ---------- COMPONENT LOADER ----------

async function loadComponent(id, file) {

    try {

        const response = await fetch(file);

        if (!response.ok) {
            throw new Error("Cannot load " + file);
        }

        const html = await response.text();

        const element = document.getElementById(id);

        if (element) {
            element.innerHTML = html;
        }

    } catch (error) {

        console.error(error);

    }

}

// ---------- INITIALIZE ----------

document.addEventListener("DOMContentLoaded", async () => {

    await loadComponent("sidebar", "../components/sidebar.html");
    await loadComponent("navbar", "../components/navbar.html");
    await loadComponent("pos-header", "../components/pos-header.html");
    await loadComponent("pos-categories", "../components/pos-categories.html");
    await loadComponent("pos-products", "../components/pos-products.html");
    await loadComponent("pos-cart", "../components/pos-cart.html");
    await loadComponent("pos-payment", "../components/pos-payment.html");
   await loadComponent("receipt-modal", "../components/receipt-modal.html");
loadPOSProducts();

loadPOSCategories();

updateClock();

setInterval(updateClock,1000);

setReceiptDate();
loadSelectedTable();
loadCustomerOrder();
checkPaymentMode();
});

// ---------- LIVE CLOCK ----------

function updateClock(){

    const now=new Date();

    const date=document.getElementById("currentDate");

    const time=document.getElementById("currentTime");

    if(date){

        date.innerHTML=now.toLocaleDateString();

    }

    if(time){

        time.innerHTML=now.toLocaleTimeString();

    }

}

// ---------- RECEIPT DATE ----------

function setReceiptDate(){

    const receipt=document.getElementById("receiptDate");

    if(receipt){

        receipt.innerHTML=new Date().toLocaleString();

    }

}

// ===============================================
// CATEGORY ACTIVE
// ===============================================

document.addEventListener("click", function(e){

    const button = e.target.closest(".category-btn");

    if(!button) return;

    document.querySelectorAll(".category-btn").forEach(btn=>{

        btn.classList.remove("active");

    });

    button.classList.add("active");

});

// ===============================================
// SEARCH PRODUCT
// ===============================================

document.addEventListener("input",function(e){

    if(e.target.id!=="searchProduct") return;

    const keyword=e.target.value.toLowerCase();

    document.querySelectorAll(".product-card").forEach(card=>{

        const name=card.querySelector("h5").innerText.toLowerCase();

        card.style.display=name.includes(keyword)?"block":"none";

    });

});

// ===============================================
// SHOPPING CART
// ===============================================

let cart = [];

document.addEventListener("click", function(e){

    const button = e.target.closest(".add-cart");

    if(!button) return;

    const card = button.closest(".product-card");

    const name = card.querySelector("h5").innerText;

    const price = parseFloat(
        card.querySelector(".price")
        .innerText.replace("₱","")
    );

    const item = cart.find(p => p.name === name);

    if(item){

        item.qty++;

    }else{

        cart.push({
            name: name,
            price: price,
            qty: 1,
            image: card.querySelector("img").src
        });

    }

    renderCart();

    updatePendingOrder();

});

// ---------- RENDER CART ----------

function renderCart(){

    const cartItems = document.getElementById("cartItems");

    if(!cartItems) return;

    if(cart.length===0){

       cartItems.innerHTML = `
<tr>
    <td colspan="5">

        <div class="empty-cart">

            <i class="fa-solid fa-cart-shopping"></i>

            <h4>Your Shopping Cart is Empty</h4>

            <p>
                Add products from the menu to start a new order.
            </p>

        </div>

    </td>
</tr>
`;

        updateTotals(0);

        return;

    }

    let html="";

    let subtotal=0;

    cart.forEach((item,index)=>{

        const lineTotal=item.price*item.qty;

        subtotal+=lineTotal;

        html+=`

        <tr>

           <td>

    <div class="cart-product">

        <img
        src="${item.image}"
        class="cart-image"
        alt="${item.name}">

        <div class="cart-details">

            <div class="cart-name">
                ${item.name}
            </div>

            <div class="cart-note">
                Special Instructions
            </div>

        </div>

    </div>

</td>

            <td>

                <div class="qty-control">

                    <button class="qty-minus" data-index="${index}">-</button>

                    <span>${item.qty}</span>

                    <button class="qty-plus" data-index="${index}">+</button>

                </div>

            </td>

            <td class="text-end">

                ₱${item.price.toFixed(2)}

            </td>

            <td class="text-end">

                <strong>

                    ₱${lineTotal.toFixed(2)}

                </strong>

            </td>

            <td class="text-center">

                <button
                    class="btn btn-danger btn-sm remove-item"
                    data-index="${index}">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

    cartItems.innerHTML=html;

    updateTotals(subtotal);

}
// ---------- TOTALS ----------

function updateTotals(subtotal){

    const vat=subtotal*0.12;

   let total = subtotal + vat;

const discountSelect = document.getElementById("discountType");

let discountPercent = 0;

if(discountSelect){

    discountPercent = Number(discountSelect.value);

}

const discountAmount = total * (discountPercent / 100);

total = total - discountAmount;
// ===============================================
// SERVICE CHARGE
// ===============================================

const serviceSelect = document.getElementById("serviceCharge");

let servicePercent = 0;

if(serviceSelect){

    servicePercent = Number(serviceSelect.value);

}

const serviceAmount = total * (servicePercent / 100);

total += serviceAmount;
    document.getElementById("subtotal").innerHTML="₱"+subtotal.toFixed(2);

    document.getElementById("vat").innerHTML="₱"+vat.toFixed(2);

    document.getElementById("grandTotal").innerHTML="₱"+total.toFixed(2);

    document.getElementById("cartCount").innerHTML=cart.length+" Item(s)";

    const totalInput=document.getElementById("totalAmount");

    if(totalInput){

        totalInput.value=total.toFixed(2);

    }
// ===============================================
// ORDER SUMMARY
// ===============================================

const summaryItems = document.getElementById("summaryItems");

if(summaryItems){

    summaryItems.innerHTML = cart.reduce((sum,item)=>sum + item.qty,0);

}

const summarySubtotal = document.getElementById("summarySubtotal");

if(summarySubtotal){

    summarySubtotal.innerHTML = "₱" + subtotal.toFixed(2);

}

const summaryVat = document.getElementById("summaryVat");

if(summaryVat){

    summaryVat.innerHTML = "₱" + vat.toFixed(2);

}

const summaryDiscount = document.getElementById("summaryDiscount");

if(summaryDiscount){

   summaryDiscount.innerHTML =
"₱" + discountAmount.toFixed(2);
}

const summaryGrandTotal = document.getElementById("summaryGrandTotal");

if(summaryGrandTotal){

    summaryGrandTotal.innerHTML = "₱" + total.toFixed(2);

}
}
// ===============================================
// COMPUTE CHANGE
// ===============================================

document.addEventListener("click",function(e){

    if(e.target.id!=="btnCompute") return;

    const total=parseFloat(document.getElementById("totalAmount").value)||0;

    const cash=parseFloat(document.getElementById("cashReceived").value)||0;

   let change=0;

if(cash>=total){

    change=cash-total;

}

document.getElementById("changeAmount").value=change.toFixed(2);

});
// ======================================
// PLUS / MINUS / DELETE
// ======================================

document.addEventListener("click",function(e){

    // PLUS

    if(e.target.classList.contains("qty-plus")){

        const index=e.target.dataset.index;

      cart[index].qty++;

renderCart();

updatePendingOrder();

    }

    // MINUS

    if(e.target.classList.contains("qty-minus")){

        const index=e.target.dataset.index;

        cart[index].qty--;

        if(cart[index].qty<=0){

            cart.splice(index,1);

        }

        renderCart();
updatePendingOrder();

    }

    // DELETE

    if(e.target.closest(".remove-item")){

        const index=e.target.closest(".remove-item").dataset.index;

       cart.splice(index,1);

renderCart();
updatePendingOrder();

    }

});
document.addEventListener("click", function(e){

    const btn = e.target.closest("#btnSendKitchen");
// Clear cart after sending to kitchen

    if(!btn) return;
console.log("STEP 1 - Send to Kitchen button clicked");
    if(cart.length===0){

        alert("Shopping Cart is empty.");

        return;

    }

    const receiptNo = Math.floor(Math.random() * 900000) + 100000;

    const grandTotal = parseFloat(
        document.getElementById("totalAmount").value
    ) || 0;
console.log("STEP 2 - About to save order");
   saveOrder(receiptNo, grandTotal);
console.log("STEP 3 - Order saved");
alert("Order sent to Kitchen.");
    cart = [];
renderCart();

// Huwag muna i-clear ang cart.
// Ika-clear natin ito pagkatapos ng successful payment.

// cart = [];
// renderCart();

});
// ======================================
// GENERATE RECEIPT
// ======================================

function generateReceipt(){

    const receiptItems=document.getElementById("receiptItems");

    receiptItems.innerHTML="";

    let subtotal=0;

    cart.forEach(item=>{

        const total=item.price*item.qty;

        subtotal+=total;

        receiptItems.innerHTML+=`

        <tr>

            <td>${item.name}</td>

            <td>${item.qty}</td>

            <td style="text-align:right;">

                ₱${total.toFixed(2)}

            </td>

        </tr>

        `;

    });

   const vat = subtotal * 0.12;

let total = subtotal + vat;

// Discount

const discountSelect = document.getElementById("discountType");

let discountPercent = 0;

if(discountSelect){

    discountPercent = Number(discountSelect.value);

}

const discountAmount = total * (discountPercent / 100);

total -= discountAmount;

// Service Charge

const serviceSelect = document.getElementById("serviceCharge");

let servicePercent = 0;

if(serviceSelect){

    servicePercent = Number(serviceSelect.value);

}

const serviceAmount = total * (servicePercent / 100);
const summaryServiceCharge = document.getElementById("summaryServiceCharge");

if(summaryServiceCharge){

    summaryServiceCharge.innerHTML =
    "₱" + serviceAmount.toFixed(2);

}
total += serviceAmount;

const grandTotal = total;

    document.getElementById("receiptSubtotal").innerHTML=
    "₱"+subtotal.toFixed(2);

    document.getElementById("receiptVat").innerHTML=
    "₱"+vat.toFixed(2);
    
    document.getElementById("receiptDiscount").innerHTML =
"-₱" + discountAmount.toFixed(2);

document.getElementById("receiptServiceCharge").innerHTML =
"₱" + serviceAmount.toFixed(2);

    document.getElementById("receiptGrandTotal").innerHTML=
    "₱"+grandTotal.toFixed(2);

   document.getElementById("receiptDate").innerHTML =
new Date().toLocaleString();
// ===============================================
// RECEIPT TABLE INFORMATION
// ===============================================

const selectedTable = JSON.parse(

    localStorage.getItem("selectedTable")

) || {};

document.getElementById("receiptFloor").innerHTML =

selectedTable.floor || "-";

document.getElementById("receiptTable").innerHTML =

selectedTable.table || "-";

const customerOrder = JSON.parse(

    localStorage.getItem("customerOrder")

) || {};

document.getElementById("receiptCustomer").innerHTML =

customerOrder.name ||

selectedTable.customer ||

"Walk-in";

document.getElementById("receiptGuests").innerHTML =

selectedTable.guests || "1";

document.getElementById("receiptServer").innerHTML =

selectedTable.server || "-";
    
// ===============================================
// COMPANY PROFILE
// ===============================================

const company = JSON.parse(

    localStorage.getItem("companyProfile")

) || {};

document.getElementById("receiptCompanyName").innerHTML =
company.name || "LOZADA ERP";

document.getElementById("receiptCompanyAddress").innerHTML =
company.address || "";

document.getElementById("receiptCompanyContact").innerHTML =
company.contact || "";

document.getElementById("receiptCompanyTIN").innerHTML =
company.tin ? "TIN : " + company.tin : "";
document.getElementById("receiptCompanyLogo").src =

company.logo ||

"https://via.placeholder.com/120x120?text=LOGO";
    const receiptNo=Math.floor(Math.random()*900000)+100000;

    document.getElementById("receiptNo").innerHTML=
    receiptNo;

    const modal=new bootstrap.Modal(

        document.getElementById("receiptModal")

    );

    modal.show();

}

// ===============================================
// LOAD PRODUCTS FROM PRODUCT MODULE
// ===============================================

function loadPOSProducts(){

    const grid = document.getElementById("productsGrid");

    if(!grid) return;

    db.ref("products").on("value", snapshot=>{

        grid.innerHTML="";

        if(!snapshot.exists()){

            grid.innerHTML=`
            <div class="alert alert-warning">
                No Products Available
            </div>
            `;
            return;

        }

        snapshot.forEach(child=>{

            const product = child.val();

            // Active products only
            if(product.status !== "Active") return;

            // Category Filter
            if(window.currentCategory){

                if(window.currentCategory !== "All"){

                    if(product.category !== window.currentCategory){

                        return;

                    }

                }

            }

            const image =
                product.image && product.image !== ""
                ? product.image
                : "https://via.placeholder.com/300x220?text=No+Image";

            grid.innerHTML += `

            <div class="product-card">

                <img src="${image}" alt="${product.name}">

                <div class="product-info">

                    <span class="badge bg-primary">

                        ${product.category}

                    </span>

                    <h5>${product.name}</h5>

                    <p class="price">

                        ₱${Number(product.sellingPrice).toFixed(2)}

                    </p>

                    <button
                    class="btn btn-warning w-100 add-cart">

                        <i class="fa-solid fa-cart-plus"></i>

                        Add to Cart

                    </button>

                </div>

            </div>

            `;

        });

    });

}
// ===============================================
// LOAD POS CATEGORIES
// ===============================================

function loadPOSCategories(){

    const container = document.getElementById("categoryButtons");

    if(!container) return;

    db.ref("categories").on("value", snapshot=>{

        container.innerHTML = `
        <button
        class="btn btn-dark category-btn active"
        data-category="All">
            All
        </button>
        `;

        snapshot.forEach(child=>{

            const category = child.val();

            if(category.status !== "Active") return;

            container.innerHTML += `
            <button
            class="btn btn-outline-dark category-btn"
            data-category="${category.name}">
                ${category.name}
            </button>
            `;

        });

    });

}
// ===============================================
// CATEGORY FILTER
// ===============================================

window.currentCategory="All";

document.addEventListener("click",function(e){

    const btn=e.target.closest(".category-btn");

    if(!btn) return;

    document.querySelectorAll(".category-btn").forEach(button=>{

        button.classList.remove("active");

    });

    btn.classList.add("active");

    window.currentCategory=btn.dataset.category;

    loadPOSProducts();

});
// ===============================================
// SAVE ORDER
// ===============================================

function saveOrder(receiptNo, total){

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    const table = JSON.parse(localStorage.getItem("selectedTable")) || {};
const customerOrder = JSON.parse(

    localStorage.getItem("customerOrder")

) || {};
    // Hanapin kung may existing unpaid order
    const existingOrder = orders.find(order =>

        order.floor === table.floor &&
        order.table === table.table &&
        order.status !== "Paid"

    );

    if(existingOrder){

        // idagdag ang bagong items

        cart.forEach(newItem=>{

            const oldItem = existingOrder.items.find(item=>

                item.name === newItem.name

            );

            if(oldItem){

                oldItem.qty += newItem.qty;

            }else{

                existingOrder.items.push({...newItem});

            }

        });

        // update total

        // Recompute total
existingOrder.total = existingOrder.items.reduce((sum, item) => {

    return sum + (Number(item.price) * Number(item.qty));

}, 0);

// Update date
existingOrder.date = new Date().toLocaleString();

    }else{

        // gumawa ng bagong order

        orders.push({

            receiptNo: receiptNo,

            date: new Date().toLocaleString(),

            items: [...cart],

            total: total,

            status: "Pending",

            payment: "",

            cashier: "Administrator",

            floor: table.floor || "",

            table: table.table || "",

           customer:

customerOrder.name ||

table.customer ||

"Walk-in",

            guests: table.guests || 1,

            server: table.server || ""

        });

    }

    localStorage.setItem(

        "orders",

        JSON.stringify(orders)

    );

}
// ===============================================
// UPDATE PENDING ORDER
// ===============================================

function updatePendingOrder(){

    const table = JSON.parse(
        localStorage.getItem("selectedTable")
    );

    if(!table) return;

    let orders = JSON.parse(
        localStorage.getItem("orders")
    ) || [];

    const order = orders.find(order =>

        order.floor === table.floor &&
        order.table === table.table &&
        order.status === "Pending"

    );

    if(!order) return;

    order.items = [...cart];

    order.total = cart.reduce((sum,item)=>{

        return sum + (item.price * item.qty);

    },0);

    order.date = new Date().toLocaleString();

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

}

// ===============================================
// LOAD SELECTED TABLE
// ===============================================

function loadSelectedTable(){

    const info = document.getElementById("selectedTableInfo");

    if(!info) return;

    const table = JSON.parse(

        localStorage.getItem("selectedTable")

    );

    if(!table){

        return;

    }

    info.classList.remove("d-none");

    document.getElementById("selectedFloor").innerHTML =
        table.floor;

    document.getElementById("selectedTable").innerHTML =
        table.table;
document.getElementById("selectedCustomer").innerHTML =
table.customer || "Walk-in";

document.getElementById("selectedGuests").innerHTML =
table.guests || 1;

document.getElementById("selectedServer").innerHTML =
table.server || "-";
// PAYMENT PANEL

document.getElementById("paymentFloor").innerHTML =
table.floor || "-";

document.getElementById("paymentTable").innerHTML =
table.table || "-";

document.getElementById("paymentCustomer").innerHTML =
table.customer || "Walk-in";

document.getElementById("paymentGuests").innerHTML =
table.guests || 1;

document.getElementById("paymentServer").innerHTML =
table.server || "-";

    // ===============================================
// CUSTOMER ORDER INFORMATION
// ===============================================

const customerOrder = JSON.parse(

    localStorage.getItem("customerOrder")

) || {};

const customerInfo = document.getElementById("selectedCustomer");

if(customerInfo && customerOrder.name){

    customerInfo.innerHTML = customerOrder.name;

}

const paymentCustomer = document.getElementById("paymentCustomer");

if(paymentCustomer && customerOrder.name){

    paymentCustomer.innerHTML = customerOrder.name;

}
    // ======================================
// LOAD EXISTING PENDING ORDER
// ======================================

let orders = JSON.parse(localStorage.getItem("orders")) || [];

const existingOrder = orders.find(order =>

    order.floor === table.floor &&

    order.table === table.table &&

    order.status === "Pending"

);

if(existingOrder){

    cart = [...existingOrder.items];

    renderCart();

}
}

// ======================================
// RECEIVE PAYMENT
// ======================================

document.addEventListener("click", function(e){

    const btn = e.target.closest("#btnReceivePayment");

    if(!btn) return;

    if(cart.length === 0){

        alert("Shopping Cart is empty.");

        return;

    }

    const paymentMethod = document.getElementById("paymentMethod").value;

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    const selectedTable = JSON.parse(localStorage.getItem("selectedTable"));

    const orderIndex = orders
    .map((order, index) => ({ order, index }))
   .filter(item =>
    item.order.floor === selectedTable.floor &&
    item.order.table === selectedTable.table &&
    item.order.status !== "Paid"
)
    .pop()?.index ?? -1;
    if(orderIndex >= 0){

        orders[orderIndex].payment = paymentMethod;

        orders[orderIndex].status = "Paid";

        orders[orderIndex].paidDate = new Date().toISOString();

        localStorage.setItem(

            "orders",

            JSON.stringify(orders)

        );

    }else{

        console.error("Order not found for payment.");

    }

    generateReceipt();

});
// ===============================================
// PRINT BILL
// ===============================================

document.addEventListener("click", function(e){

    const btn = e.target.closest("#btnPrintBill");

    if(!btn) return;

    generateBill();

});
// ===============================================
// GENERATE BILL
// ===============================================

function generateBill(){

    document.getElementById("billDate").innerHTML =
    new Date().toLocaleString();
const table = JSON.parse(
    localStorage.getItem("selectedTable")
) || {};
    document.getElementById("billTable").innerHTML =
    table.table || "-";

    document.getElementById("billCustomer").innerHTML =
    table.customer || "Walk-in";

    const tbody = document.getElementById("billItems");

    tbody.innerHTML = "";

    let total = 0;

    cart.forEach(item=>{

        const lineTotal = item.price * item.qty;

        total += lineTotal;

        tbody.innerHTML += `

        <tr>

            <td>${item.name}</td>

            <td>${item.qty}</td>

            <td class="text-end">

                ₱${lineTotal.toFixed(2)}

            </td>

        </tr>

        `;

    });

    const vat = total * 0.12;

    const grandTotal = total + vat;

    document.getElementById("billGrandTotal").innerHTML =
    "₱" + grandTotal.toFixed(2);

    const modal = new bootstrap.Modal(

        document.getElementById("billModal")

    );

    modal.show();

}
// ===============================================
// DISCOUNT CHANGE
// ===============================================

document.addEventListener("change", function(e){

    if(e.target.id !== "discountType") return;

    let subtotal = 0;

    cart.forEach(item=>{

        subtotal += item.price * item.qty;

    });

    updateTotals(subtotal);

});
// ===============================================
// SERVICE CHARGE CHANGE
// ===============================================

document.addEventListener("change", function(e){

    if(e.target.id !== "serviceCharge") return;

    let subtotal = 0;

    cart.forEach(item=>{

        subtotal += item.price * item.qty;

    });

    updateTotals(subtotal);

});
// ===============================================
// PAYMENT MODE
// ===============================================

function checkPaymentMode(){

    const paymentMode = localStorage.getItem("paymentMode");

    if(paymentMode !== "true") return;

    localStorage.removeItem("paymentMode");

    const paymentPanel = document.querySelector(".payment-panel");

    if(paymentPanel){

        paymentPanel.scrollIntoView({

            behavior:"smooth",

            block:"start"

        });

    }

    document.getElementById("cashReceived")?.focus();

    const paymentTable = JSON.parse(
        localStorage.getItem("paymentTable")
    );

    if(!paymentTable) return;

    const orders = JSON.parse(
        localStorage.getItem("orders")
    ) || [];

    const order = orders.find(order =>

        order.floor === paymentTable.floor &&

        order.table === paymentTable.table &&

        order.status !== "Paid"

    );

    if(order){

        cart = [...order.items];

        renderCart();

    }else{

        alert("No pending order found.");

    }

}
function printReceipt(){

    const receipt = document.getElementById("receiptContent").innerHTML;

    const printWindow = window.open("", "", "width=400,height=700");

    printWindow.document.write(`
        <html>
        <head>
            <title>Official Receipt</title>

            <style>

                body{
                    font-family: Arial, sans-serif;
                    padding:15px;
                    font-size:12px;
                }

                table{
                    width:100%;
                    border-collapse:collapse;
                }

                th, td{
                    padding:4px;
                    font-size:12px;
                }

                .receipt{
                    width:80mm;
                    margin:auto;
                }

            </style>

        </head>

        <body>

            ${receipt}

        </body>

        </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    printWindow.print();

    printWindow.close();

}
// ===============================================
// PRINT OFFICIAL RECEIPT
// ===============================================

document.addEventListener("click", function(e){

    const btn = e.target.closest("#btnPrintReceipt");

    if(!btn) return;

    printReceipt();

    setTimeout(function(){

        completePayment();

    },500);

});
// ===============================================
// COMPLETE PAYMENT
// ===============================================

function completePayment(){

    const selectedTable = JSON.parse(

        localStorage.getItem("selectedTable")

    );

    if(!selectedTable) return;

    let tables = JSON.parse(

        localStorage.getItem("restaurantTables")

    ) || [];

    const index = tables.findIndex(table=>

        table.floor === selectedTable.floor &&

        table.name === selectedTable.table

    );

    if(index >= 0){

        tables[index].status = "Available";

        tables[index].customer = "";

        tables[index].guests = "";

        tables[index].server = "";

        tables[index].orderNo = "";

    }

    localStorage.setItem(

        "restaurantTables",

        JSON.stringify(tables)

    );

    cart = [];

    renderCart();

    localStorage.removeItem("selectedTable");

    alert("Payment completed successfully!");

    window.location.href = "tables.html";

}
// ===============================================
// RECEIPT CLOSED
// ===============================================

document.addEventListener("hidden.bs.modal", function(e){

    if(e.target.id !== "receiptModal") return;

    completePayment();

});
// ===============================================
// LOAD CUSTOMER ORDER
// ===============================================

function loadCustomerOrder(){

    const info = document.getElementById("customerOrderInfo");

    if(!info) return;

    const customer = JSON.parse(
        localStorage.getItem("customerOrder")
    );

    if(!customer) return;

    info.classList.remove("d-none");

    document.getElementById("customerOrderType").innerHTML =
        customer.orderType || "-";

    document.getElementById("customerOrderName").innerHTML =
        customer.name || "-";

    document.getElementById("customerOrderPhone").innerHTML =
        customer.phone || "-";

    document.getElementById("customerOrderSource").innerHTML =
        customer.orderSource || "-";

    document.getElementById("customerOrderAddress").innerHTML =
        customer.address || "-";

    document.getElementById("customerOrderPartner").innerHTML =
        customer.partner || "-";

    document.getElementById("customerOrderFee").innerHTML =
        Number(customer.fee || 0).toFixed(2);

}
