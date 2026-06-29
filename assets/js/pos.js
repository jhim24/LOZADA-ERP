// ======================================
// LOZADA ERP POS Loader
// ======================================

async function loadComponent(id, file) {
    try {
        const response = await fetch(file);

        if (!response.ok) throw new Error(file);

        document.getElementById(id).innerHTML =
            await response.text();

    } catch (err) {
        console.error(err);
    }
}

// LOAD COMPONENTS

loadComponent("sidebar","../components/sidebar.html");
loadComponent("navbar","../components/navbar.html");
loadComponent("pos-header","../components/pos-header.html");
loadComponent("pos-categories","../components/pos-categories.html");
loadComponent("pos-products","../components/pos-products.html");
loadComponent("pos-cart","../components/pos-cart.html");
loadComponent("pos-payment","../components/pos-payment.html");
loadComponent("receipt-modal","../components/receipt-modal.html");
