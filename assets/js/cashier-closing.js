// ===============================================
// LOZADA ERP
// CASHIER CLOSING REPORT
// ===============================================

// ===============================================
// COMPONENT LOADER
// ===============================================

async function loadComponent(id, file){

    try{

        const response = await fetch(file);

        if(!response.ok){

            throw new Error(file);

        }

        const html = await response.text();

        const element = document.getElementById(id);

        if(element){

            element.innerHTML = html;

        }

    }

    catch(error){

        console.error(

            "Unable to load component:",

            file,

            error

        );

    }

}

// ===============================================
// INITIALIZE PAGE
// ===============================================

document.addEventListener(

    "DOMContentLoaded",

    async()=>{

        await loadComponent(

            "sidebar",

            "../components/sidebar.html"

        );

        await loadComponent(

            "navbar",

            "../components/navbar.html"

        );

        await loadComponent(

            "closing-header",

            "../components/closing-header.html"

        );

        await loadComponent(

            "closing-info",

            "../components/closing-info.html"

        );

        await loadComponent(

            "closing-summary",

            "../components/closing-summary.html"

        );

        await loadComponent(

            "closing-payment",

            "../components/closing-payment.html"

        );

        await loadComponent(

            "closing-cash",

            "../components/closing-cash.html"

        );

        await loadComponent(

            "closing-denomination",

            "../components/closing-denomination.html"

        );

        await loadComponent(

            "closing-expenses",

            "../components/closing-expenses.html"

        );

        await loadComponent(

            "closing-notes",

            "../components/closing-notes.html"

        );

        await loadComponent(

            "closing-signature",

            "../components/closing-signature.html"

        );

        console.log(

            "Cashier Closing Report Loaded Successfully."

        );

    }

);
