const language = document.getElementById("language");
language.addEventListener("click", () => {
  localStorage.setItem("lang", "es");
  let id = language.checked;

  if (id == true) {
    location.href = "es/tarjetaCredito.html";
  }else{
    localStorage.removeItem("lang");
    location.href = "./../tarjetaCredito.html";
  }
});