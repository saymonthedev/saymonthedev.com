// Prévia do site do Studio Chic.
// 1. Monta a mensagem de agendamento e deixa o botão do WhatsApp pronto com
//    ela: o cliente chega com tudo que a Studio precisa saber, e o atendimento
//    continua do mesmo jeito, pelo WhatsApp.
// 2. Mostra o botão flutuante do WhatsApp depois da abertura.
// Sem JavaScript, todos os links já abrem o WhatsApp com uma mensagem padrão.
(() => {
  "use strict";

  const NUMERO = "554733709301";
  const $ = (sel) => document.querySelector(sel);
  const valor = (nome) => {
    const marcado = document.querySelector(`input[name="${nome}"]:checked`);
    return marcado ? marcado.value : "";
  };

  /* ---------- Montar a mensagem ---------- */

  const nome = $("#p-nome");
  const servico = $("#p-servico");
  const taxi = $("#p-taxi");
  const porte = $("#p-porte");
  const texto = $("#p-texto");
  const enviar = $("#p-enviar");

  function mensagem() {
    const tipo = valor("p-tipo");
    const pet = nome.value.trim().replace(/\s+/g, " ");
    const dia = valor("p-dia");
    const qual = servico.value;
    const emoji = tipo === "gato" ? "🐱" : "🐶";
    const sobre = tipo === "gato" ? "gato" : `cachorro de porte ${valor("p-porte")}`;

    const linhas = [
      qual ? `Oi, Studio Chic! Vi o site e quero agendar ${qual}.` : "Oi, Studio Chic! Vi o site e quero agendar um horário. Ainda não sei qual serviço, pode me ajudar?",
      `${emoji} Pet: ${pet ? `${pet}, ${sobre}` : sobre}`,
      `📅 Dia: ${dia || "qualquer dia de terça a sexta"}`,
    ];
    if (taxi.checked) linhas.push("🚕 Vou precisar do táxi pet");
    return linhas.join("\n");
  }

  function atualizar() {
    // Gato não tem porte na mensagem.
    porte.hidden = valor("p-tipo") === "gato";
    const atual = mensagem();
    texto.textContent = atual;
    enviar.href = `https://wa.me/${NUMERO}?text=${encodeURIComponent(atual)}`;
  }

  if (nome && servico && taxi && porte && texto && enviar) {
    document.querySelector(".pedido").addEventListener("input", atualizar);
    document.querySelector(".pedido").addEventListener("change", atualizar);
    // "Buscar"/"Ir" no teclado do celular só fecha o teclado.
    nome.addEventListener("keydown", (event) => {
      if (event.key === "Enter") nome.blur();
    });
    atualizar();
  }

  /* ---------- Topo e botão flutuante ---------- */

  const topo = $("#topo");
  const flutuante = $("#flutuante");
  const acoes = $("#hero-acoes");
  const final = document.querySelector(".final");

  if ("IntersectionObserver" in window && flutuante && acoes) {
    let acima = true;
    let noFinal = false;
    const decidir = () => flutuante.classList.toggle("ver", !acima && !noFinal);
    // Aparece quando os botões da abertura saem da tela e some na chamada
    // final, que já tem o próprio botão.
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
  } else if (flutuante) {
    flutuante.classList.add("ver");
  }

  if (topo) {
    const marcar = () => topo.classList.toggle("rolou", window.scrollY > 8);
    window.addEventListener("scroll", marcar, { passive: true });
    marcar();
  }
})();
