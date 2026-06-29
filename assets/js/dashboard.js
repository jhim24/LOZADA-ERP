const sales=document.getElementById("salesChart");

if(sales){

new Chart(sales,{

type:"line",

data:{

labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],

datasets:[{

label:"Sales",

data:[12000,18000,15000,24000,29000,34000,45680],

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

const category=document.getElementById("categoryChart");

if(category){

new Chart(category,{

type:"doughnut",

data:{

labels:["Meals","Drinks","Desserts","Snacks"],

datasets:[{

data:[45,25,18,12],

backgroundColor:[

"#2563EB",

"#10B981",

"#F59E0B",

"#EF4444"

]

}]

},

options:{

responsive:true

}

});

}
