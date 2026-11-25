// Prévia do site da fonoaudióloga Karla do Amaral Costa.
// 1. Fala por idade: troca o quadro conforme a idade escolhida.
// 2. Horários: destaca o dia de hoje (no horário de Brasília).
// 3. Botão flutuante de ligar depois da abertura, escondido onde a página já
//    tem os próprios botões de ligar à vista.
// Sem JavaScript, o quadro dos 2 anos fica à mostra e o resto funciona igual.
(() => {
  "use strict";

  /* ---------- Fala por idade ---------- */

  const botoes = [...document.querySelectorAll(".idade")];
  const marcos = [...document.querySelectorAll(".marco")];

  for (const botao of botoes) {
    botao.addEventListener("click", () => {
      const idade = botao.dataset.idade;
      for (const b of botoes) b.setAttribute("aria-pressed", String(b === botao));
      for (const m of marcos) m.hidden = m.dataset.idade !== idade;
    });
  }

  /* ---------- Horário de hoje ---------- */

  try {
    const dia = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "America/Sao_Paulo" }).format(new Date());
    const numero = { Mon: "1", Tue: "2", Wed: "3", Thu: "4", Fri: "5" }[dia];
    if (numero) {
      const linha = [...document.querySelectorAll(".horarios [data-dias]")].find((el) => el.dataset.dias.split(" ").includes(numero));
      if (linha) linha.classList.add("hoje");
    }
  } catch {
    // Sem destaque se o navegador não souber o fuso.
  }

  /* ---------- Botão flutuante ---------- */

  const flutuante = document.getElementById("flutuante");
  const acoes = document.getElementById("abertura-acoes");
  const comBotao = [document.querySelector(".fala-acao"), document.querySelector(".ligue")].filter(Boolean);

  if (!("IntersectionObserver" in window) || !flutuante || !acoes) return;

  // Os botões da abertura podem começar abaixo da dobra no celular, então a
  // posição é conferida na rolagem (vale também para saltos pelos links).
  const vendo = new Set();
  let pendente = false;
  const decidir = () => {
    pendente = false;
    const passou = acoes.getBoundingClientRect().bottom < 0;
    flutuante.classList.toggle("ver", passou && vendo.size === 0);
  };
  window.addEventListener("scroll", () => {
    if (!pendente) { pendente = true; requestAnimationFrame(decidir); }
  }, { passive: true });

  const obs = new IntersectionObserver((entradas) => {
    for (const e of entradas) e.isIntersecting ? vendo.add(e.target) : vendo.delete(e.target);
    decidir();
  });
  comBotao.forEach((el) => obs.observe(el));
  decidir();
})();
