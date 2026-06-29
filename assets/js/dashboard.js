// SALES CHART

const salesChart = document.getElementById('salesChart');

if(salesChart){

new Chart(salesChart,{

type:'line',

data:{

labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],

datasets:[{

label:'Sales',

data:[12000,18500,14000,22000,26000,31000,45680],

borderColor:'#2563EB',

backgroundColor:'rgba(37,99,235,.15)',

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

// CATEGORY CHART

const categoryChart=document.getElementById('categoryChart');

if(categoryChart){

new Chart(categoryChart,{

type:'doughnut',

data:{

labels:[

'Meals',

'Drinks',

'Desserts',

'Snacks'

],

datasets:[{

data:[45,25,15,15],

backgroundColor:[

'#2563EB',

'#F59E0B',

'#10B981',

'#EF4444'

]

}]

},

options:{

responsive:true,

plugins:{

legend:{

position:'bottom'

}

}

}

});

}
