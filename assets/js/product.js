// ===============================================
// LOZADA ERP
// PRODUCT MANAGEMENT
// ===============================================

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
