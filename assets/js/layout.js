// ======================================
// LOZADA ERP
// LAYOUT MANAGER
// ======================================

function initLayout(){

    // Restore sidebar state
    if(localStorage.getItem("sidebarCollapsed") === "true"){

        document.body.classList.add("sidebar-collapsed");

    }

    // Toggle sidebar
    const btn = document.getElementById("toggleSidebar");

    if(btn){

        btn.onclick = function(){

            document.body.classList.toggle("sidebar-collapsed");

            localStorage.setItem(
                "sidebarCollapsed",
                document.body.classList.contains("sidebar-collapsed")
            );

        };

    }

}
