// ===============================================
// LOZADA ERP
// CASHIER CLOSING REPORT
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
loadSalesSummary();
loadPaymentSummary(); 
initializeCashComputation(); 
initializeDenominationCalculator(); 
initializeSaveClosing();        
}

);
// ===============================================
// SALES SUMMARY
// ===============================================

function loadSalesSummary(){

    db.ref("orders").once("value")

    .then(snapshot=>{

        let totalTransactions = 0;

        let totalItems = 0;

        let grossSales = 0;

        snapshot.forEach(child=>{

            const order = child.val();

            if(order.status==="Cancelled"){

                return;

            }

            totalTransactions++;

            grossSales += Number(

                order.total || 0

            );

            (order.items || []).forEach(item=>{

                totalItems += Number(

                    item.qty || 0

                );

            });

        });

        const txtTransactions =

            document.getElementById(

                "totalTransactions"

            );

        if(txtTransactions){

            txtTransactions.value =

                totalTransactions;

        }

        const txtItems =

            document.getElementById(

                "totalItemsSold"

            );

        if(txtItems){

            txtItems.value =

                totalItems;

        }

        const txtGross =

            document.getElementById(

                "grossSales"

            );

        if(txtGross){

            txtGross.value =

                "₱" +

                grossSales.toLocaleString(

                    undefined,

                    {

                        minimumFractionDigits:2,

                        maximumFractionDigits:2

                    }

                );

        }

    })

    .catch(error=>{

        console.error(

            error

        );

    });

}
// ===============================================
// PAYMENT SUMMARY
// ===============================================

function loadPaymentSummary(){

    db.ref("orders").once("value")

    .then(snapshot=>{

        let cash = 0;

        let gcash = 0;

        let maya = 0;

        let credit = 0;

        let debit = 0;

        let bank = 0;

        let others = 0;

        snapshot.forEach(child=>{

            const order = child.val();

            if(order.status === "Cancelled"){

                return;

            }

            const amount = Number(order.total || 0);

            switch((order.payment || "").toLowerCase()){

                case "cash":

                    cash += amount;

                    break;

                case "gcash":

                    gcash += amount;

                    break;

                case "maya":

                    maya += amount;

                    break;

                case "credit card":

                    credit += amount;

                    break;

                case "debit card":

                    debit += amount;

                    break;

                case "bank transfer":

                    bank += amount;

                    break;

                default:

                    others += amount;

                    break;

            }

        });

        document.getElementById("paymentCash").value =
            "₱" + cash.toFixed(2);

        document.getElementById("paymentGCash").value =
            "₱" + gcash.toFixed(2);

        document.getElementById("paymentMaya").value =
            "₱" + maya.toFixed(2);

        document.getElementById("paymentCreditCard").value =
            "₱" + credit.toFixed(2);

        document.getElementById("paymentDebitCard").value =
            "₱" + debit.toFixed(2);

        document.getElementById("paymentBankTransfer").value =
            "₱" + bank.toFixed(2);

        document.getElementById("paymentOthers").value =
            "₱" + others.toFixed(2);

        document.getElementById("paymentTotal").value =
            "₱" + (
                cash +
                gcash +
                maya +
                credit +
                debit +
                bank +
                others
            ).toFixed(2);

    })

    .catch(error=>{

        console.error(error);

    });

}
// ===============================================
// CASH COMPUTATION
// ===============================================

function initializeCashComputation(){

    const fields=[

        "openingCashAmount",

        "cashSalesAmount",

        "cashInAmount",

        "cashOutAmount",

        "actualCash"

    ];

    fields.forEach(id=>{

        const input=document.getElementById(id);

        if(input){

            input.addEventListener(

                "input",

                computeCashSummary

            );

        }

    });

    computeCashSummary();

}

// ===============================================
// COMPUTE EXPECTED CASH
// ===============================================

function computeCashSummary(){

    const opening=

        Number(

            document.getElementById(

                "openingCashAmount"

            )?.value||0

        );

    const cashSales=

        Number(

            document.getElementById(

                "cashSalesAmount"

            )?.value||0

        );

    const cashIn=

        Number(

            document.getElementById(

                "cashInAmount"

            )?.value||0

        );

    const cashOut=

        Number(

            document.getElementById(

                "cashOutAmount"

            )?.value||0

        );

    const actual=

        Number(

            document.getElementById(

                "actualCash"

            )?.value||0

        );

    const expected=

        opening+

        cashSales+

        cashIn-

        cashOut;

    const variance=

        actual-

        expected;

    document.getElementById(

        "expectedCash"

    ).value=

    expected.toFixed(2);

    const overShort=

        document.getElementById(

            "overShort"

        );

    overShort.value=

        "₱"+variance.toFixed(2);

    if(variance>0){

        overShort.className=

        "form-control fw-bold text-success";

    }

    else if(variance<0){

        overShort.className=

        "form-control fw-bold text-danger";

    }

    else{

        overShort.className=

        "form-control fw-bold text-primary";

    }

}
// ===============================================
// CASH DENOMINATION CALCULATOR
// ===============================================

function initializeDenominationCalculator(){

    const denominations = document.querySelectorAll(".denomination");

    denominations.forEach(input=>{

        input.addEventListener(

            "input",

            computeDenominationTotal

        );

    });

    computeDenominationTotal();

}

// ===============================================
// COMPUTE CASH DENOMINATION
// ===============================================

function computeDenominationTotal(){

    let total = 0;

    document.querySelectorAll(".denomination")

    .forEach(input=>{

        const qty = Number(input.value || 0);

        const value = Number(input.dataset.value || 0);

        total += qty * value;

    });

    const totalField = document.getElementById(

        "cashDenominationTotal"

    );

    if(totalField){

        totalField.value =

            "₱" +

            total.toLocaleString(

                undefined,

                {

                    minimumFractionDigits:2,

                    maximumFractionDigits:2

                }

            );

    }

    const actualCash = document.getElementById(

        "actualCash"

    );

    if(actualCash){

        actualCash.value = total.toFixed(2);

    }

    computeCashSummary();

}
// ===============================================
// SAVE CLOSING REPORT
// ===============================================

function initializeSaveClosing(){

    const button = document.getElementById(

        "btnSaveClosing"

    );

    if(!button) return;

    button.addEventListener(

        "click",

        saveClosingReport

    );

}

// ===============================================
// SAVE DATA TO FIREBASE
// ===============================================

function saveClosingReport(){

    const now = new Date();

    const year = now.getFullYear();

    const month = now.toLocaleString(

        "en-US",

        {

            month:"long"

        }

    );

    const closingNo =

        "CLS" +

        Date.now();

    const data = {

        closingNo,

        date:

            document.getElementById(

                "closingDate"

            )?.value || "",

        cashier:

            document.getElementById(

                "closingCashier"

            )?.value || "",

        shift:

            document.getElementById(

                "closingShift"

            )?.value || "",

        openingCash:

            document.getElementById(

                "openingCashAmount"

            )?.value || "0",

        totalTransactions:

            document.getElementById(

                "totalTransactions"

            )?.value || "0",

        grossSales:

            document.getElementById(

                "grossSales"

            )?.value || "₱0.00",

        totalPayment:

            document.getElementById(

                "paymentTotal"

            )?.value || "₱0.00",

        expectedCash:

            document.getElementById(

                "expectedCash"

            )?.value || "0",

        actualCash:

            document.getElementById(

                "actualCash"

            )?.value || "0",

        overShort:

            document.getElementById(

                "overShort"

            )?.value || "₱0.00",

        remarks:

            document.getElementById(

                "expenseRemarks"

            )?.value || "",

        createdAt:

            firebase.database.ServerValue.TIMESTAMP

    };

    db.ref(

        `cashierClosing/${year}/${month}/${closingNo}`

    )

    .set(data)

    .then(()=>{

        alert(

            "Cashier Closing Report Saved Successfully."

        );

    })

    .catch(error=>{

        console.error(error);

        alert(

            "Unable to save Closing Report."

        );

    });

}
