// ===============================================
// LOZADA ERP
// CATEGORY MANAGEMENT
// ===============================================

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

});
// ===============================================
// SAVE CATEGORY (LOCAL STORAGE)
// ===============================================

let categories = JSON.parse(localStorage.getItem("categories")) || [];

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

    categories.push({

        code,

        name,

        description,

        status

    });

    localStorage.setItem(

        "categories",

        JSON.stringify(categories)

    );

    alert("Category saved successfully.");
loadCategoryTable();
});
// ===============================================
// LOAD CATEGORY TABLE
// ===============================================

function loadCategoryTable(){

    const tableBody = document.getElementById("categoryTableBody");

    if(!tableBody) return;

    categories = JSON.parse(localStorage.getItem("categories")) || [];

    tableBody.innerHTML = "";

    if(categories.length===0){

        tableBody.innerHTML=`

        <tr>

            <td colspan="5" class="text-center text-muted">

                No Category Found

            </td>

        </tr>

        `;

        return;

    }

    categories.forEach((category,index)=>{

        tableBody.innerHTML += `

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
                    data-index="${index}">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="btn btn-danger btn-sm btn-delete"
                    data-index="${index}">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}
