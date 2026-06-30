// ===============================================
// LOZADA ERP
// PRODUCT MANAGEMENT
// ===============================================

// ===============================================
// PRODUCT DATA
// ===============================================

let products = JSON.parse(localStorage.getItem("products")) || [];

let editProductIndex = -1;
// ---------- COMPONENT LOADER ----------

async function loadComponent(id,file){

    try{

        const response=await fetch(file);

        if(!response.ok){

            throw new Error(file);

        }

        const html=await response.text();

        document.getElementById(id).innerHTML=html;

    }catch(err){

        console.error(err);

    }

}

// ---------- INITIALIZE ----------

document.addEventListener("DOMContentLoaded", async()=>{

    await loadComponent("sidebar","../components/sidebar.html");

    await loadComponent("navbar","../components/navbar.html");

    await loadComponent("product-form","../components/product-form.html");

    await loadComponent("product-table","../components/product-table.html");

   loadCategoryDropdown();

loadProductTable();

generateProductCode();

});
// ===============================================
// LOAD CATEGORY DROPDOWN
// ===============================================

function loadCategoryDropdown(){

    const categorySelect = document.getElementById("productCategory");

    if(!categorySelect) return;

    const categories = JSON.parse(localStorage.getItem("categories")) || [];

    categorySelect.innerHTML = "";

    if(categories.length===0){

        categorySelect.innerHTML = `
            <option value="">
                No Category Available
            </option>
        `;

        return;

    }

    categorySelect.innerHTML = `
        <option value="">
            -- Select Category --
        </option>
    `;

    categories.forEach(category=>{

        if(category.status==="Active"){

            categorySelect.innerHTML += `

                <option value="${category.name}">

                    ${category.name}

                </option>

            `;

        }

    });

}
// ===============================================
// SAVE PRODUCT
// ===============================================

document.addEventListener("click",function(e){

    const btn=e.target.closest("#btnSaveProduct");

    if(!btn) return;

    const code=document.getElementById("productCode").value;

    const category=document.getElementById("productCategory").value;

    const name=document.getElementById("productName").value.trim();

    const sellingPrice=parseFloat(document.getElementById("sellingPrice").value)||0;

    const costPrice=parseFloat(document.getElementById("costPrice").value)||0;

    const barcode=document.getElementById("barcode").value.trim();

    const description=document.getElementById("productDescription").value.trim();

    const status=document.getElementById("productStatus").value;

    if(category===""){

        alert("Please select category.");

        return;

    }

    if(name===""){

        alert("Please enter product name.");

        return;

    }

    products.push({

        code,

        category,

        name,

        sellingPrice,

        costPrice,

        barcode,

        description,

        status,

        image:""

    });

    localStorage.setItem(

        "products",

        JSON.stringify(products)

    );

    alert("Product saved successfully.");

    loadProductTable();

    clearProductForm();

});
// ===============================================
// PRODUCT CODE
// ===============================================

function generateProductCode(){

    const products=JSON.parse(localStorage.getItem("products")) || [];

    const next=products.length+1;

    document.getElementById("productCode").value=

        "PRD-"+String(next).padStart(4,"0");

}
// ===============================================
// CLEAR PRODUCT FORM
// ===============================================

function clearProductForm(){

    editProductIndex=-1;

    document.getElementById("productCategory").value="";

    document.getElementById("productName").value="";

    document.getElementById("sellingPrice").value="";

    document.getElementById("costPrice").value="";

    document.getElementById("barcode").value="";

    document.getElementById("productDescription").value="";

    document.getElementById("productStatus").value="Active";

    document.getElementById("productImage").value="";

    generateProductCode();

}
// ===============================================
// LOAD PRODUCT TABLE
// ===============================================

function loadProductTable(){

    const tableBody = document.getElementById("productTableBody");

    if(!tableBody) return;

    products = JSON.parse(localStorage.getItem("products")) || [];

    tableBody.innerHTML = "";

    if(products.length===0){

        tableBody.innerHTML = `

        <tr>

            <td colspan="6" class="text-center text-muted">

                No Products Found

            </td>

        </tr>

        `;

        return;

    }

    products.forEach((product,index)=>{

        tableBody.innerHTML += `

        <tr>

            <td>${product.code}</td>

            <td>${product.category}</td>

            <td>${product.name}</td>

            <td>₱${product.sellingPrice.toFixed(2)}</td>

            <td>

                <span class="badge ${product.status==="Active"?"bg-success":"bg-secondary"}">

                    ${product.status}

                </span>

            </td>

            <td>

                <button
                    class="btn btn-warning btn-sm btn-edit-product"
                    data-index="${index}">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="btn btn-danger btn-sm btn-delete-product"
                    data-index="${index}">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}
// ===============================================
// EDIT PRODUCT
// ===============================================

document.addEventListener("click", function(e){

    const btn = e.target.closest(".btn-edit-product");

    if(!btn) return;

    editProductIndex = Number(btn.dataset.index);

    const product = products[editProductIndex];

    document.getElementById("productCode").value = product.code;

    document.getElementById("productCategory").value = product.category;

    document.getElementById("productName").value = product.name;

    document.getElementById("sellingPrice").value = product.sellingPrice;

    document.getElementById("costPrice").value = product.costPrice;

    document.getElementById("barcode").value = product.barcode;

    document.getElementById("productDescription").value = product.description;

    document.getElementById("productStatus").value = product.status;

});
