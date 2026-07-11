// ===============================================
// LOZADA ERP
// DISPATCH AREA
// ===============================================

// ===============================================
// FIREBASE
// ===============================================

const firebaseConfig = {
    apiKey: "AIzaSyAV9T5w_1azmPHIJcZpraXP06TItj7HEuA",
    authDomain: "papprito-orders.firebaseapp.com",
    databaseURL: "https://papprito-orders-default-rtdb.firebaseio.com",
    projectId: "papprito-orders",
    storageBucket: "papprito-orders.firebasestorage.app",
    messagingSenderId: "831941801424",
    appId: "1:831941801424:web:40a99cdfb312dac2d275d5"
};

if(!firebase.apps.length){

    firebase.initializeApp(firebaseConfig);

}

const db = firebase.database();

// ===============================================
// COMPONENT LOADER
// ===============================================

async function loadComponent(id,file){

    try{

        const response = await fetch(file);

        if(!response.ok){

            throw new Error(file);

        }

        const html = await response.text();

        document.getElementById(id).innerHTML = html;

    }catch(error){

        console.error(error);

    }

}

// ===============================================
// INITIALIZE
// ===============================================

document.addEventListener("DOMContentLoaded", async()=>{

    await loadComponent("sidebar","../components/sidebar.html");

    await loadComponent("navbar","../components/navbar.html");

    await loadComponent("dispatch-header","../components/dispatch-header.html");

    await loadComponent("dispatch-board","../components/dispatch-board.html");

    loadDispatchOrders();

    setInterval(loadDispatchOrders,2000);

});
