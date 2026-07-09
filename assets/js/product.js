// ===============================================
// LOZADA ERP
// PRODUCT MANAGEMENT
// ===============================================

// ===============================================
// PRODUCT DATA
// ===============================================

let products = JSON.parse(localStorage.getItem("products")) || [];

let editProductIndex = -1;

let selectedImage = "";

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
// LOAD CATEGORY DROPDOWN (FIREBASE)
// ===============================================

function loadCategoryDropdown(){

const categorySelect = document.getElementById("productCategory");

if(!categorySelect) return;

db.ref("categories").on("value",snapshot=>{

categorySelect.innerHTML="";

if(!snapshot.exists()){

categorySelect.innerHTML=`
<option value="">
No Category Available
</option>
`;

return;

}

categorySelect.innerHTML=`
<option value="">
-- Select Category --
</option>
`;

snapshot.forEach(child=>{

const category = child.val();

if(category.status==="Active"){

categorySelect.innerHTML+=`

<option value="${category.name}">

${category.name}

</option>

`;

}

});

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

    image:selectedImage

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
selectedImage="";

document.getElementById("imagePreview").src=

"https://via.placeholder.com/180x180?text=No+Image";
    editProductIndex = -1;

    document.getElementById("productCategory").value = "";

    document.getElementById("productName").value = "";

    document.getElementById("sellingPrice").value = "";

    document.getElementById("costPrice").value = "";

    document.getElementById("barcode").value = "";

    document.getElementById("productDescription").value = "";

    document.getElementById("productStatus").value = "Active";

    document.getElementById("productImage").value = "";

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

        <td>

            <img
            src="${product.image || 'https://via.placeholder.com/55x55?text=No+Image'}"
            style="
                width:55px;
                height:55px;
                object-fit:cover;
                border-radius:8px;
                border:1px solid #ddd;">

        </td>

        <td>${product.code}</td>

        <td>${product.category}</td>

        <td>

            <strong>${product.name}</strong>

        </td>

        <td class="text-end">

            ₱${Number(product.sellingPrice).toFixed(2)}

        </td>

        <td>

            <span class="badge ${product.status==="Active" ? "bg-success" : "bg-secondary"}">

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
selectedImage = product.image || "";

document.getElementById("imagePreview").src =
    selectedImage ||
    "https://via.placeholder.com/180x180?text=No+Image";
});
// ===============================================
// UPDATE PRODUCT
// ===============================================

document.addEventListener("click", function(e){

    const btn = e.target.closest("#btnUpdateProduct");

    if(!btn) return;

    if(editProductIndex === -1){

        alert("Please select a product first.");

        return;

    }

    const code = document.getElementById("productCode").value;

    const category = document.getElementById("productCategory").value;

    const name = document.getElementById("productName").value.trim();

    const sellingPrice = parseFloat(document.getElementById("sellingPrice").value) || 0;

    const costPrice = parseFloat(document.getElementById("costPrice").value) || 0;

    const barcode = document.getElementById("barcode").value.trim();

    const description = document.getElementById("productDescription").value.trim();

    const status = document.getElementById("productStatus").value;

   products[editProductIndex] = {

    code,

    category,

    name,

    sellingPrice,

    costPrice,

    barcode,

    description,

    status,

    image:selectedImage

};

    localStorage.setItem("products", JSON.stringify(products));

    loadProductTable();

    clearProductForm();

    alert("Product updated successfully.");

});
// ===============================================
// DELETE PRODUCT
// ===============================================

document.addEventListener("click", function(e){

    const btn = e.target.closest(".btn-delete-product");

    if(!btn) return;

    const index = Number(btn.dataset.index);

    const confirmDelete = confirm(
        "Are you sure you want to delete this product?"
    );

    if(!confirmDelete) return;

    products.splice(index,1);

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

    loadProductTable();

    clearProductForm();

    alert("Product deleted successfully.");

});
// ===============================================
// SEARCH PRODUCT
// ===============================================

document.addEventListener("input", function(e){

    if(e.target.id !== "searchProduct") return;

    const keyword = e.target.value.toLowerCase();

    const rows = document.querySelectorAll("#productTableBody tr");

    rows.forEach(row=>{

        const text = row.innerText.toLowerCase();

        row.style.display = text.includes(keyword)
            ? ""
            : "none";

    });

});

// ===============================================
// IMAGE PREVIEW
// ===============================================

document.addEventListener("change",function(e){

    if(e.target.id!=="productImage") return;

    const file=e.target.files[0];

    if(!file) return;

    const reader=new FileReader();

    reader.onload=function(event){

        selectedImage=event.target.result;

        document.getElementById("imagePreview").src=selectedImage;

    };

    reader.readAsDataURL(file);

});
// ===============================================
// IMAGE URL PREVIEW
// ===============================================

document.addEventListener("input", function(e){

    if(e.target.id !== "productImageUrl") return;

    const url = e.target.value.trim();

    if(url === ""){

        document.getElementById("imagePreview").src =
            "https://via.placeholder.com/180x180?text=No+Image";

        selectedImage = "";

        return;

    }

    document.getElementById("imagePreview").src = url;

    selectedImage = url;

});
