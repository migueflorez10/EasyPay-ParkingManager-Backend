let saldoActual;

async function getTransactions() {
  const id = document.getElementById("userId").value;

  return fetch("http://localhost:3000/transacciones", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Connection: "keep-alive",
      Accept: "*",
    },
    body: JSON.stringify({ id }),
  })
    .then((res) => res.json())
    .then((data) => data);
}

function doTransaction() {
  const id = document.getElementById("userId").value;
  const saldo = document.getElementById("saldo").value;

  fetch("http://localhost:3000/transaccion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Connection: "keep-alive",
      Accept: "*",
    },
    body: JSON.stringify({ id, saldo }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
}

function signIn(event) {
  const userId = event.elements.userId.value;

  fetch(`http://localhost:3000/users/${userId}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message) console.log("User not found / Verify your credentials");
      else {
        sessionStorage.setItem("user", JSON.stringify(data[0]));
        location.href = "./../Home/index.html";
      }
    });
}

window.load = () => {
  const form = document.getElementById("loginForm"); //Configurar formulario para que no recargue la página

  form.addEventListener("submit", (event) => event.preventDefault());
};
//recargar----------------------------------
function recarga() {
  const id = document.getElementById("id").value;
  const saldo = document.getElementById("saldo").value;

  fetch("http://localhost:3000/actSaldo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Connection: "keep-alive",
      Accept: "*",
    },
    body: JSON.stringify({ saldo, id }),
  }).then((data) => {
    if (data.message) console.log("User not found / Verify your credentials");
    else {
      location.href = "./../Home/index.html";
    }
  });
}
//Obtener saldo actual
async function getSaldo(id) {
  return fetch(`http://localhost:3000/saldo/${id}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => (saldoActual = parseInt(data.saldo) || 0));
}
//pagar parqueadero--------------------------------------------

async function pagar() {
  const total = parseInt(document.querySelector(".total").value.substring(2));

  const userData = JSON.parse(sessionStorage.getItem("user"));
  const id = userData.id;
  let saldo = await getSaldo(id);

  if (saldo >= total) {
    //Verificar si el saldo es suficiente para hacer el pago
    fetch("http://localhost:3000/transaccion", {
      method: "POST",
      body: JSON.stringify({ id, saldo: -total }),
      headers: { "Content-Type": "application/json" },
    }).then((data) => {
      if (data.message) console.log("User not found / Verify your credentials");
      else {
        const balance = document.querySelector(".balance");
        const routes = document.querySelectorAll(".route");
        const times = document.getElementById("time");

        balance.innerHTML = "$ " + (saldo - total);
        times.value = "0";

        //Rendering transactions on DOM
        const table = document.querySelector(".table");

        const row = document.createElement("div");
        const type = total < 0 ? "Top up" : "Payment";
        const formatDate = () => {
          return new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          });
        }; // crea la fila de la transaccion - id- tipo - total - fecha en que se hizo
        row.innerHTML = `
            <div class="id">${
              localStorage.getItem("lastTransaction")
                ? parseInt(localStorage.getItem("lastTransaction")) + 1
                : 1
            }</div>
            <div class="${type
              .split(" ")
              .join("")
              .toLowerCase()} type">${type}</div>
            <div class="total">${-total}</div>
            <div class="date">${formatDate()}</div>
          `;
        // agrega los estilos - css - update es el que hace la animacion
        row.classList.add("row", "update");
        localStorage.setItem(
          "lastTransaction",
          parseInt(localStorage.getItem("lastTransaction")) + 1
        );
        table.insertBefore(row, table.childNodes[1]); // agrega primero en la tabla

        //Se redirige al historial de transacciones
        routes.forEach((route) => {
          if (route.dataset.route === "transactions") route.firstChild.click();
        });

        //Crear animacion para la transaccion creada
        setTimeout(() => {
          row.classList.remove("update");
        }, 5000);

        closePopUp();
      }
    });
  } else {
    window.alert("no tienes dinero suficiente");
  }
}

function closePopUp() { //Cierra la ventana de confirmacion
  const popUp = document.querySelector(".pop-up");
  popUp.classList.remove("active");
}

function openPopUp() { //Abre la ventana de confirmacion
  const popUp = document.querySelector(".pop-up");
  popUp.classList.add("active");
}
