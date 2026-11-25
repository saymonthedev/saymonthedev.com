// Prévia do site da fonoaudióloga Karla do Amaral Costa.
// Mostra o botão flutuante de ligar depois da abertura e o esconde onde a
// página já tem os próprios botões de ligar à vista.
(() => {
  "use strict";

  const flutuante = document.getElementById("flutuante");
  const acoes = document.getElementById("abertura-acoes");
  const final = document.querySelector(".final");

  if (!("IntersectionObserver" in window) || !flutuante || !acoes) return;

  let acima = true;
  let noFinal = false;
  const decidir = () => flutuante.classList.toggle("ver", !acima && !noFinal);

  new IntersectionObserver(([entrada]) => {
    acima = entrada.isIntersecting || entrada.boundingClientRect.top > 0;
    decidir();
  }).observe(acoes);

  if (final) {
    new IntersectionObserver(([entrada]) => {
      noFinal = entrada.isIntersecting;
      decidir();
    }).observe(final);
  }
})();
