// ===============================================
// LOZADA ERP POS
// pos.js
// ===============================================

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

let cart=[];

document.addEventListener("click",function(e){

    const button=e.target.closest(".add-cart");

    if(!button) return;

    const card=button.closest(".product-card");

    const name=card.querySelector("h5").innerText;

    const price=parseFloat(

        card.querySelector(".price")
        .innerText
        .replace("₱","")

    );

    const item=cart.find(p=>p.name===name);

    if(item){

        item.qty++;

    }else{

       const image = card.querySelector("img").src;

cart.push({

    name: name,

    price: price,

    qty: 1,

    image: image

});
    }

    renderCart();

});

// ---------- RENDER CART ----------

function renderCart(){

    const cartItems = document.getElementById("cartItems");

    if(!cartItems) return;

    if(cart.length===0){

        cartItems.innerHTML=`
        <tr>
            <td colspan="5" class="text-center text-muted">
                Cart is Empty
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

                    <div>

                        <strong>${item.name}</strong>

                        <br>

                        <small class="text-muted">

                            Special Instructions

                        </small>

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

    const total=subtotal+vat;

    document.getElementById("subtotal").innerHTML="₱"+subtotal.toFixed(2);

    document.getElementById("vat").innerHTML="₱"+vat.toFixed(2);

    document.getElementById("grandTotal").innerHTML="₱"+total.toFixed(2);

    document.getElementById("cartCount").innerHTML=cart.length+" Item(s)";

    const totalInput=document.getElementById("totalAmount");

    if(totalInput){

        totalInput.value=total.toFixed(2);

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

    }

    // MINUS

    if(e.target.classList.contains("qty-minus")){

        const index=e.target.dataset.index;

        cart[index].qty--;

        if(cart[index].qty<=0){

            cart.splice(index,1);

        }

        renderCart();

    }

    // DELETE

    if(e.target.closest(".remove-item")){

        const index=e.target.closest(".remove-item").dataset.index;

        cart.splice(index,1);

        renderCart();

    }

});
document.addEventListener("click", function(e){

    const btn = e.target.closest("#btnSendKitchen");

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

    const vat=subtotal*0.12;

    const grandTotal=subtotal+vat;

    document.getElementById("receiptSubtotal").innerHTML=
    "₱"+subtotal.toFixed(2);

    document.getElementById("receiptVat").innerHTML=
    "₱"+vat.toFixed(2);

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

document.getElementById("receiptCustomer").innerHTML =

selectedTable.customer || "Walk-in";

document.getElementById("receiptGuests").innerHTML =

selectedTable.guests || "1";

document.getElementById("receiptServer").innerHTML =

selectedTable.server || "-";
    
}

const paymentTable = document.getElementById("paymentTable");
if(paymentTable){
    paymentTable.innerHTML = table.table || "-";
}

const paymentCustomer = document.getElementById("paymentCustomer");
if(paymentCustomer){
    paymentCustomer.innerHTML = table.customer || "Walk-in";
}

const paymentGuests = document.getElementById("paymentGuests");
if(paymentGuests){
    paymentGuests.innerHTML = table.guests || 1;
}
    
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
saveOrder(receiptNo, grandTotal);
}

// ===============================================
// LOAD PRODUCTS FROM PRODUCT MODULE
// ===============================================

function loadPOSProducts(){

    const grid = document.getElementById("productsGrid");

    if(!grid) return;

    const products = JSON.parse(localStorage.getItem("products")) || [];

    grid.innerHTML = "";

    if(products.length===0){

        grid.innerHTML = `

        <div class="alert alert-warning">

            No Products Available

        </div>

        `;

        return;

    }

   products.forEach(product=>{

    if(product.status!=="Active") return;

    if(window.currentCategory){

        if(window.currentCategory!=="All"){

            if(product.category!==window.currentCategory){

                return;

            }

        }

    }

        if(product.status!=="Active") return;

        const image = product.image && product.image!=="" ?
            product.image :
            "https://via.placeholder.com/300x220?text=No+Image";

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

}
// ===============================================
// LOAD POS CATEGORIES
// ===============================================

function loadPOSCategories(){

    const container=document.getElementById("categoryButtons");

    if(!container) return;

    const categories=JSON.parse(localStorage.getItem("categories"))||[];

    container.innerHTML=`
        <button
        class="btn btn-dark category-btn active"
        data-category="All">

            All

        </button>
    `;

    categories.forEach(category=>{

        if(category.status!=="Active") return;

        container.innerHTML+=`

        <button
        class="btn btn-outline-dark category-btn"
        data-category="${category.name}">

            ${category.name}

        </button>

        `;

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

function saveOrder(receiptNo,total){

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

   const table = JSON.parse(

    localStorage.getItem("selectedTable")

) || {};

const order = {

    receiptNo: receiptNo,

    date: new Date().toLocaleString(),

    items: [...cart],

    total: total,

    status: "Pending",

    payment: "Cash",

    cashier: "Administrator",

    floor: table.floor || "",

    table: table.table || "",

    customer: table.customer || "Walk-in",

    guests: table.guests || 1,

    server: table.server || ""

};
    orders.push(order);

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
}

// ======================================
// RECEIVE PAYMENT
// ======================================

document.addEventListener("click", function(e){

    const btn = e.target.closest("#btnReceivePayment");

    if(!btn) return;

    if(cart.length===0){

        alert("Shopping Cart is empty.");

        return;

    }

    generateReceipt();

});
