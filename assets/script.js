window.addEventListener("scroll", function () {
  let header = document.querySelector(".cabecalho");
  header.classList.toggle("rolar", window.scrollY > 0);
});




var radio = document.querySelector(".manu-btn");
var cont = 1;

document.getElementById("radio1").checked = true;

setInterval(() => {
  proximaimg();
}, 6000);

function proximaimg() {
  cont++;
  if (cont > 3) {
    cont = 1;
  }
  document.getElementById("radio" + cont).checked = true;
}







function opiniao() {
  alert("OPINIÃO REGISTRADA COM SUCESSO!!\nObrigada por nos ajudar.");
}





