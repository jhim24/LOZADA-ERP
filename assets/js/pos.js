// LIVE CLOCK

function updateClock(){

const now=new Date();

document.getElementById("currentDate").innerHTML=
now.toLocaleDateString();

document.getElementById("currentTime").innerHTML=
now.toLocaleTimeString();

}

setInterval(updateClock,1000);

updateClock();
