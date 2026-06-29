// SALES CHART

const salesCanvas=document.getElementById("salesChart");

if(salesCanvas){

new Chart(salesCanvas,{

type:"line",

data:{

labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],

datasets:[{

label:"Sales",

data:[20000,32000,28000,42000,31000,47000,35000],

borderColor:"#2563EB",

backgroundColor:"rgba(37,99,235,.15)",

fill:true,

tension:.4

}]

},

options:{

responsive:true,

plugins:{

legend:{

display:false

}

}

}

});

}

// CATEGORY

const categoryCanvas=document.getElementById("categoryChart");

if(categoryCanvas){

new Chart(categoryCanvas,{

type:"doughnut",

data:{

labels:["Main","Drinks","Desserts","Snacks"],

datasets:[{

data:[35,25,20,20],

backgroundColor:[

"#2563EB",

"#10B981",

"#F59E0B",

"#EF4444"

]

}]

}

});

}
