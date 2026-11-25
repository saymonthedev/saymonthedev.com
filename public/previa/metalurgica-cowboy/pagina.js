// Prévia do site da Metalúrgica Cowboy.
// 1. Pedido de orçamento: o cliente escolhe o serviço e as medidas, vê um
//    desenho técnico simples com as cotas e manda tudo pronto pelo WhatsApp.
// 2. Galeria de obras com filtros e foto ampliada.
// 3. Botão flutuante do WhatsApp depois da abertura.
// Sem JavaScript, os links já abrem o WhatsApp com uma mensagem padrão e as
// fotos da galeria abrem em tamanho grande.
(() => {
  "use strict";

  const NUMERO = "5547997093771";
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];

  /* ================= Pedido de orçamento ================= */

  // Cada serviço: como aparece na mensagem, as medidas que fazem sentido (a
  // primeira é a horizontal do desenho, a segunda a vertical e a terceira só
  // vai para o texto), a proporção do desenho enquanto não há medidas e a
  // dica do campo.
  const LARGURA = { nome: "Largura", frase: "de largura" };
  const ALTURA = { nome: "Altura", frase: "de altura" };
  const COMPRIMENTO = { nome: "Comprimento", frase: "de comprimento" };
  const ITENS = {
    portao: {
      peca: "Portão", medidas: [LARGURA, ALTURA], prop: 2.3,
      dica: "Meça o vão onde o portão vai ficar. Não sabe? Mande uma foto do local.",
      exemplo: "Ex.: em tela, pintado de verde, com motor",
    },
    gradil: {
      peca: "Gradil ou cerca", medidas: [COMPRIMENTO, ALTURA], prop: 4.6,
      dica: "Some todos os lados que vão ter gradil.",
      exemplo: "Ex.: gradil verde, com um portão social",
    },
    cobertura: {
      peca: "Cobertura metálica", medidas: [LARGURA, ALTURA, COMPRIMENTO], prop: 2.1,
      dica: "Largura e comprimento da área que vai ser coberta.",
      exemplo: "Ex.: garagem para dois carros, encostada na casa",
    },
    galpao: {
      peca: "Estrutura para galpão",
      medidas: [{ nome: "Vão (largura)", frase: "de vão" }, { nome: "Pé-direito", frase: "de pé-direito" }, COMPRIMENTO],
      prop: 1.9,
      dica: "Vão é a largura livre, sem colunas no meio. Pé-direito é a altura do piso até a estrutura.",
      exemplo: "Ex.: galpão para depósito, com fechamento lateral",
    },
    chale: {
      peca: "Estrutura para chalé A-frame", medidas: [LARGURA, ALTURA, COMPRIMENTO], prop: 0.95,
      dica: "Medidas da base do chalé e a altura até a cumeeira.",
      exemplo: "Ex.: chalé com mezanino e sacada",
    },
    grade: {
      peca: "Grade de janela", medidas: [LARGURA, ALTURA], prop: 1.15,
      dica: "Meça o vão da janela. Se forem várias, conte nos detalhes.",
      exemplo: "Ex.: 3 janelas, grade em losango",
    },
    guarda: {
      peca: "Guarda-corpo", medidas: [COMPRIMENTO, ALTURA], prop: 3.2,
      dica: "Comprimento da sacada, varanda ou escada. A altura costuma ser de 1,10 m.",
      exemplo: "Ex.: guarda-corpo de escada, pintado de preto",
    },
    esquadria: {
      peca: "Esquadria de alumínio", medidas: [LARGURA, ALTURA], prop: 0.9,
      dica: "Meça o vão da porta ou da janela.",
      exemplo: "Ex.: porta veneziana branca para a área de serviço",
    },
    solda: {
      peca: "Solda ou conserto", medidas: [], prop: 1,
      dica: "",
      exemplo: "Ex.: o portão de correr saiu do trilho",
    },
    outro: {
      peca: "Outro serviço", medidas: [LARGURA, ALTURA], prop: 1.5,
      dica: "Conte nos detalhes o que você precisa.",
      exemplo: "Conte o que você precisa",
    },
  };
  const TIPOS_PORTAO = {
    correr: { peca: "Portão de correr", prop: 2.3 },
    abrir: { peca: "Portão de abrir", prop: 2.1 },
    social: { peca: "Portão social", prop: 0.55 },
  };

  const form = $("#pedido");
  const desenho = $("#desenho");
  const campos = ["a", "b", "c"].map((k) => ({
    input: $(`#o-${k}`),
    nome: $(`#o-${k}-nome`),
  }));
  const campoC = $("#o-c-campo");
  const blocoPortao = $("#o-portao");
  const blocoMedidas = $("#o-medidas");
  const dica = $("#o-dica");
  const local = $("#o-local");
  const detalhes = $("#o-detalhes");
  const fotos = $("#o-fotos");
  const visita = $("#o-visita");
  const nome = $("#o-nome");
  const texto = $("#o-texto");
  const enviar = $("#o-enviar");
  const carimbo = { peca: $("#c-peca"), medidas: $("#c-medidas"), local: $("#c-local"), data: $("#c-data") };

  const marcado = (name) => {
    const el = form && form.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : "";
  };
  const limpo = (el) => el.value.trim().replace(/\s+/g, " ");
  const m2 = (v) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Aceita "4", "4,5", "4.50" e "4,5 m". Devolve null se estiver vazio ou não
  // for uma medida.
  function medida(input) {
    const t = input.value.trim().toLowerCase().replace(/\s*m$/, "").replace(",", ".");
    if (!t) return { valor: null, erro: false };
    if (!/^\d{1,4}(\.\d{0,3})?$/.test(t)) return { valor: null, erro: true };
    const v = parseFloat(t);
    return v > 0 ? { valor: v, erro: false } : { valor: null, erro: true };
  }

  function estado() {
    const item = marcado("o-item") || "portao";
    const tipo = marcado("o-tipo") || "correr";
    const def = ITENS[item];
    const valores = campos.map((c, i) => {
      if (i >= def.medidas.length) return null;
      const { valor, erro } = medida(c.input);
      c.input.setAttribute("aria-invalid", String(erro));
      return valor;
    });
    return {
      item, tipo, def,
      peca: item === "portao" ? TIPOS_PORTAO[tipo].peca : def.peca,
      prop: item === "portao" ? TIPOS_PORTAO[tipo].prop : def.prop,
      valores,
      local: limpo(local),
      detalhes: limpo(detalhes),
      fotos: fotos.checked,
      visita: visita.checked,
      nome: limpo(nome),
    };
  }

  function mensagem(s) {
    const linhas = ["Olá, Metalúrgica Cowboy! Vi o site e quero um orçamento."];
    linhas.push(`🔩 Serviço: ${s.peca.toLowerCase()}`);
    const ditas = s.def.medidas
      .map((m, i) => (s.valores[i] ? `${m2(s.valores[i])} m ${m.frase}` : ""))
      .filter(Boolean);
    if (ditas.length) linhas.push(`📐 Medidas: ${ditas.join(" × ")}`);
    if (s.local) linhas.push(`📍 Local: ${s.local}`);
    if (s.detalhes) linhas.push(`📝 Detalhes: ${s.detalhes}`);
    if (s.fotos) linhas.push("📷 Tenho fotos do local para mandar.");
    if (s.visita) linhas.push("📏 Quero uma visita para medir.");
    if (s.nome) linhas.push(`Meu nome é ${s.nome}.`);
    return linhas.join("\n");
  }

  /* ---------- Desenho técnico ---------- */

  const SVG = "http://www.w3.org/2000/svg";
  // Área do desenho dentro do viewBox de 400 × 290: sobra espaço embaixo e à
  // direita para o terreno e as cotas.
  const X0 = 28, Y0 = 24, AW = 296, AH = 196;
  const GALPAO_TRELICA = 0.28; // parte da altura do desenho ocupada pela treliça
  const SEM_TERRENO = ["solda", "outro", "grade", "esquadria"];
  const r1 = (n) => Math.round(n * 10) / 10;

  function no(tag, attrs, pai = desenho) {
    const el = document.createElementNS(SVG, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, typeof v === "number" ? r1(v) : v);
    pai.appendChild(el);
    return el;
  }
  const linha = (x1, y1, x2, y2, cls, pai) => no("line", { x1, y1, x2, y2, class: cls }, pai);
  const ret = (x, y, width, height, cls, pai) => no("rect", { x, y, width, height, class: cls }, pai);
  const traco = (d, cls, pai) => no("path", { d, class: cls }, pai);
  const P = (x, y) => `${r1(x)} ${r1(y)}`;

  // Retângulo da peça, apoiado no chão e centralizado na área.
  function caixa(prop) {
    const r = Math.min(Math.max(prop, 0.3), 6.5);
    let w = AW, h = AW / r;
    if (h > AH) { h = AH; w = AH * r; }
    w = Math.max(w, 46);
    h = Math.max(h, 34);
    return { x: X0 + (AW - w) / 2, y: Y0 + AH - h, w, h, chao: Y0 + AH, partida: prop > 6.5 };
  }

  // Tela soldada: fios verticais e horizontais finos.
  function malha(x, y, w, h, passoX, passoY, pai) {
    let d = "";
    for (let xx = x + passoX; xx < x + w - 1; xx += passoX) d += `M${P(xx, y)}V${r1(y + h)}`;
    for (let yy = y + passoY; yy < y + h - 1; yy += passoY) d += `M${P(x, yy)}H${r1(x + w)}`;
    if (d) traco(d, "d-malha", pai);
  }

  // Treliça de duas águas: banzos, montantes e diagonais.
  function trelica(x1, x2, yBase, yTopo, pai) {
    const xm = (x1 + x2) / 2;
    const beiral = Math.min(10, (yBase - yTopo) * 0.25);
    const topoEm = (x) => yTopo + ((yBase - beiral) - yTopo) * Math.abs(x - xm) / ((x2 - x1) / 2);
    traco(`M${P(x1, yBase)}H${r1(x2)}V${r1(yBase - beiral)}L${P(xm, yTopo)}L${P(x1, yBase - beiral)}Z`, "d-linha", pai);
    let n = Math.round((x2 - x1) / 26);
    n = Math.max(4, Math.min(14, n + (n % 2)));
    let d = "";
    for (let k = 1; k < n; k++) {
      const x = x1 + ((x2 - x1) * k) / n;
      d += `M${P(x, yBase)}V${r1(topoEm(x))}`;
    }
    for (let k = 0; k < n; k++) {
      const xa = x1 + ((x2 - x1) * k) / n;
      const xb = x1 + ((x2 - x1) * (k + 1)) / n;
      // Diagonais apontando para a cumeeira.
      d += k < n / 2 ? `M${P(xa, yBase)}L${P(xb, topoEm(xb))}` : `M${P(xb, yBase)}L${P(xa, topoEm(xa))}`;
    }
    traco(d, "d-fina", pai);
    // Terças: perfis vistos em corte, apoiados no banzo de cima.
    for (let k = 0; k <= n; k += 2) {
      const x = x1 + ((x2 - x1) * k) / n;
      ret(x - 2.5, topoEm(x) - 5, 5, 5, "d-cheio", pai);
    }
    // Telha: paralela ao banzo de cima, um pouco acima e passando do beiral.
    const queda = ((yBase - beiral) - yTopo) / (xm - x1);
    const yPonta = yBase - beiral + 8 * queda - 6;
    traco(`M${P(x1 - 8, yPonta)}L${P(xm, yTopo - 6)}L${P(x2 + 8, yPonta)}`, "d-media", pai);
  }

  function folhaPortao(x, y, w, h, pai) {
    ret(x, y, w, h, "d-linha", pai);
    const n = Math.max(1, Math.min(4, Math.round(w / 74)));
    let d = "";
    for (let k = 1; k < n; k++) d += `M${P(x + (w * k) / n, y)}V${r1(y + h)}`;
    if (d) traco(d, "d-linha", pai);
    malha(x + 3, y + 3, w - 6, h - 6, 7, 7, pai);
  }

  const DESENHOS = {
    portao(b, s, g) {
      if (s.tipo === "social") {
        folhaPortao(b.x, b.y, b.w, b.h - 6, g);
        linha(b.x + b.w - 9, b.y + b.h * 0.48, b.x + b.w - 9, b.y + b.h * 0.48 + 12, "d-linha", g);
        return;
      }
      if (s.tipo === "abrir") {
        const meia = b.w / 2;
        folhaPortao(b.x, b.y, meia - 1.5, b.h - 6, g);
        folhaPortao(b.x + meia + 1.5, b.y, meia - 1.5, b.h - 6, g);
        for (const yy of [b.y + 10, b.y + b.h - 18]) {
          ret(b.x - 3, yy, 3, 8, "d-cheio", g);
          ret(b.x + b.w, yy, 3, 8, "d-cheio", g);
        }
        return;
      }
      // De correr: a folha corre sobre rodas no trilho.
      folhaPortao(b.x, b.y, b.w, b.h - 9, g);
      for (const xx of [b.x + 14, b.x + b.w - 14]) no("circle", { cx: xx, cy: b.chao - 4.5, r: 4.5, class: "d-media" }, g);
      traco(`M${P(b.x + b.w + 6, b.chao - 1)}H${r1(Math.min(b.x + b.w + 40, X0 + AW + 14))}`, "d-tracejado", g);
    },

    gradil(b, s, g) {
      const mureta = Math.min(12, b.h * 0.12);
      const base = b.chao - mureta;
      ret(b.x, base, b.w, mureta, "d-media", g);
      // Painéis de 2,50 m quando o comprimento é conhecido.
      const comp = s.valores[0];
      let n = comp ? Math.round(comp / 2.5) : 5;
      n = Math.max(1, Math.min(b.partida ? 12 : 14, n));
      malha(b.x, b.y + 4, b.w, base - b.y - 4, 4.5, (base - b.y) / 9, g);
      for (const f of [0.3, 0.66]) {
        const yy = b.y + 4 + (base - b.y - 4) * f;
        traco(`M${P(b.x, yy - 1.6)}H${r1(b.x + b.w)}M${P(b.x, yy + 1.6)}H${r1(b.x + b.w)}`, "d-fina", g);
      }
      let d = "";
      for (let k = 0; k <= n; k++) d += `M${P(b.x + (b.w * k) / n, b.y)}V${r1(base)}`;
      traco(d, "d-linha", g);
    },

    cobertura(b, s, g) {
      const yb = b.y + b.h * 0.3;
      trelica(b.x - 6, b.x + b.w + 6, yb, b.y, g);
      ret(b.x, yb, 7, b.chao - yb, "d-linha", g);
      ret(b.x + b.w - 7, yb, 7, b.chao - yb, "d-linha", g);
    },

    // O pé-direito vai do chão até a treliça: a cota começa embaixo dela.
    galpao(b, s, g) {
      const yb = b.y + b.h * GALPAO_TRELICA;
      trelica(b.x - 4, b.x + b.w + 4, yb, b.y, g);
      ret(b.x, yb, 8, b.chao - yb, "d-linha", g);
      ret(b.x + b.w - 8, yb, 8, b.chao - yb, "d-linha", g);
      // Portão do galpão no meio da fachada.
      const pw = b.w * 0.34, ph = (b.chao - yb) * 0.62;
      const px = b.x + (b.w - pw) / 2;
      ret(px, b.chao - ph, pw, ph, "d-media", g);
      let d = "";
      for (let xx = px + 5; xx < px + pw - 1; xx += 5) d += `M${P(xx, b.chao - ph)}V${r1(b.chao)}`;
      traco(d, "d-malha", g);
      return yb;
    },

    chale(b, s, g) {
      const xm = b.x + b.w / 2;
      const piso = b.chao - Math.min(14, b.h * 0.08);
      // Pilares embaixo do piso elevado.
      for (const xx of [b.x + 6, xm - 3, b.x + b.w - 12]) ret(xx, piso, 6, b.chao - piso, "d-media", g);
      traco(`M${P(b.x, piso)}L${P(xm, b.y)}L${P(b.x + b.w, piso)}Z`, "d-linha", g);
      const e = Math.max(7, b.w * 0.035);
      traco(`M${P(b.x + e * 1.6, piso)}L${P(xm, b.y + e * 2)}L${P(b.x + b.w - e * 1.6, piso)}`, "d-fina", g);
      // Mezanino com a sacada de aço.
      const ys = b.y + (piso - b.y) * 0.5;
      const meia = ((piso - ys) / (piso - b.y)) * (b.w / 2);
      ret(xm - meia * 0.62, ys, meia * 1.24, 4, "d-cheio", g);
      const gy = ys - Math.min(18, b.h * 0.09);
      let d = `M${P(xm - meia * 0.62, gy)}H${r1(xm + meia * 0.62)}`;
      for (let xx = xm - meia * 0.62; xx <= xm + meia * 0.62 + 0.5; xx += Math.max(6, meia * 0.62 / 4)) d += `M${P(xx, gy)}V${r1(ys)}`;
      traco(d, "d-fina", g);
      // Fachada de vidro.
      const vw = b.w * 0.3;
      ret(xm - vw / 2, ys + 4, vw, piso - ys - 4, "d-media", g);
      linha(xm, ys + 4, xm, piso, "d-fina", g);
    },

    grade(b, s, g) {
      ret(b.x, b.y, b.w, b.h, "d-linha", g);
      const ix = b.x + 5, iy = b.y + 5, iw = b.w - 10, ih = b.h - 10;
      ret(ix, iy, iw, ih, "d-fina", g);
      const defs = no("defs", {}, g);
      const clip = no("clipPath", { id: "corte-grade" }, defs);
      ret(ix, iy, iw, ih, "", clip);
      const passo = Math.max(20, Math.min(40, Math.min(iw, ih) / 3));
      let d = "";
      for (let k = -ih; k < iw + ih; k += passo) {
        d += `M${P(ix + k, iy)}L${P(ix + k + ih, iy + ih)}`;
        d += `M${P(ix + k, iy + ih)}L${P(ix + k + ih, iy)}`;
      }
      const losangos = traco(d, "d-media", g);
      losangos.setAttribute("clip-path", "url(#corte-grade)");
    },

    guarda(b, s, g) {
      const base = b.chao - 7;
      ret(b.x, b.y, b.w, 5, "d-cheio", g);
      linha(b.x, base, b.x + b.w, base, "d-linha", g);
      let d = "";
      for (let xx = b.x + 6; xx < b.x + b.w - 3; xx += 7) d += `M${P(xx, b.y + 5)}V${r1(base)}`;
      traco(d, "d-fina", g);
      const comp = s.valores[0];
      let n = comp ? Math.round(comp / 1.2) : Math.round(b.w / 60);
      n = Math.max(1, Math.min(14, n));
      d = "";
      for (let k = 0; k <= n; k++) d += `M${P(b.x + (b.w * k) / n, b.y)}V${r1(b.chao)}`;
      traco(d, "d-linha", g);
    },

    esquadria(b, s, g) {
      ret(b.x, b.y, b.w, b.h, "d-linha", g);
      const folhas = b.w > b.h * 1.1 ? 2 : 1;
      const fw = (b.w - 10) / folhas;
      for (let f = 0; f < folhas; f++) {
        const fx = b.x + 5 + f * fw;
        ret(fx, b.y + 5, fw, b.h - 10, "d-media", g);
        let d = "";
        for (let yy = b.y + 11; yy < b.y + b.h - 8; yy += 7) d += `M${P(fx + 4, yy)}H${r1(fx + fw - 4)}M${P(fx + 4, yy + 2.2)}H${r1(fx + fw - 4)}`;
        traco(d, "d-malha", g);
      }
      const mx = folhas === 2 ? b.x + b.w / 2 : b.x + b.w - 13;
      linha(mx + (folhas === 2 ? -5 : 0), b.y + b.h * 0.47, mx + (folhas === 2 ? -5 : 0), b.y + b.h * 0.47 + 14, "d-linha", g);
    },

    // Detalhe de solda: junta em T vista em corte, com o símbolo de solda de
    // filete dos dois lados.
    solda(b, s, g) {
      const cx = X0 + AW / 2 - 40, cy = Y0 + AH - 40;
      const defs = no("defs", {}, g);
      const hach = no("pattern", { id: "hachura", width: 6, height: 6, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, defs);
      linha(0, 0, 0, 6, "d-hachura", hach);
      const chapa = (x, y, w, h) => {
        no("rect", { x, y, width: w, height: h, fill: "url(#hachura)" }, g);
        ret(x, y, w, h, "d-linha", g);
      };
      chapa(cx - 120, cy, 240, 18);
      chapa(cx - 9, cy - 120, 18, 120);
      traco(`M${P(cx - 9, cy)}V${r1(cy - 16)}L${P(cx - 25, cy)}Z`, "d-cheio", g);
      traco(`M${P(cx + 9, cy)}V${r1(cy - 16)}L${P(cx + 25, cy)}Z`, "d-cheio", g);
      // Seta, linha de referência e o triângulo do filete.
      const rx = cx + 74, ry = cy - 78;
      const wx = cx + 20, wy = cy - 8;
      traco(`M${P(wx, wy)}L${P(rx, ry)}H${r1(rx + 104)}`, "d-media", g);
      const len = Math.hypot(rx - wx, ry - wy);
      const ux = (rx - wx) / len, uy = (ry - wy) / len;
      traco(`M${P(wx, wy)}L${P(wx + 12 * ux + 4 * uy, wy + 12 * uy - 4 * ux)}L${P(wx + 12 * ux - 4 * uy, wy + 12 * uy + 4 * ux)}Z`, "d-cheio", g);
      traco(`M${P(rx + 34, ry)}v-14l14 14zM${P(rx + 34, ry)}v14l14 -14z`, "d-media", g);
      traco(`M${P(rx + 104, ry)}l9 -9M${P(rx + 104, ry)}l9 9`, "d-media", g);
      no("text", { x: rx + 52, y: ry - 22, class: "d-nota" }, g).textContent = "Solda de filete";
    },

    outro(b, s, g) {
      ret(b.x, b.y, b.w, b.h, "d-tracejado", g);
      const t = no("text", { x: b.x + b.w / 2, y: b.y + b.h / 2 + 5, "text-anchor": "middle", class: "d-nota" }, g);
      t.textContent = "A definir";
    },
  };

  // Linha de interrupção no meio de uma peça comprida demais para a folha.
  function interrupcao(b, g) {
    const cx = b.x + b.w / 2, ym = (b.y + b.chao) / 2;
    ret(cx - 5, b.y - 6, 10, b.chao - b.y + 12, "d-papel", g);
    for (const dx of [-5, 5]) {
      const x = cx + dx;
      traco(`M${P(x, b.y - 8)}V${r1(ym - 9)}L${P(x - 6, ym - 3)}L${P(x + 6, ym + 3)}L${P(x, ym + 9)}V${r1(b.chao + 8)}`, "d-fina", g);
    }
  }

  // Cotas: linhas de chamada, linha de cota com traços oblíquos e o valor.
  function cotas(b, s, topo, comTerreno) {
    const g = no("g", { class: "cotas" });
    const [mh, mv] = s.def.medidas;
    const [vh, vv] = s.valores;
    const obliquo = (x, y) => `M${P(x - 4, y + 4)}L${P(x + 4, y - 4)}`;
    const valor = (v, m) => (v ? `${m2(v)} m` : m.nome.toLowerCase());
    if (mh) {
      const yc = b.chao + 34;
      let d = `M${P(b.x, b.chao + 8)}V${r1(yc + 6)}M${P(b.x + b.w, b.chao + 8)}V${r1(yc + 6)}`;
      d += `M${P(b.x - 6, yc)}H${r1(b.x + b.w + 6)}` + obliquo(b.x, yc) + obliquo(b.x + b.w, yc);
      traco(d, "d-cota", g);
      const t = no("text", { x: b.x + b.w / 2, y: yc - 7, "text-anchor": "middle", class: `d-cota-texto${vh ? "" : " vazia"}` }, g);
      t.textContent = valor(vh, mh);
    }
    if (mv) {
      const xc = b.x + b.w + 30;
      let d = `M${P(b.x + b.w + 8, topo)}H${r1(xc + 6)}M${P(b.x + b.w + (comTerreno ? 25 : 8), b.chao)}H${r1(xc + 6)}`;
      d += `M${P(xc, topo - 6)}V${r1(b.chao + 6)}` + obliquo(xc, topo) + obliquo(xc, b.chao);
      traco(d, "d-cota", g);
      const ym = (topo + b.chao) / 2;
      const t = no("text", { x: xc + 16, y: ym, "text-anchor": "middle", transform: `rotate(-90 ${r1(xc + 16)} ${r1(ym)})`, class: `d-cota-texto${vv ? "" : " vazia"}` }, g);
      t.textContent = valor(vv, mv);
    }
  }

  // Terreno: linha do chão com hachuras curtas por baixo.
  function terreno(b) {
    const x1 = Math.max(6, b.x - 22), x2 = Math.min(394, b.x + b.w + 22);
    const g = no("g", {});
    linha(x1, b.chao, x2, b.chao, "d-terreno", g);
    let d = "";
    for (let x = x1 + 6; x <= x2; x += 8) d += `M${P(x, b.chao)}l-6 6`;
    traco(d, "d-hachura", g);
  }

  function desenhar(s, animar) {
    desenho.replaceChildren();
    const temMedidas = s.valores[0] && s.valores[1];
    let prop = temMedidas ? s.valores[0] / s.valores[1] : s.prop;
    // No galpão a altura informada é o pé-direito; a treliça fica por cima.
    if (temMedidas && s.item === "galpao") prop *= 1 - GALPAO_TRELICA;
    const b = caixa(prop);
    const comTerreno = !SEM_TERRENO.includes(s.item);
    if (comTerreno) terreno(b);
    const g = no("g", {});
    const topo = DESENHOS[s.item](b, s, g) ?? b.y;
    if (b.partida && s.item !== "solda") interrupcao(b, g);
    if (s.item !== "solda") {
      cotas(b, s, topo, comTerreno);
      // Centraliza o conjunto (peça, terreno e cotas) na folha.
      const [mh, mv] = s.def.medidas;
      const esq = b.x - (comTerreno ? 22 : 10);
      const dir = b.x + b.w + (mv ? 48 : 24);
      const cima = b.y - 14;
      const baixo = b.chao + (mh ? 44 : 14);
      const raiz = document.createElementNS(SVG, "g");
      raiz.setAttribute("transform", `translate(${r1((400 - (dir - esq)) / 2 - esq)} ${r1((290 - (baixo - cima)) / 2 - cima)})`);
      raiz.append(...desenho.childNodes);
      desenho.append(raiz);
    }

    const ditas = s.def.medidas
      .map((m, i) => (s.valores[i] ? `${m2(s.valores[i])} m ${m.frase}` : ""))
      .filter(Boolean);
    desenho.setAttribute("aria-label", `Desenho: ${s.peca.toLowerCase()}${ditas.length ? `, ${ditas.join(" por ")}` : ", medidas a definir"}`);

    if (animar) {
      desenho.classList.remove("tracando");
      void desenho.getBoundingClientRect();
      desenho.classList.add("tracando");
    }
  }

  let ultimoDesenho = "";

  function atualizar() {
    const s = estado();

    // Campos que mudam com o serviço.
    blocoPortao.hidden = s.item !== "portao";
    blocoMedidas.hidden = s.def.medidas.length === 0;
    campoC.hidden = s.def.medidas.length < 3;
    s.def.medidas.forEach((m, i) => { campos[i].nome.textContent = m.nome; });
    dica.textContent = s.def.dica;
    dica.hidden = !s.def.dica;
    detalhes.placeholder = s.def.exemplo;

    // Carimbo.
    carimbo.peca.textContent = s.peca;
    const nums = s.valores.filter(Boolean);
    carimbo.medidas.textContent = s.def.medidas.length === 0 ? "ver detalhes" : nums.length ? `${nums.map(m2).join(" × ")} m` : "a medir";
    carimbo.local.textContent = s.local || "a informar";

    // Redesenha com o traço animado só quando a peça muda.
    const chave = `${s.item}|${s.tipo}`;
    desenhar(s, chave !== ultimoDesenho && ultimoDesenho !== "");
    ultimoDesenho = chave;

    const atual = mensagem(s);
    texto.textContent = atual;
    enviar.href = `https://wa.me/${NUMERO}?text=${encodeURIComponent(atual)}`;
  }

  if (form && desenho && texto && enviar) {
    carimbo.data.textContent = new Date().toLocaleDateString("pt-BR");
    form.addEventListener("input", atualizar);
    form.addEventListener("change", atualizar);
    form.addEventListener("submit", (event) => event.preventDefault());
    // "Ir" no teclado do celular só fecha o teclado.
    for (const el of [local, nome, ...campos.map((c) => c.input)]) {
      el.addEventListener("keydown", (event) => {
        if (event.key === "Enter") { event.preventDefault(); el.blur(); }
      });
    }
    atualizar();
  }

  /* ================= Galeria ================= */

  const galeria = $("#galeria");
  const botoesFiltro = $$(".filtro");
  const verMais = $("#ver-mais");
  const LIMITE = 12;
  let filtro = "todas";
  let tudo = false;

  function filtrar() {
    let mostradas = 0;
    let guardadas = 0;
    for (const obra of $$(".obra", galeria)) {
      const entra = filtro === "todas" || obra.dataset.cat === filtro;
      const sobra = entra && filtro === "todas" && !tudo && mostradas >= LIMITE;
      if (entra && !sobra) mostradas++;
      if (sobra) guardadas++;
      obra.hidden = !entra || sobra;
    }
    verMais.hidden = guardadas === 0;
    verMais.textContent = `Ver mais ${guardadas} fotos`;
    for (const b of botoesFiltro) b.setAttribute("aria-pressed", String(b.dataset.filtro === filtro));
  }

  if (galeria && verMais) {
    for (const b of botoesFiltro) {
      b.addEventListener("click", () => { filtro = b.dataset.filtro; filtrar(); });
    }
    verMais.addEventListener("click", () => { tudo = true; filtrar(); });
    // Os "Ver fotos" dos serviços já chegam na galeria filtrada.
    for (const a of $$("a[data-filtro]")) {
      a.addEventListener("click", () => { filtro = a.dataset.filtro; filtrar(); });
    }
    filtrar();
  }

  /* ---------- Foto ampliada ---------- */

  const caixaFoto = $("#ampliada");
  const fotoGrande = $("#ampliada-foto");
  const legenda = $("#ampliada-legenda");
  let lista = [];
  let atual = 0;

  function mostrar(i) {
    atual = (i + lista.length) % lista.length;
    const a = lista[atual];
    const mini = a.querySelector("img");
    fotoGrande.src = a.getAttribute("href");
    fotoGrande.alt = mini.alt;
    legenda.textContent = mini.alt;
  }

  if (galeria && caixaFoto && typeof caixaFoto.showModal === "function") {
    galeria.addEventListener("click", (event) => {
      const a = event.target.closest("a.obra-foto");
      if (!a) return;
      event.preventDefault();
      lista = $$(".obra:not([hidden]) a.obra-foto", galeria);
      mostrar(lista.indexOf(a));
      caixaFoto.showModal();
    });
    $("#ampliada-fechar").addEventListener("click", () => caixaFoto.close());
    $("#ampliada-antes").addEventListener("click", () => mostrar(atual - 1));
    $("#ampliada-depois").addEventListener("click", () => mostrar(atual + 1));
    caixaFoto.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") mostrar(atual - 1);
      if (event.key === "ArrowRight") mostrar(atual + 1);
    });
    // Toque fora da foto fecha.
    caixaFoto.addEventListener("click", (event) => {
      if (event.target === caixaFoto || event.target.classList.contains("ampliada-in")) caixaFoto.close();
    });
    // Arrastar para o lado troca de foto no celular.
    let inicioX = null;
    caixaFoto.addEventListener("touchstart", (event) => { inicioX = event.touches[0].clientX; }, { passive: true });
    caixaFoto.addEventListener("touchend", (event) => {
      if (inicioX === null) return;
      const dx = event.changedTouches[0].clientX - inicioX;
      if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
      inicioX = null;
    });
  }

  /* ================= Botão flutuante ================= */

  const flutuante = $("#flutuante");
  const acoes = $("#abertura-acoes");
  const finais = [$("#contato"), $("#o-enviar")].filter(Boolean);

  if ("IntersectionObserver" in window && flutuante && acoes) {
    let acima = true;
    const vendo = new Set();
    const decidir = () => flutuante.classList.toggle("ver", !acima && vendo.size === 0);
    // Aparece quando os botões da abertura saem da tela e some onde a página
    // já tem o próprio botão de WhatsApp à vista.
    new IntersectionObserver(([entrada]) => {
      acima = entrada.isIntersecting || entrada.boundingClientRect.top > 0;
      decidir();
    }).observe(acoes);
    const obs = new IntersectionObserver((entradas) => {
      for (const e of entradas) e.isIntersecting ? vendo.add(e.target) : vendo.delete(e.target);
      decidir();
    });
    finais.forEach((el) => obs.observe(el));
  }
})();
