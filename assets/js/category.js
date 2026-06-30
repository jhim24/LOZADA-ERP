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

});
