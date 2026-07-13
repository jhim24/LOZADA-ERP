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
// ===============================================
// COLLAPSIBLE SIDEBAR
// ===============================================

document.addEventListener("click", function(e){

    const parent = e.target.closest(".menu-parent");

    if(!parent) return;

    e.preventDefault();

    const submenu = parent.nextElementSibling;

    const arrow = parent.querySelector(".submenu-arrow");

    if(!submenu) return;

    if(submenu.style.display === "block"){

        submenu.style.display = "none";

        if(arrow){

            arrow.style.transform = "rotate(0deg)";

        }

    }else{

        submenu.style.display = "block";

        if(arrow){

            arrow.style.transform = "rotate(180deg)";

        }

    }

});
