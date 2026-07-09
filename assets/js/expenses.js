// ======================================
// LOZADA ERP
// EXPENSES MODULE
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    loadClock();

    generateExpenseNo();

    setToday();

    initializeEvents();

});

// ======================================
// LIVE CLOCK
// ======================================

function loadClock(){

    const clock = document.getElementById("liveClock");

    if(!clock) return;

    setInterval(()=>{

        const now = new Date();

        clock.innerHTML = now.toLocaleTimeString();

    },1000);

}

// ======================================
// AUTO EXPENSE NUMBER
// ======================================

function generateExpenseNo(){

    const txt = document.getElementById("expenseNo");

    if(!txt) return;

    const now = new Date();

    txt.value =
        "EXP-" +
        now.getFullYear() +
        String(now.getMonth()+1).padStart(2,"0") +
        String(now.getDate()).padStart(2,"0") +
        "-" +
        Math.floor(Math.random()*9000+1000);

}

// ======================================
// TODAY DATE
// ======================================

function setToday(){

    const txt = document.getElementById("expenseDate");

    if(!txt) return;

    txt.valueAsDate = new Date();

}

// ======================================
// BUTTON EVENTS
// ======================================

function initializeEvents(){

    const btn = document.getElementById("btnNewExpense");

    if(btn){

        btn.onclick = clearExpense;

    }

}

// ======================================
// CLEAR FORM
// ======================================

function clearExpense(){

    generateExpenseNo();

    setToday();

    document.getElementById("expenseSupplier").value="";

    document.getElementById("referenceNo").value="";

    document.getElementById("expenseDescription").value="";

    document.getElementById("expenseAmount").value="";

    document.getElementById("expenseVat").value="0";

    document.getElementById("expenseStatus").selectedIndex=0;

    document.getElementById("paymentMethod").selectedIndex=0;

    document.getElementById("expenseCategory").selectedIndex=0;

}
// ======================================
// EXPENSE LIST
// ======================================

let expenses = [];

// ======================================
// SAVE BUTTON
// ======================================

const btnSaveExpense = document.getElementById("btnSaveExpense");

if(btnSaveExpense){

    btnSaveExpense.addEventListener("click", saveExpense);

}
