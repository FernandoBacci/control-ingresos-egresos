const tabla = document.querySelector("#tabla-datos tbody");
const btnDia = document.getElementById("btn-dia");
const btnSemana = document.getElementById("btn-semana");
const btnMes = document.getElementById("btn-mes");
const btnAnio = document.getElementById("btn-anio");
const btnFiltrarFecha = document.getElementById("btn-filtrar-fecha");

const fechaDesdeInput = document.getElementById("fecha-desde");

const fechaHastaInput = document.getElementById("fecha-hasta");

const horaDesdeInput = document.getElementById("hora-desde");

const horaHastaInput = document.getElementById("hora-hasta");


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCdaQ83ZNbccXjJ4HKd2dvoOYa-uc6TYKw",
  authDomain: "control-ingresos-egresos-hogar.firebaseapp.com",
  projectId: "control-ingresos-egresos-hogar",
  storageBucket: "control-ingresos-egresos-hogar.firebasestorage.app",
  messagingSenderId: "1038151483657",
  appId: "1:1038151483657:web:918402daf055a4f61bd3d8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("📊 Estadísticas conectadas");

async function obtenerDatos() {
    //const querySnapshot = await getDocs(collection(db, "viajes"));
    const q = query(collection(db,"viajes"), orderBy("timestamp","desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    const data = doc.data();

    console.log(data); // lo dejamos para debug

    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${data.tipo}</td>
        <td>${data.monto}</td>
        <td>${data.ajuste}</td>
        <td>${data.fecha}</td>
        <td>${data.hora}</td>
    `;

    tabla.appendChild(fila);
});
    
}


function obtenerFechaHoy() {
    const hoy = new Date();

    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, "0");
    const day = String(hoy.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}
//funcion para ver datos por semana
function obtenerRangoSemana() {

const hoy = new Date();

let dia = hoy.getDay(); 
// domingo=0, lunes=1...

if(dia === 0){
 dia = 7; // domingo lo tomamos como 7
}

const lunes = new Date(hoy);
lunes.setDate(hoy.getDate() - (dia - 1));
lunes.setHours(0,0,0,0);

const domingo = new Date(lunes);
domingo.setDate(lunes.getDate()+6);
domingo.setHours(23,59,59,999);

return {
 inicio: lunes,
 fin: domingo
};

}

async function obtenerDatosPorDia() {
    console.log("Filtrando por día");
    //hacemos visible el resumen del dia
    document.getElementById("resumen-dia").style.display = "block";
    //hacemos visible el resumen del dia
    tabla.innerHTML = "";

    const hoy = obtenerFechaHoy();
    //resumen del dia
    let totalDia = 0;
    let cantidadTotal = 0;

    let resumen = {
    "calle-efectivo": {cant:0,total:0},
    "calle-mp": {cant:0,total:0},
    "didi-efectivo": {cant:0,total:0},
    "didi-tarjeta": {cant:0,total:0},
    "uber-efectivo": {cant:0,total:0},
    "grupo-efectivo": {cant:0,total:0},
    "grupo-mp": {cant:0,total:0},
    "grupo-dolar": {cant:0,total:0},
    "premium-ctacte": {cant:0,total:0},
    "premium-efectivo": {cant:0,total:0}
    };
    //resumen del dia

    const q = query(collection(db, "viajes"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const data = doc.data();

        console.log("Comparando:", data.fecha, hoy);

        if (data.fecha === hoy) {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${data.tipo}</td>
                <td>${data.monto}</td>
                <td>${data.ajuste}</td>
                <td>${data.fecha}</td>
                <td>${data.hora}</td>
            `;

            tabla.appendChild(fila);
            //resumen del dia
            let neto = data.monto - data.ajuste;

            resumen[data.tipo].cant++;
            resumen[data.tipo].total += neto;

            totalDia += neto;
            cantidadTotal++;
            //resumen del dia
        }
    });
    //resumen del dia
    for(let tipo in resumen){

    document.getElementById(tipo).textContent =
    `${resumen[tipo].cant} viajes | $${resumen[tipo].total}`;

    }
    document.getElementById("total-viajes").textContent = cantidadTotal;
    document.getElementById("total-dia").textContent = totalDia;
    //resumen del dia
}
//funcion para obtener datos por semana
async function obtenerDatosPorSemana(){

console.log("Filtrando por semana");

document.getElementById("resumen-dia").style.display="block";

tabla.innerHTML="";

const rango = obtenerRangoSemana();

let totalSemana = 0;
let cantidadTotal = 0;

let resumen = {
"calle-efectivo": {cant:0,total:0},
"calle-mp": {cant:0,total:0},
"didi-efectivo": {cant:0,total:0},
"didi-tarjeta": {cant:0,total:0},
"uber-efectivo": {cant:0,total:0},
"grupo-efectivo": {cant:0,total:0},
"grupo-mp": {cant:0,total:0},
"grupo-dolar": {cant:0,total:0},
"premium-ctacte": {cant:0,total:0},
"premium-efectivo": {cant:0,total:0}
};

const q = query(
collection(db,"viajes"),
orderBy("timestamp","desc")
);

const querySnapshot = await getDocs(q);

querySnapshot.forEach((doc)=>{

const data = doc.data();

const fechaViaje = new Date(data.fecha);

if(fechaViaje >= rango.inicio && fechaViaje <= rango.fin){

const fila = document.createElement("tr");

fila.innerHTML=`
<td>${data.tipo}</td>
<td>${data.monto}</td>
<td>${data.ajuste}</td>
<td>${data.fecha}</td>
<td>${data.hora}</td>
`;

tabla.appendChild(fila);

let neto = data.monto - data.ajuste;

resumen[data.tipo].cant++;
resumen[data.tipo].total += neto;

totalSemana += neto;
cantidadTotal++;

}

});

for(let tipo in resumen){

document.getElementById(tipo).textContent =
`${resumen[tipo].cant} viajes | $${resumen[tipo].total}`;

}

document.getElementById("total-viajes").textContent = cantidadTotal;
document.getElementById("total-dia").textContent = totalSemana;

document.querySelector("#resumen-dia h2").textContent =
"Resumen de la semana";

}
//obtener datos del mes
async function obtenerDatosPorMes(){

console.log("Filtrando por mes");

document.getElementById("resumen-dia").style.display="block";

tabla.innerHTML="";

const hoy = new Date();
const mesActual = hoy.getMonth();
const anioActual = hoy.getFullYear();

let totalMes = 0;
let cantidadTotal = 0;

let resumen = {
"calle-efectivo": {cant:0,total:0},
"calle-mp": {cant:0,total:0},
"didi-efectivo": {cant:0,total:0},
"didi-tarjeta": {cant:0,total:0},
"uber-efectivo": {cant:0,total:0},
"grupo-efectivo": {cant:0,total:0},
"grupo-mp": {cant:0,total:0},
"grupo-dolar": {cant:0,total:0},
"premium-ctacte": {cant:0,total:0},
"premium-efectivo": {cant:0,total:0}
};

const q = query(
collection(db,"viajes"),
orderBy("timestamp","desc")
);

const querySnapshot = await getDocs(q);

querySnapshot.forEach((doc)=>{

const data = doc.data();

const fechaViaje = new Date(data.fecha);

if(
fechaViaje.getMonth() === mesActual &&
fechaViaje.getFullYear() === anioActual
){

const fila = document.createElement("tr");

fila.innerHTML = `
<td>${data.tipo}</td>
<td>${data.monto}</td>
<td>${data.ajuste}</td>
<td>${data.fecha}</td>
<td>${data.hora}</td>
`;

tabla.appendChild(fila);

let neto = data.monto - data.ajuste;

resumen[data.tipo].cant++;
resumen[data.tipo].total += neto;

totalMes += neto;
cantidadTotal++;

}

});

for(let tipo in resumen){

document.getElementById(tipo).textContent =
`${resumen[tipo].cant} viajes | $${resumen[tipo].total}`;

}

document.getElementById("total-viajes").textContent = cantidadTotal;
document.getElementById("total-dia").textContent = totalMes;

document.querySelector("#resumen-dia h2").textContent =
"Resumen del mes";

}
//obtener datos por año
async function obtenerDatosPorAnio(){

console.log("Filtrando por año");

document.getElementById("resumen-dia").style.display="block";

tabla.innerHTML="";

const anioActual = new Date().getFullYear();

let totalAnio = 0;
let cantidadTotal = 0;

let resumen = {
"calle-efectivo": {cant:0,total:0},
"calle-mp": {cant:0,total:0},
"didi-efectivo": {cant:0,total:0},
"didi-tarjeta": {cant:0,total:0},
"uber-efectivo": {cant:0,total:0},
"grupo-efectivo": {cant:0,total:0},
"grupo-mp": {cant:0,total:0},
"grupo-dolar": {cant:0,total:0},
"premium-ctacte": {cant:0,total:0},
"premium-efectivo": {cant:0,total:0}
};

const q = query(
collection(db,"viajes"),
orderBy("timestamp","desc")
);

const querySnapshot = await getDocs(q);

querySnapshot.forEach((doc)=>{

const data = doc.data();

const fechaViaje = new Date(data.fecha);

if(fechaViaje.getFullYear() === anioActual){

const fila = document.createElement("tr");

fila.innerHTML = `
<td>${data.tipo}</td>
<td>${data.monto}</td>
<td>${data.ajuste}</td>
<td>${data.fecha}</td>
<td>${data.hora}</td>
`;

tabla.appendChild(fila);

let neto = data.monto - data.ajuste;

resumen[data.tipo].cant++;
resumen[data.tipo].total += neto;

totalAnio += neto;
cantidadTotal++;

}

});

for(let tipo in resumen){

document.getElementById(tipo).textContent =
`${resumen[tipo].cant} viajes | $${resumen[tipo].total}`;

}

document.getElementById("total-viajes").textContent = cantidadTotal;
document.getElementById("total-dia").textContent = totalAnio;

document.querySelector("#resumen-dia h2").textContent =
"Resumen del año";

}

async function obtenerDatosPorRango(){

console.log("Filtrando por rango");

document.getElementById("resumen-dia").style.display = "block";

tabla.innerHTML = "";

//const desde = fechaDesdeInput.value;
//const hasta = fechaHastaInput.value;

const desde = fechaDesdeInput.value;
const hasta = fechaHastaInput.value;

const horaDesde = horaDesdeInput.value || "00:00";

const horaHasta = horaHastaInput.value || "23:59";

const inicioFiltro =
new Date(`${desde}T${horaDesde}`).getTime();

const finFiltro =
new Date(`${hasta}T${horaHasta}`).getTime();

if(!desde || !hasta){
    alert("Selecciona ambas fechas");
    return;
}

let total = 0;
let cantidadTotal = 0;

let resumen = {
"calle-efectivo": {cant:0,total:0},
"calle-mp": {cant:0,total:0},
"didi-efectivo": {cant:0,total:0},
"didi-tarjeta": {cant:0,total:0},
"uber-efectivo": {cant:0,total:0},
"grupo-efectivo": {cant:0,total:0},
"grupo-mp": {cant:0,total:0},
"grupo-dolar": {cant:0,total:0},
"premium-ctacte": {cant:0,total:0},
"premium-efectivo": {cant:0,total:0}
};

const q = query(
collection(db,"viajes"),
orderBy("timestamp","desc")
);

const querySnapshot = await getDocs(q);

querySnapshot.forEach((doc)=>{

const data = doc.data();

//if(data.fecha >= desde && data.fecha <= hasta){
if(data.timestamp >= inicioFiltro &&   data.timestamp <= finFiltro){
const fila = document.createElement("tr");

fila.innerHTML = `
<td>${data.tipo}</td>
<td>$${data.monto}</td>
<td>$${data.ajuste}</td>
<td>${data.fecha}</td>
<td>${data.hora}</td>
`;

tabla.appendChild(fila);

let neto = data.monto - data.ajuste;

resumen[data.tipo].cant++;
resumen[data.tipo].total += neto;

total += neto;
cantidadTotal++;

}

});

for(let tipo in resumen){

document.getElementById(tipo).textContent =
`${resumen[tipo].cant} viajes | $${resumen[tipo].total}`;

}

document.getElementById("total-viajes").textContent = cantidadTotal;

document.getElementById("total-dia").textContent = total;

document.querySelector("#resumen-dia h2").textContent =
"Resumen por rango de fechas";

}

obtenerDatos();
btnDia.addEventListener("click", obtenerDatosPorDia);
btnSemana.addEventListener("click",obtenerDatosPorSemana);
btnMes.addEventListener("click",obtenerDatosPorMes);
btnAnio.addEventListener("click",obtenerDatosPorAnio);
btnFiltrarFecha.addEventListener(
    "click",
    obtenerDatosPorRango
);