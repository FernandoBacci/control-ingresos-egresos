//Conexion con la base de datos de google: Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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


console.log("Js conectado")
const select = document.getElementById("tipo-viaje");
const campoAjuste = document.getElementById("campo-ajuste");
const montoInput = document.getElementById("monto");
const ajusteInput = document.getElementById("ajuste");
select.addEventListener("change", function(){
    const tipo = select.value;

    if(tipo ==="didi-efectivo" || 
       tipo ==="uber-efectivo" ||
       tipo.includes("grupo") || 
       tipo.includes("premium") 
    ){
        campoAjuste.style.display = "block";   
    }else{
        campoAjuste.style.display = "none";   
    }
    //si es premium calcular 24% automatico
    if(tipo==="premium-efectivo" ||
       tipo==="premium-ctacte" ) 
       {
        const monto = parseFloat(montoInput.value);
        if(!isNaN(monto)){
            const ajuste = monto*0.24;
            
            ajusteInput.value = ajuste.toFixed(2);
            
        }
    }
});
montoInput.addEventListener("input",function(){
    const tipo = select.value;
    const monto = parseFloat(montoInput.value);
    if(
        (tipo === "premium-efectivo"|| tipo === "premium-ctacte")&& !isNaN(monto)
    ){
        const ajuste = monto*0.24;
        ajusteInput.value = ajuste.toFixed(2);
    } else{
        ajusteInput.value = "";
    }
});

//Ingreso de datos a mi base de datos Firebase
const form = document.getElementById("form-ingreso");

form.addEventListener("submit", async function(e){
    e.preventDefault();

    const tipo = select.value;
    const monto = parseFloat(montoInput.value);
    const ajuste = parseFloat(ajusteInput.value) || 0;

   // const fecha = new Date().toISOString().split("T")[0];
   // const hora = new Date().toLocaleTimeString();
    //Modifico las dos lineas anteriores por esto ya que no funciona correctamente el mostrar
   const ahora = new Date();

    const fecha = ahora.toLocaleDateString("sv-SE");

    const hora = ahora.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit"
    });


    if(!tipo){
        alert("Selecciona un tipo de viaje");
        return;
    }
    if(isNaN(monto) || monto <=0){
        alert("Ingresa un monto valido")
        return;
    }

    try{
        const timestamp = Date.now();

        await addDoc(collection(db, "viajes"), {
            tipo: tipo,
            monto: monto,
            ajuste: ajuste,
            fecha: fecha,
            hora: hora,
            timestamp: timestamp
        });

        alert("✅ Guardado en Firebase");

        form.reset();
        campoAjuste.style.display = "none";

    }catch(error){
        console.error("Error:", error);
        alert("❌ Error al guardar");
    }
});