// ? Variables y Requiere
let palabra = "";
if (typeof window !== "undefined") {
  window.addEventListener("load", function () {
    let control = document.querySelector("#search");
    //let control= document.querySelector("input")
    control.addEventListener("keypress", function (e) {
      if (e.key == "Enter") {
        palabra = control.value;
        window.location.href ="/search/" + palabra;
      }
    });
  });
}
