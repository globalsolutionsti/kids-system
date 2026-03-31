const API = "PEGA_AQUI_TU_URL_DE_APPS_SCRIPT";

let scanner;

// 🔐 LOGIN
function login(){
  fetch(API,{
    method:"POST",
    body: JSON.stringify({
      action:"login",
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  })
  .then(r=>r.json())
  .then(d=>{
    if(d.status){
      document.getElementById("login").style.display="none";
      document.getElementById("dashboard").style.display="block";
      iniciarDashboard();
    } else {
      alert("Login incorrecto");
    }
  });
}

// 📊 DASHBOARD TIEMPO REAL
function iniciarDashboard(){
  setInterval(()=>{
    fetch(API,{
      method:"POST",
      body: JSON.stringify({action:"dashboard"})
    })
    .then(r=>r.json())
    .then(d=>{
      document.getElementById("activos").innerText = d.activos;
      document.getElementById("entregados").innerText = d.entregados;
    });
  },3000);
}

// 📷 ESCÁNER QR
function iniciarScanner(){
  scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    (decodedText)=>{
      procesarQR(decodedText);
    }
  );
}

// 🚪 PROCESAR QR (CHECKOUT)
function procesarQR(uuid){
  fetch(API,{
    method:"POST",
    body: JSON.stringify({
      action:"checkout",
      uuid: uuid
    })
  })
  .then(()=> {
    alert("Niño entregado");
    scanner.stop();
  });
}

// 🧾 IMPRIMIR GAFETE
function imprimirQR(uuid){
  const win = window.open("");
  win.document.write(`
    <h2>Gafete</h2>
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${uuid}">
    <script>window.print()</script>
  `);
}
