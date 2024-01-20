(() => { //Cargar información en el client-side-rendering
  if (!sessionStorage.getItem("user")) location.href = "./../Login-form/";
  if(localStorage.getItem("lang")) location.href = "./es/"; //Redirige segun el lenguaje seleccionado
  else {
    document.getElementById("language").checked = false; 
  }
  

  async function getSaldo(id) { //Obtiene el saldo actual
    return fetch(`http://localhost:3000/saldo/${id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => (saldoActual = parseInt(data.saldo) || 0));
  }

  async function getTransactions( id ) { //Obtiene el historial de transacciones del usuario

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

  async function __loadSessionData() { //Carga la data a la vista del cliente
    const userData = JSON.parse(sessionStorage.getItem("user"));
    const id = document.querySelector(".id");
    const username = document.querySelector(".username");
    const balance = document.querySelector(".balance");
    const saldo = await getSaldo(userData.id);
    id.innerHTML = userData.id;
    balance.innerHTML = "$ " + saldo;
    username.innerHTML = userData.name + " " + userData.surname;
    //Rendering transactions on DOM
    const transactions = await getTransactions(userData.id);
    const table = document.querySelector(".table");

    localStorage.setItem("lastTransaction", transactions.length > 0 ? transactions.at(0).id : 0);

    // carga las transaccion cuando entramos a la pagina 
    transactions.forEach(({ id, createdAt, saldo }) => {
      const row = document.createElement("div");
      const type = saldo > 0 ? "Top up" : "Payment";
      const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })
      }

      row.innerHTML = `
        <div class="id">${id}</div>
        <div class="${type.split(' ').join("").toLowerCase()} type">${type}</div>
        <div class="total">${saldo}</div>
        <div class="date">${formatDate(createdAt)}</div>
      `;

      row.classList.add("row");

      table.appendChild(row); //Adding row with transaction data
    });

  }

  function __generateNavegableContent() { //Generar componente de rutas
    const routes = document.querySelectorAll(".route");
    const views = document.querySelectorAll(".view");

    let currentRoute = window.location.hash.substring(1);

    const resetRoutes = (event) => {
      currentRoute = event.target.parentNode.dataset.route;

      routes.forEach((route, index) => { //Segun la ruta activa la muestra
        if (currentRoute === route.dataset.route) {
          route.classList.add("active");
          views[index].classList.add("show-view");
        } else {
          route.classList.remove("active");
          views[index].classList.remove("show-view");
        }
      });
    };

    routes.forEach((route) => { //Crea desde el cliente las vistas de las rutas
      if (currentRoute === route.dataset.route) route.classList.add("active");
      else route.classList.remove("active");

      route.innerHTML = `<a href="#${route.dataset.route}" class="route-link" >${route.innerText}</a>`;
      route.firstChild.addEventListener("click", resetRoutes);
    });

    views.forEach((view) => {
      if (currentRoute === view.dataset.route) view.classList.add("show-view");
      else view.classList.remove("show-view");
    });
  }

  __loadSessionData(); //Renderizado en cliente
  __generateNavegableContent();  //Renderizado en cliente
})();

function updateVehicle() {
  calculateTotal();
}

function calculateTotal() { //Calcular el valor a pagar segun el tipo de vehiculo
  const time = document.getElementById("time").value;
  const vehicleType = document.getElementById("vehicle").value;
  const vehicle = vehicleType == "car" ? new Car() : new Motocycle();

  const totalRate = vehicle.getRate() * time;

  const totals = document.querySelectorAll(".total"); //Actualiza en las vistas el saldo a pagar
  totals.forEach((total) => {
    total.innerText = `$ ${totalRate}`;
    total.value = `$ ${totalRate}`;
  });
}

function logout() { //cierra la sesión del usuario
  sessionStorage.removeItem("user");
  location.href = "./../Login-form";
}
