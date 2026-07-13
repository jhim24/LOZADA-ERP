// ======================================
// LOZADA ERP
// LAYOUT MANAGER
// ======================================

function initLayout(){

    // ======================================
    // RESTORE SIDEBAR STATE
    // ======================================

    if(localStorage.getItem("sidebarCollapsed") === "true"){

        document.body.classList.add("sidebar-collapsed");

    }

    // ======================================
    // TOGGLE SIDEBAR
    // ======================================

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

    // ======================================
    // COLLAPSIBLE SIDEBAR
    // ======================================

    document.querySelectorAll(".menu-parent").forEach(parent=>{

        parent.addEventListener("click",function(e){

            e.preventDefault();

            const submenu = this.nextElementSibling;

            const arrow = this.querySelector(".submenu-arrow");

            if(!submenu) return;

            // Close all other menus

            document.querySelectorAll(".menu-parent").forEach(item=>{

                if(item !== this){

                    const otherSub = item.nextElementSibling;

                    const otherArrow = item.querySelector(".submenu-arrow");

                    if(otherSub){

                        otherSub.style.display = "none";

                    }

                    if(otherArrow){

                        otherArrow.style.transform = "rotate(0deg)";

                    }

                }

            });

            const menuName = this.querySelector("span").innerText;

            // Toggle current menu

            if(submenu.style.display === "block"){

                submenu.style.display = "none";

                localStorage.removeItem("openMenu");

                if(arrow){

                    arrow.style.transform = "rotate(0deg)";

                }

            }else{

                submenu.style.display = "block";

                localStorage.setItem("openMenu", menuName);

                if(arrow){

                    arrow.style.transform = "rotate(180deg)";

                }

            }

        });

    });

    // ======================================
    // RESTORE LAST OPEN MENU
    // ======================================

    const lastMenu = localStorage.getItem("openMenu");

    if(lastMenu){

        document.querySelectorAll(".menu-parent").forEach(parent=>{

            const title = parent.querySelector("span");

            if(title && title.innerText === lastMenu){

                const submenu = parent.nextElementSibling;

                const arrow = parent.querySelector(".submenu-arrow");

                if(submenu){

                    submenu.style.display = "block";

                }

                if(arrow){

                    arrow.style.transform = "rotate(180deg)";

                }

            }

        });

    }

}
// ======================================
// ACTIVE MENU
// ======================================

const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll(".menu a").forEach(link=>{

    const href = link.getAttribute("href");

    if(!href) return;

    if(href.endsWith(currentPage)){

        link.classList.add("active");

        const submenu = link.closest(".submenu");

        if(submenu){

            submenu.style.display = "block";

            const parent = submenu.previousElementSibling;

            if(parent){

                const arrow = parent.querySelector(".submenu-arrow");

                if(arrow){

                    arrow.style.transform = "rotate(180deg)";

                }

            }

        }

    }

});
// ======================================
// INITIALIZE
// ======================================

document.addEventListener("DOMContentLoaded",function(){

    initLayout();

});
