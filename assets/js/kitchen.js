// ===============================================
// LOZADA ERP
// KITCHEN DISPLAY
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

    await loadComponent("kitchen-header","../components/kitchen-header.html");

    await loadComponent("kitchen-board","../components/kitchen-board.html");

    loadKitchenOrders();

    updateKitchenClock();

    setInterval(updateKitchenClock,1000);

});
