// Área privada /admin: lista de prospecção.
// Os dados vêm da API do Worker (worker/index.js), que só responde depois do
// login do Cloudflare Access. Arquivo separado porque a CSP do site bloqueia
// scripts dentro do HTML desta área.
(() => {
  "use strict";

  const STATUS = [
    { id: "novo", label: "A contatar", chip: "A contatar" },
    { id: "enviado", label: "Mensagem enviada", chip: "Enviadas" },
    { id: "respondeu", label: "Respondeu", chip: "Responderam" },
    { id: "conversa", label: "Em negociação", chip: "Negociando" },
    { id: "fechado", label: "Fechou", chip: "Fecharam" },
    { id: "sem_interesse", label: "Sem interesse", chip: "Sem interesse" },
  ];
  const FOLLOWUP_DAYS = 3;
  const FOLLOWUP =
    "Oi! Passando só para saber se você conseguiu ver minha mensagem. Se não for o momento, sem problema, fico à disposição.";
  const DAY = 86400000;
  const API = "/admin/api/leads";

  const $ = (sel, root = document) => root.querySelector(sel);
  const state = {
    leads: new Map(),
    cards: new Map(),
    filter: "todos",
    onlyP1: false,
    loaded: false,
    lastLoad: 0,
  };

  // Filtros: só conveniência deste navegador.
  try {
    const saved = JSON.parse(localStorage.getItem("admin.prospeccao.filtros") || "null");
    if (saved && typeof saved === "object") {
      if (typeof saved.filter === "string") state.filter = saved.filter;
      state.onlyP1 = Boolean(saved.onlyP1);
    }
  } catch {
    /* sem armazenamento: segue com o padrão */
  }
  const saveFilters = () => {
    try {
      localStorage.setItem("admin.prospeccao.filtros", JSON.stringify({ filter: state.filter, onlyP1: state.onlyP1 }));
    } catch {
      /* ignora */
    }
  };

  /* ---------- API ---------- */

  async function request(path, options = {}) {
    let res;
    try {
      res = await fetch(path, {
        credentials: "same-origin",
        redirect: "manual",
        ...options,
        headers: options.body ? { "content-type": "application/json" } : {},
      });
    } catch {
      throw Object.assign(new Error("rede"), { code: "network" });
    }
    // O Access redireciona para o login quando a sessão expira.
    if (res.type === "opaqueredirect" || res.status === 0) throw Object.assign(new Error("sessão"), { code: "session" });
    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    if (!res.ok) {
      const code = res.status === 401 || res.status === 403 ? "auth" : res.status === 503 ? "setup" : "http";
      throw Object.assign(new Error((data && data.error) || "Erro"), { code, status: res.status });
    }
    return data;
  }

  function explain(error) {
    switch (error && error.code) {
      case "session":
        return "Sua sessão expirou. Recarregue a página para entrar de novo.";
      case "auth":
        return "Sem acesso. Recarregue a página e entre com a sua conta.";
      case "setup":
        return "O login desta área ainda não foi configurado.";
      case "network":
        return "Sem conexão com o servidor. Confira a internet e tente de novo.";
      default:
        return (error && error.message) || "Algo deu errado. Tente de novo.";
    }
  }

  function showNotice(text) {
    const n = $("#notice");
    n.textContent = text || "";
    n.hidden = !text;
  }

  async function load() {
    try {
      const data = await request(API);
      state.leads = new Map((data.leads || []).map((lead) => [lead.id, lead]));
      // Depois do primeiro envio, as instruções já são conhecidas: começam recolhidas.
      if (!state.lastLoad && [...state.leads.values()].some((lead) => lead.status !== "novo")) {
        $("#howto").open = false;
      }
      state.lastLoad = Date.now();
      showNotice("");
    } catch (error) {
      showNotice(explain(error));
    }
    state.loaded = true;
    render();
  }

  // Uma escrita por vez em cada ficha.
  const queues = new Map();
  function save(id, patch) {
    const run = async () => {
      try {
        const data = await request(`${API}/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(patch) });
        state.leads.set(id, data.lead);
        setCardError(id, "");
        render();
        return true;
      } catch (error) {
        setCardError(id, error.code === "http" ? explain(error) : `Não salvou. ${explain(error)}`);
        if (error.code === "session" || error.code === "auth") showNotice(explain(error));
        // Volta a ficha para o que está salvo.
        load();
        return false;
      }
    };
    const next = (queues.get(id) || Promise.resolve()).then(run, run);
    queues.set(id, next);
    return next;
  }

  /* ---------- Utilidades ---------- */

  const fmtRating = (r) => (typeof r === "number" ? r.toLocaleString("pt-BR", { maximumFractionDigits: 1 }) : "");
  const fmtDate = (iso) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };
  const daysSince = (iso) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? 0 : Math.floor((Date.now() - d.getTime()) / DAY);
  };
  const waLink = (wa, text) => `https://wa.me/${encodeURIComponent(wa || "")}?text=${encodeURIComponent(text || "")}`;

  async function copyText(text, fallbackEl, button) {
    const label = button.textContent;
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "Copiado";
    } catch {
      if (fallbackEl) {
        const range = document.createRange();
        range.selectNodeContents(fallbackEl);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
      button.textContent = "Texto selecionado, copie";
    }
    setTimeout(() => {
      button.textContent = label;
    }, 1800);
  }

  function setCardError(id, text) {
    const card = state.cards.get(id);
    if (!card) return;
    const el = $(".card-err", card);
    el.textContent = text;
    el.hidden = !text;
  }

  function setStatus(id, status) {
    const lead = state.leads.get(id);
    if (!lead || lead.status === status) return;
    const card = state.cards.get(id);
    if (card) card.dataset.status = status;
    save(id, { status });
  }

  /* ---------- Fichas ---------- */

  function buildCard(id) {
    const card = $("#card-tpl").content.firstElementChild.cloneNode(true);
    card.dataset.id = id;

    const select = $(".status-select", card);
    select.id = `status-${id}`;
    $(".status-field", card).htmlFor = select.id;
    for (const s of STATUS) {
      const option = document.createElement("option");
      option.value = s.id;
      option.textContent = s.label;
      select.append(option);
    }
    select.addEventListener("change", () => setStatus(id, select.value));

    const notes = $(".notes", card);
    notes.id = `notes-${id}`;
    $(".notes-field", card).htmlFor = notes.id;
    let timer = null;
    const saveNotes = () => {
      clearTimeout(timer);
      const lead = state.leads.get(id);
      if (!lead || (lead.notes || "") === notes.value) return;
      save(id, { notes: notes.value });
    };
    notes.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(saveNotes, 900);
    });
    notes.addEventListener("blur", saveNotes);

    $(".copy-msg", card).addEventListener("click", (event) => {
      const lead = state.leads.get(id);
      copyText(lead ? lead.message : "", $(".msg", card), event.currentTarget);
    });
    $(".copy-phone", card).addEventListener("click", (event) => {
      const lead = state.leads.get(id);
      copyText(lead ? lead.phone : "", $(".phone", card), event.currentTarget);
    });
    $(".copy-followup", card).addEventListener("click", (event) => {
      copyText(FOLLOWUP, $(".followup-text", card), event.currentTarget);
    });

    $(".btn.wa", card).addEventListener("click", () => {
      const lead = state.leads.get(id);
      if (lead && (lead.status || "novo") === "novo") $(".after-send", card).hidden = false;
    });
    $(".mark-sent", card).addEventListener("click", () => {
      $(".after-send", card).hidden = true;
      setStatus(id, "enviado");
    });

    const editor = $(".msg-editor", card);
    const msgEl = $(".msg", card);
    const area = $(".msg-edit", card);
    area.id = `msg-${id}`;
    $(".edit-msg", card).addEventListener("click", () => {
      const lead = state.leads.get(id);
      area.value = lead ? lead.message : "";
      editor.hidden = false;
      msgEl.hidden = true;
      area.focus();
    });
    $(".cancel-msg", card).addEventListener("click", () => {
      editor.hidden = true;
      msgEl.hidden = false;
    });
    $(".save-msg", card).addEventListener("click", () => {
      const lead = state.leads.get(id);
      const text = area.value.trim();
      editor.hidden = true;
      msgEl.hidden = false;
      if (!lead || !text || text === lead.message) return;
      msgEl.textContent = text;
      save(id, { message: text });
    });
    return card;
  }

  function fillCard(card, lead) {
    const status = STATUS.some((s) => s.id === lead.status) ? lead.status : "novo";
    card.dataset.status = status;
    $(".name", card).textContent = lead.name || "Empresa sem nome";

    const meta = $(".meta", card);
    const bits = [lead.niche, lead.area].filter(Boolean).join(" · ");
    meta.textContent = bits;
    if (lead.reviews > 0) {
      const stars = document.createElement("span");
      stars.className = "stars";
      stars.textContent = `${lead.reviews} avaliações` + (lead.rating ? `, nota ${fmtRating(lead.rating)}` : "");
      meta.append(bits ? " · " : "", stars);
    }

    const prio = $(".prio", card);
    prio.dataset.p = String(lead.priority || 2);
    prio.textContent = lead.priority === 1 ? "Prioridade 1" : "Prioridade 2";
    $(".finding", card).textContent = lead.finding || "—";
    $(".offer", card).textContent = lead.offer || "—";
    $(".check", card).hidden = !lead.check;
    $(".check-text", card).textContent = lead.check || "";

    if ($(".msg-editor", card).hidden) $(".msg", card).textContent = lead.message || "";
    $(".btn.wa", card).href = waLink(lead.wa, lead.message);
    $(".phone", card).textContent = lead.phone || "";

    const links = $(".links", card);
    links.replaceChildren();
    const all = [];
    if (lead.adUrl) all.push({ label: "Anúncio", url: lead.adUrl });
    for (const link of Array.isArray(lead.links) ? lead.links : []) if (link && link.url) all.push(link);
    all.forEach((link, index) => {
      if (index) links.append(" · ");
      const a = document.createElement("a");
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = link.label || "Link";
      links.append(a);
    });

    const select = $(".status-select", card);
    if (document.activeElement !== select) select.value = status;
    const notes = $(".notes", card);
    if (document.activeElement !== notes && notes.value !== (lead.notes || "")) notes.value = lead.notes || "";

    const sentInfo = $(".sent-info", card);
    const followup = $(".followup", card);
    if (status === "enviado" && lead.sentAt) {
      const days = daysSince(lead.sentAt);
      sentInfo.hidden = false;
      sentInfo.textContent =
        `Mensagem enviada em ${fmtDate(lead.sentAt)}` +
        (days === 0 ? " (hoje)." : days === 1 ? " (ontem)." : ` (há ${days} dias).`);
      followup.hidden = days < FOLLOWUP_DAYS;
      if (!followup.hidden) {
        $(".followup-text", card).textContent = `Já se passaram ${days} dias sem resposta. Hora de um retorno curto: “${FOLLOWUP}”`;
        $(".followup-wa", card).href = waLink(lead.wa, FOLLOWUP);
      }
    } else {
      sentInfo.hidden = true;
      followup.hidden = true;
    }
    if (status !== "novo") $(".after-send", card).hidden = true;
  }

  function renderChips(counts, total) {
    const wrap = $("#chips");
    if (!wrap.childElementCount) {
      for (const s of [{ id: "todos", chip: "Todas" }, ...STATUS]) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "chip";
        button.dataset.filter = s.id;
        const label = document.createElement("span");
        label.textContent = s.chip;
        const n = document.createElement("span");
        n.className = "n";
        button.append(label, n);
        button.addEventListener("click", () => {
          state.filter = s.id;
          saveFilters();
          render();
        });
        wrap.append(button);
      }
    }
    for (const button of wrap.querySelectorAll(".chip")) {
      const id = button.dataset.filter;
      button.setAttribute("aria-pressed", String(state.filter === id));
      button.querySelector(".n").textContent = id === "todos" ? total : counts[id] || 0;
    }
  }

  function render() {
    const entries = [...state.leads.values()].sort(
      (a, b) => (a.priority || 9) - (b.priority || 9) || (a.order || 0) - (b.order || 0),
    );
    const counts = {};
    for (const lead of entries) counts[lead.status || "novo"] = (counts[lead.status || "novo"] || 0) + 1;
    renderChips(counts, entries.length);
    $("#only-p1").checked = state.onlyP1;

    for (const [id, card] of state.cards) {
      if (!state.leads.has(id)) {
        card.remove();
        state.cards.delete(id);
      }
    }
    const empty = $("#empty");
    let anchor = empty;
    let visible = 0;
    for (const lead of entries) {
      let card = state.cards.get(lead.id);
      if (!card) {
        card = buildCard(lead.id);
        state.cards.set(lead.id, card);
      }
      fillCard(card, lead);
      if (anchor.nextElementSibling !== card) anchor.after(card);
      anchor = card;
      const show =
        (state.filter === "todos" || (lead.status || "novo") === state.filter) && (!state.onlyP1 || lead.priority === 1);
      card.hidden = !show;
      if (show) visible++;
    }

    if (!state.loaded) return;
    if (entries.length === 0) {
      empty.hidden = false;
      $("#empty-title").textContent = state.lastLoad ? "A lista está vazia." : "A lista não carregou.";
      $("#empty-text").textContent = state.lastLoad
        ? "Use “Adicionar empresa” aqui embaixo para incluir a primeira."
        : "Veja o aviso acima e recarregue a página.";
    } else if (visible === 0) {
      empty.hidden = false;
      $("#empty-title").textContent = "Nenhuma empresa neste filtro.";
      $("#empty-text").textContent = "Escolha outro status no placar acima.";
    } else {
      empty.hidden = true;
    }
    const p1Left = entries.filter((l) => l.priority === 1 && (l.status || "novo") === "novo").length;
    $("#lead").textContent =
      `${entries.length} empresas de serviço com WhatsApp. Cada ficha diz o que encontrei, o que oferecer e traz a mensagem pronta.` +
      (p1Left ? ` Ainda faltam ${p1Left} da prioridade 1.` : "");
  }

  /* ---------- Formulário ---------- */

  $("#only-p1").addEventListener("change", (event) => {
    state.onlyP1 = event.currentTarget.checked;
    saveFilters();
    render();
  });

  $("#add-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const err = $("#add-err");
    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();
    if (!name || phone.replace(/\D/g, "").length < 10) {
      err.textContent = !name ? "Informe o nome da empresa." : "Informe o WhatsApp com DDD, por exemplo (47) 99999-9999.";
      err.hidden = false;
      return;
    }
    err.hidden = true;
    const button = $("#add-submit");
    button.disabled = true;
    try {
      const data = await request(API, {
        method: "POST",
        body: JSON.stringify({
          name,
          phone,
          niche: form.elements.niche.value.trim(),
          area: form.elements.area.value.trim(),
          finding: form.elements.finding.value.trim(),
          message: form.elements.message.value.trim(),
        }),
      });
      state.leads.set(data.lead.id, data.lead);
      form.reset();
      $("#add").open = false;
      render();
    } catch (error) {
      err.textContent = explain(error);
      err.hidden = false;
    } finally {
      button.disabled = false;
    }
  });

  // Ao voltar para a aba, busca de novo (a lista pode ter mudado em outro aparelho).
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && Date.now() - state.lastLoad > 30000) load();
  });

  render();
  load();
})();
