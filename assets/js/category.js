// ===============================================
// LOZADA ERP
// CATEGORY MANAGEMENT
// ===============================================

// FIREBASE

const firebaseConfig = {

apiKey:"AIzaSyAV9T5w_1azmPHIJcZpraXP06TItj7HEuA",

authDomain:"papprito-orders.firebaseapp.com",

databaseURL:"https://papprito-orders-default-rtdb.firebaseio.com",

projectId:"papprito-orders",

storageBucket:"papprito-orders.firebasestorage.app",

messagingSenderId:"831941801424",

appId:"1:831941801424:web:40a99cdfb312dac2d275d5"

};

if(!firebase.apps.length){

firebase.initializeApp(firebaseConfig);

}

const db=firebase.database();

// ---------- COMPONENT LOADER ----------

async function loadComponent(id, file){

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

document.addEventListener("DOMContentLoaded", async()=>{

    await loadComponent("sidebar","../components/sidebar.html");

    await loadComponent("navbar","../components/navbar.html");

    await loadComponent("category-form","../components/category-form.html");

    await loadComponent("category-table","../components/category-table.html");

    loadCategoryTable();

    generateCategoryCode();

});
// ===============================================
// SAVE CATEGORY (LOCAL STORAGE)
// ===============================================

let categories = JSON.parse(localStorage.getItem("categories")) || [];
let editIndex = -1;
document.addEventListener("click", function(e){

    const btn = e.target.closest("#btnSaveCategory");

    if(!btn) return;

    const code = document.getElementById("categoryCode").value.trim();

    const name = document.getElementById("categoryName").value.trim();

    const description = document.getElementById("categoryDescription").value.trim();

    const status = document.getElementById("categoryStatus").value;

    if(name===""){

        alert("Category Name is required.");

        return;

    }

    db.ref("categories/"+code).set({

    code:code,

    name:name,

    description:description,

    status:status,

    createdAt:Date.now()

}).then(()=>{

    alert("Category saved successfully.");

    loadCategoryTable();

    clearCategoryForm();

});
});
// ===============================================
// LOAD CATEGORY TABLE
// ===============================================

function loadCategoryTable(){

const tableBody =
document.getElementById("categoryTableBody");

if(!tableBody) return;

db.ref("categories").on("value",snapshot=>{

tableBody.innerHTML="";

categories=[];

if(!snapshot.exists()){

tableBody.innerHTML=`

<tr>

<td colspan="5"
class="text-center text-muted">

No Category Found

</td>

</tr>

`;

return;

}

snapshot.forEach(child=>{

const category=child.val();

categories.push(category);

tableBody.innerHTML+=`

<tr>

<td>${category.code}</td>

<td>${category.name}</td>

<td>${category.description}</td>

<td>

<span class="badge ${category.status==="Active"?"bg-success":"bg-secondary"}">

${category.status}

</span>

</td>

<td>

<button
class="btn btn-warning btn-sm btn-edit"
data-code="${category.code}">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="btn btn-danger btn-sm btn-delete"
data-code="${category.code}">

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>

`;

});

});

}
// ===============================================
// AUTO CATEGORY CODE
// ===============================================

function generateCategoryCode(){

    const categories = JSON.parse(localStorage.getItem("categories")) || [];

    const nextNumber = categories.length + 1;

    const code = "CAT-" + String(nextNumber).padStart(4,"0");

    document.getElementById("categoryCode").value = code;

}
// ===============================================
// EDIT CATEGORY
// ===============================================

document.addEventListener("click", function(e){

    const btn = e.target.closest(".btn-edit");

    if(!btn) return;

    editIndex = Number(btn.dataset.index);

    const category = categories[editIndex];

    document.getElementById("categoryCode").value = category.code;

    document.getElementById("categoryName").value = category.name;

    document.getElementById("categoryDescription").value = category.description;

    document.getElementById("categoryStatus").value = category.status;

});
// ===============================================
// UPDATE CATEGORY
// ===============================================

document.addEventListener("click", function(e){

    const btn = e.target.closest("#btnUpdateCategory");

    if(!btn) return;

    if(editIndex === -1){

        alert("Please select a category first.");

        return;

    }

    const code = document.getElementById("categoryCode").value.trim();

    const name = document.getElementById("categoryName").value.trim();

    const description = document.getElementById("categoryDescription").value.trim();

    const status = document.getElementById("categoryStatus").value;

    if(name===""){

        alert("Category Name is required.");

        return;

    }

    categories[editIndex] = {

        code,

        name,

        description,

        status

    };

    localStorage.setItem(

        "categories",

        JSON.stringify(categories)

    );

    alert("Category updated successfully.");

    loadCategoryTable();

    clearCategoryForm();

});
// ===============================================
// CLEAR CATEGORY FORM
// ===============================================

function clearCategoryForm(){

    editIndex = -1;

    document.getElementById("categoryName").value = "";

    document.getElementById("categoryDescription").value = "";

    document.getElementById("categoryStatus").value = "Active";

    generateCategoryCode();

}
// ===============================================
// DELETE CATEGORY
// ===============================================

document.addEventListener("click",function(e){

const btn=e.target.closest(".btn-delete");

if(!btn) return;

const code=btn.dataset.code;

const confirmDelete=confirm(
"Are you sure you want to delete this category?"
);

if(!confirmDelete) return;

db.ref("categories/"+code)
.remove()
.then(()=>{

alert("Category deleted successfully.");

});

});
