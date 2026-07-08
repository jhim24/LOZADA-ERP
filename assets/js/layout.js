// ======================================
// LOZADA ERP
// LAYOUT MANAGER
// ======================================

document.addEventListener("click", function(e){

    const btn = e.target.closest("#toggleSidebar");

    if(!btn) return;

    document.body.classList.toggle("sidebar-collapsed");

    localStorage.setItem(
        "sidebarCollapsed",
        document.body.classList.contains("sidebar-collapsed")
    );

});

document.addEventListener("DOMContentLoaded", function(){

    if(localStorage.getItem("sidebarCollapsed") === "true"){

        document.body.classList.add("sidebar-collapsed");

    }

});
