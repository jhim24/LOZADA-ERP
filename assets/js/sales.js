// ===============================================
// LOZADA ERP
// SALES REPORT
// ===============================================

// ---------- COMPONENT LOADER ----------

async function loadComponent(id,file){

    const response = await fetch(file);

    const html = await response.text();

    document.getElementById(id).innerHTML = html;

}

// ---------- INITIALIZE ----------

document.addEventListener("DOMContentLoaded", async()=>{

    await loadComponent("sidebar","../components/sidebar.html");

    await loadComponent("navbar","../components/navbar.html");

    await loadComponent("sales-header","../components/sales-header.html");

    await loadComponent("sales-content","../components/sales-content.html");

    loadSales();

});
