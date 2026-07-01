// ===============================================
// LOZADA ERP
// TABLE MANAGEMENT
// ===============================================

// ---------- COMPONENT LOADER ----------

async function loadComponent(id,file){

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

document.addEventListener("DOMContentLoaded",async()=>{

    await loadComponent("sidebar","../components/sidebar.html");

    await loadComponent("navbar","../components/navbar.html");

    await loadComponent("tables-header","../components/tables-header.html");

    await loadComponent("tables-content","../components/tables-content.html");

    await loadComponent("tables-card","../components/tables-card.html");

});
