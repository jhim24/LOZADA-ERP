// ===============================================
// LOZADA ERP
// SETTINGS
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

    await loadComponent("settings-header","../components/settings-header.html");

    await loadComponent("settings-content","../components/settings-content.html");

    loadCompanyProfile();

});
// ===============================================
// SAVE COMPANY SETTINGS
// ===============================================

document.addEventListener("click",function(e){

    const btn = e.target.closest("#btnSaveSettings");

    if(!btn) return;

    const company = {

        name: document.getElementById("companyName").value,

        address: document.getElementById("companyAddress").value,

        contact: document.getElementById("companyContact").value,

        email: document.getElementById("companyEmail").value,

        website: document.getElementById("companyWebsite").value,

        tin: document.getElementById("companyTIN").value,

        vat: document.getElementById("companyVAT").value

    };

    localStorage.setItem(

        "companyProfile",

        JSON.stringify(company)

    );

    alert("Company Profile saved successfully.");

});
// ===============================================
// LOAD COMPANY SETTINGS
// ===============================================

function loadCompanyProfile(){

    const company = JSON.parse(

        localStorage.getItem("companyProfile")

    ) || {};

    document.getElementById("companyName").value =
        company.name || "";

    document.getElementById("companyAddress").value =
        company.address || "";

    document.getElementById("companyContact").value =
        company.contact || "";

    document.getElementById("companyEmail").value =
        company.email || "";

    document.getElementById("companyWebsite").value =
        company.website || "";

    document.getElementById("companyTIN").value =
        company.tin || "";

    document.getElementById("companyVAT").value =
        company.vat || "";

}
