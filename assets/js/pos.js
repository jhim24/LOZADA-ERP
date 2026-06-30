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

    updateClock();

    setInterval(updateClock,1000);

    setReceiptDate();

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

document.addEventListener("click",function(e){

    const button = e.target.closest(".add-cart");

    if(!button) return;

    console.log("ADD TO CART CLICKED");

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
