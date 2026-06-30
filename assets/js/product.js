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
