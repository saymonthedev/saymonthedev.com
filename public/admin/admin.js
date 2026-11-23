// Área privada /admin: lista de prospecção, feita para usar no celular.
// Os dados vêm da API do Worker (worker/index.js), que só responde depois do
// login do Cloudflare Access. Arquivo separado porque a CSP do site bloqueia
// scripts dentro do HTML desta área.
(() => {
  "use strict";

  const STATUS = {
    novo: { label: "A contatar", short: "A contatar" },
    enviado: { label: "Mensagem enviada", short: "Enviada" },
    respondeu: { label: "Respondeu", short: "Respondeu" },
    conversa: { label: "Em negociação", short: "Negociando" },
    fechado: { label: "Fechou", short: "Fechou" },
    sem_interesse: { label: "Sem interesse", short: "Sem interesse" },
  };
  const TABS = ["agora", "aguardando", "encerradas", "todas"];
  // Ordem dos grupos em cada aba: o que pede ação mais urgente vem primeiro.
  const GROUPS = {
    agora: [
      ["respondeu", "Responderam"],
      ["conversa", "Em negociação"],
      ["retorno", "Hora do retorno"],
      ["novo", "Primeira mensagem"],
    ],
    aguardando: [
      ["enviada", "Esperando resposta"],
      ["retorno-enviado", "Retorno enviado"],
    ],
    encerradas: [
      ["fechado", "Fecharam"],
      ["sem_interesse", "Sem interesse"],
    ],
  };
  const EMPTY = {
    agora: [
      "Nada para fazer agora.",
      "Os retornos voltam para cá 3 dias depois da primeira mensagem. Para incluir empresas, toque em + Empresa.",
    ],
    aguardando: ["Ninguém esperando resposta.", "Quem recebeu mensagem e ainda não respondeu aparece aqui."],
    encerradas: ["Nenhuma encerrada ainda.", "Quem fechar ou disser que não tem interesse vem para cá."],
    todas: ["A lista está vazia.", "Toque em + Empresa para incluir a primeira."],
  };
  const FOLLOWUP_DAYS = 3;
  const FOLLOWUP =
    "Oi! Passando só para saber se você conseguiu ver minha mensagem. Se não for o momento, sem problema, fico à disposição.";
  const DAY = 86400000;
  const API = "/admin/api/leads";
  const KEY_TAB = "admin.prospeccao.aba";
  const KEY_PENDING = "admin.prospeccao.pendente";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // Aba escolhida e envios a confirmar: só conveniência deste navegador.
  const store = {
    get(key, fallback) {
      try {
        const value = JSON.parse(localStorage.getItem(key) || "null");
        return value ?? fallback;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* sem armazenamento: segue sem lembrar */
      }
    },
  };

  const savedTab = store.get(KEY_TAB, "");
  const state = {
    leads: new Map(),
    cards: new Map(),
    groups: new Map(),
    expanded: new Set(),
    seq: new Map(),
    tab: TABS.includes(savedTab) ? savedTab : "agora",
    query: "",
    loaded: false,
    failed: false,
    lastLoad: 0,
    loading: null,
    pending: new Map(),
  };
  // Envio a confirmar: o botão verde abriu o WhatsApp e falta o "Sim, enviei".
  for (const [id, item] of Object.entries(store.get(KEY_PENDING, {}) || {})) {
    if (item && (item.kind === "first" || item.kind === "followup") && Date.now() - item.at < 12 * 3600000) {
      state.pending.set(id, item);
    }
  }
  const savePending = () => store.set(KEY_PENDING, Object.fromEntries(state.pending));

  /* ---------- API ---------- */

  async function request(path, options = {}) {
    let res;
    try {
      res = await fetch(path, {
        credentials: "same-origin",
        redirect: "manual",
        cache: "no-store",
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
        return "Sua sessão expirou. Entre de novo para continuar.";
      case "auth":
        return "Sem acesso. Entre de novo com a sua conta.";
      case "setup":
        return "O login desta área ainda não foi configurado.";
      case "network":
        return "Sem conexão com o servidor. Confira a internet.";
      default:
        return (error && error.message) || "Algo deu errado. Tente de novo.";
    }
  }

  function showNotice(error) {
    const box = $("#notice");
    if (!error) {
      box.hidden = true;
      return;
    }
    $("#notice-text").textContent = explain(error);
    const action = $("#notice-action");
    const relogin = error.code === "session" || error.code === "auth";
    action.textContent = relogin ? "Entrar de novo" : "Tentar de novo";
    action.onclick = relogin ? () => location.reload() : () => load({ manual: true });
    box.hidden = false;
  }

  function load({ manual = false } = {}) {
    if (state.loading) return state.loading;
    const button = $("#reload");
    button.classList.add("spin");
    state.loading = (async () => {
      try {
        const data = await request(API);
        state.leads = new Map((data.leads || []).map((lead) => [lead.id, lead]));
        state.lastLoad = Date.now();
        state.failed = false;
        showNotice(null);
        if (manual) toast("Lista atualizada.");
      } catch (error) {
        state.failed = true;
        showNotice(error);
      } finally {
        state.loaded = true;
        state.loading = null;
        button.classList.remove("spin");
        render();
      }
    })();
    return state.loading;
  }

  // Uma escrita por vez em cada empresa, na ordem dos toques.
  const queues = new Map();
  function enqueue(id, job) {
    const next = (queues.get(id) || Promise.resolve()).then(job, job);
    queues.set(id, next);
    return next;
  }

  /** Muda na tela na hora e salva em seguida; se falhar, avisa e recarrega. */
  function update(id, patch, { message = "", undoable = true } = {}) {
    const before = state.leads.get(id);
    if (!before) return Promise.resolve(false);
    const seq = (state.seq.get(id) || 0) + 1;
    state.seq.set(id, seq);
    state.leads.set(id, applyLocal(before, patch));
    render();
    if (message) {
      const inverse = undoable ? inversePatch(before, patch) : null;
      toast(message, inverse ? () => update(id, inverse, { message: "Desfeito.", undoable: false }) : null);
    }
    return enqueue(id, async () => {
      try {
        const data = await request(`${API}/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(patch) });
        // Só a resposta do último toque vale; as anteriores já foram superadas.
        if (data && data.lead && state.seq.get(id) === seq) state.leads.set(id, data.lead);
        setCardError(id, "");
        render();
        return true;
      } catch (error) {
        if (error.code === "session" || error.code === "auth") showNotice(error);
        setCardError(id, `Não salvou. ${explain(error)}`);
        toast(`Não salvou. ${explain(error)}`);
        load();
        return false;
      }
    });
  }

  function applyLocal(lead, patch) {
    const next = { ...lead };
    const now = new Date().toISOString();
    if ("status" in patch) {
      next.status = patch.status;
      if (patch.status === "enviado" && !next.sentAt) next.sentAt = now;
      if (patch.status === "novo") {
        next.sentAt = null;
        next.followupAt = null;
      }
    }
    if ("followup" in patch && patch.status !== "novo") next.followupAt = patch.followup ? now : null;
    for (const key of ["notes", "message", "name", "niche", "area", "finding", "phone"]) {
      if (key in patch) next[key] = patch[key];
    }
    next.updatedAt = now;
    return next;
  }

  function inversePatch(before, patch) {
    const inverse = {};
    if ("status" in patch) inverse.status = statusOf(before);
    if ("notes" in patch) inverse.notes = before.notes || "";
    if ("followup" in patch) inverse.followup = Boolean(before.followupAt);
    if ("message" in patch) inverse.message = before.message || "";
    return inverse;
  }

  /* ---------- Utilidades ---------- */

  const statusOf = (lead) => (lead && STATUS[lead.status] ? lead.status : "novo");
  const toDate = (iso) => {
    const d = new Date(iso || "");
    return Number.isNaN(d.getTime()) ? null : d;
  };
  // Dias de calendário no fuso do aparelho: mandou ontem às 19h, hoje às 8h é "ontem".
  const dayNumber = (d) => Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / DAY);
  const daysSince = (iso) => {
    const d = toDate(iso);
    return d ? dayNumber(new Date()) - dayNumber(d) : 0;
  };
  const time = (iso) => {
    const d = toDate(iso);
    return d ? d.getTime() : 0;
  };
  const fmtDay = (iso) => {
    const d = toDate(iso);
    return d ? d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) : "";
  };
  const fmtWeekday = (d) => d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" });
  const ago = (days) => (days <= 0 ? "hoje" : days === 1 ? "ontem" : `há ${days} dias`);
  const fmtRating = (r) => (typeof r === "number" ? r.toLocaleString("pt-BR", { maximumFractionDigits: 1 }) : "");
  const shortName = (lead) => {
    const name = (lead && lead.name) || "Empresa";
    return name.length > 30 ? `${name.slice(0, 28).trimEnd()}…` : name;
  };
  const waLink = (wa, text) =>
    `https://wa.me/${encodeURIComponent(wa || "")}` + (text ? `?text=${encodeURIComponent(text)}` : "");
  const fold = (value) =>
    String(value || "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase();
  const lastLine = (text) =>
    String(text || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .pop() || "";

  function dueDate(lead) {
    const sent = toDate(lead.sentAt);
    if (!sent) return null;
    const due = new Date(sent);
    due.setDate(due.getDate() + FOLLOWUP_DAYS);
    return due;
  }
  const isDue = (lead) =>
    statusOf(lead) === "enviado" && !lead.followupAt && Boolean(lead.sentAt) && daysSince(lead.sentAt) >= FOLLOWUP_DAYS;

  /** Em que aba e grupo a empresa aparece. */
  function bucket(lead) {
    const status = statusOf(lead);
    if (status === "respondeu" || status === "conversa" || status === "novo") return { tab: "agora", group: status };
    if (status === "enviado") {
      if (lead.followupAt) return { tab: "aguardando", group: "retorno-enviado" };
      if (isDue(lead)) return { tab: "agora", group: "retorno" };
      return { tab: "aguardando", group: "enviada" };
    }
    return { tab: "encerradas", group: status };
  }

  const byOrder = (a, b) => (a.priority || 9) - (b.priority || 9) || (a.order || 0) - (b.order || 0);
  const recentFirst = (a, b) => time(b.updatedAt) - time(a.updatedAt) || byOrder(a, b);
  const SORTS = {
    respondeu: recentFirst,
    conversa: recentFirst,
    retorno: (a, b) => time(a.sentAt) - time(b.sentAt) || byOrder(a, b),
    novo: byOrder,
    enviada: (a, b) => time(a.sentAt) - time(b.sentAt) || byOrder(a, b),
    "retorno-enviado": (a, b) => time(a.followupAt) - time(b.followupAt) || byOrder(a, b),
    fechado: recentFirst,
    sem_interesse: recentFirst,
  };

  function matches(lead, query) {
    const haystack = fold([lead.name, lead.niche, lead.area, lead.notes, lead.finding].join(" "));
    const terms = fold(query).split(/\s+/).filter(Boolean);
    if (terms.length && terms.every((term) => haystack.includes(term))) return true;
    const digits = query.replace(/\D/g, "");
    return digits.length >= 4 && String(lead.wa || "").includes(digits);
  }

  /** Botão principal da ficha: a próxima coisa a fazer com essa empresa. */
  function primaryAction(lead) {
    const status = statusOf(lead);
    if (status === "novo") return { label: "Enviar mensagem", href: waLink(lead.wa, lead.message), kind: "first", strong: true };
    if (isDue(lead)) return { label: "Mandar retorno", href: waLink(lead.wa, FOLLOWUP), kind: "followup", strong: true };
    if (status === "respondeu") return { label: "Responder", href: waLink(lead.wa), strong: true };
    return { label: "Abrir conversa", href: waLink(lead.wa), strong: status === "conversa" };
  }

  /** Uma linha sobre a situação: o que aconteceu e o que vem depois. */
  function situation(lead) {
    const status = statusOf(lead);
    if (status === "novo") return { text: lead.finding || "Ainda não recebeu mensagem.", tone: "" };
    if (status === "enviado") {
      if (lead.followupAt) {
        return { text: `Retorno enviado ${ago(daysSince(lead.followupAt))}. Agora é esperar.`, tone: "" };
      }
      const days = daysSince(lead.sentAt);
      if (isDue(lead)) return { text: `Mensagem enviada ${ago(days)}, sem resposta. Hora de um retorno curto.`, tone: "act" };
      const due = dueDate(lead);
      return {
        text: `Mensagem enviada ${ago(days)}.` + (due ? ` Retorno a partir de ${fmtWeekday(due)}, se não responderem.` : ""),
        tone: "",
      };
    }
    const note = lastLine(lead.notes);
    if (note) return { text: note, tone: "note" };
    const fallback = {
      respondeu: "Respondeu. Toque em Atualizar e anote o que disseram.",
      conversa: "Em negociação.",
      fechado: "Fechou!",
      sem_interesse: "Sem interesse por agora.",
    };
    return { text: fallback[status] || "", tone: "" };
  }

  function metaText(lead) {
    const bits = [lead.niche, lead.area].filter(Boolean);
    if (statusOf(lead) === "novo") {
      if (lead.priority === 1) bits.push("Prioridade 1");
      if (lead.reviews > 0) {
        const reviews = lead.reviews === 1 ? "1 avaliação" : `${lead.reviews} avaliações`;
        bits.push(reviews + (lead.rating ? ` (nota ${fmtRating(lead.rating)})` : ""));
      }
    }
    return bits.join(" · ");
  }

  async function copy(text, button) {
    try {
      await navigator.clipboard.writeText(text);
      const label = button.dataset.label || button.textContent;
      button.dataset.label = label;
      button.textContent = "Copiado";
      clearTimeout(Number(button.dataset.timer));
      button.dataset.timer = String(
        setTimeout(() => {
          button.textContent = label;
        }, 1600),
      );
    } catch {
      toast("Não deu para copiar daqui. Segure o texto e copie.");
    }
  }

  let toastTimer = 0;
  function toast(text, onUndo = null) {
    const box = $("#toast");
    $("#toast-text").textContent = text;
    const undo = $("#toast-undo");
    undo.hidden = !onUndo;
    undo.onclick = onUndo
      ? () => {
          hideToast();
          onUndo();
        }
      : null;
    clearTimeout(toastTimer);
    box.hidden = false;
    requestAnimationFrame(() => box.classList.add("show"));
    toastTimer = setTimeout(hideToast, onUndo ? 6500 : 3200);
  }
  function hideToast() {
    const box = $("#toast");
    box.classList.remove("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      box.hidden = true;
    }, 220);
  }

  function setCardError(id, text) {
    const card = state.cards.get(id);
    if (!card) return;
    const el = $(".card-err", card);
    el.textContent = text;
    el.hidden = !text;
  }

  function markPending(id, kind) {
    state.pending.set(id, { kind, at: Date.now() });
    savePending();
    render();
  }

  /* ---------- Fichas ---------- */

  function buildCard(id) {
    const card = $("#card-tpl").content.firstElementChild.cloneNode(true);
    card.dataset.id = id;
    const lead = () => state.leads.get(id);
    const details = $(".details", card);
    details.id = `detalhes-${id}`;
    $(".head", card).setAttribute("aria-controls", details.id);

    $(".head", card).addEventListener("click", () => {
      if (state.expanded.has(id)) state.expanded.delete(id);
      else state.expanded.add(id);
      if (lead()) fillCard(card, lead());
    });

    // Abrir o WhatsApp pelo botão verde deixa a pergunta "Mandou?" na ficha.
    $(".main-act", card).addEventListener("click", () => {
      const kind = lead() && primaryAction(lead()).kind;
      if (kind) markPending(id, kind);
    });
    $(".wa-msg", card).addEventListener("click", () => {
      if (statusOf(lead()) === "novo") markPending(id, "first");
    });
    $(".wa-followup", card).addEventListener("click", () => {
      if (lead() && statusOf(lead()) === "enviado" && !lead().followupAt) markPending(id, "followup");
    });
    $(".confirm-yes", card).addEventListener("click", () => {
      const current = lead();
      const item = state.pending.get(id);
      state.pending.delete(id);
      savePending();
      if (!current || !item) return render();
      if (item.kind === "first") update(id, { status: "enviado" }, { message: `${shortName(current)}: mensagem enviada.` });
      else update(id, { followup: true }, { message: `${shortName(current)}: retorno enviado.` });
    });
    $(".confirm-no", card).addEventListener("click", () => {
      state.pending.delete(id);
      savePending();
      render();
    });

    $(".update", card).addEventListener("click", () => openStatus(id));
    $(".edit-notes", card).addEventListener("click", () => openStatus(id, { notes: true }));
    $(".edit-lead", card).addEventListener("click", () => openLead(id));
    $(".toggle-followup", card).addEventListener("click", () => {
      const current = lead();
      if (!current) return;
      const sent = !current.followupAt;
      update(id, { followup: sent }, { message: sent ? "Retorno marcado como enviado." : "Retorno desmarcado." });
    });

    $(".copy-msg", card).addEventListener("click", (event) => copy((lead() || {}).message || "", event.currentTarget));
    $(".copy-followup", card).addEventListener("click", (event) => copy(FOLLOWUP, event.currentTarget));
    $(".copy-phone", card).addEventListener("click", (event) => copy((lead() || {}).phone || "", event.currentTarget));

    const editor = $(".msg-editor", card);
    const area = $(".msg-edit", card);
    const toggleEditor = (open) => {
      editor.hidden = !open;
      $(".msg-text", card).hidden = open;
      $(".msg-actions", card).hidden = open;
      $(".edit-msg", card).hidden = open;
    };
    $(".edit-msg", card).addEventListener("click", () => {
      area.value = (lead() || {}).message || "";
      toggleEditor(true);
      area.focus();
    });
    $(".cancel-msg", card).addEventListener("click", () => toggleEditor(false));
    $(".save-msg", card).addEventListener("click", () => {
      const current = lead();
      const text = area.value.trim();
      toggleEditor(false);
      if (!current || !text || text === current.message) return;
      update(id, { message: text }, { message: "Mensagem salva." });
    });
    return card;
  }

  function fillCard(card, lead) {
    const id = lead.id;
    const status = statusOf(lead);
    card.dataset.status = status;
    $(".name", card).textContent = lead.name || "Empresa sem nome";
    $(".state-text", card).textContent = STATUS[status].short;
    const meta = metaText(lead);
    $(".meta-text", card).textContent = meta;
    $(".meta-text", card).hidden = !meta;

    const info = situation(lead);
    const context = $(".context", card);
    context.textContent = info.text;
    context.dataset.tone = info.tone;
    context.hidden = !info.text;

    const item = state.pending.get(id);
    const waiting =
      item &&
      ((item.kind === "first" && status === "novo") ||
        (item.kind === "followup" && status === "enviado" && !lead.followupAt));
    if (item && !waiting) {
      state.pending.delete(id);
      savePending();
    }
    $(".confirm", card).hidden = !waiting;
    if (waiting) {
      $(".confirm-q", card).textContent =
        item.kind === "first" ? "Mandou a mensagem no WhatsApp?" : "Mandou o retorno no WhatsApp?";
    }

    const action = primaryAction(lead);
    const act = $(".main-act", card);
    act.href = action.href;
    act.classList.toggle("wa", action.strong);
    $(".act-label", card).textContent = action.label;

    const open = state.expanded.has(id);
    $(".head", card).setAttribute("aria-expanded", String(open));
    $(".details", card).hidden = !open;
    if (open) fillDetails(card, lead, status);
  }

  function fillDetails(card, lead, status) {
    $(".f-finding dd", card).textContent = lead.finding || "—";
    $(".f-offer", card).hidden = !lead.offer;
    $(".f-offer dd", card).textContent = lead.offer || "";
    $(".check", card).hidden = !(lead.check && status === "novo");
    $(".check-text", card).textContent = lead.check || "";

    const notes = $(".notes-text", card);
    notes.textContent = lead.notes || "Nada anotado ainda.";
    notes.classList.toggle("muted", !lead.notes);
    $(".edit-notes", card).textContent = lead.notes ? "Editar" : "Anotar";

    const followup = $(".b-followup", card);
    followup.hidden = status !== "enviado";
    if (status === "enviado") {
      const due = dueDate(lead);
      $(".followup-state", card).textContent = lead.followupAt
        ? `Enviado em ${fmtDay(lead.followupAt)} (${ago(daysSince(lead.followupAt))}).`
        : isDue(lead)
          ? "Pronto para mandar: já passaram 3 dias sem resposta."
          : due
            ? `Fica pronto em ${fmtWeekday(due)}, se não responderem antes.`
            : "";
      $(".followup-text", card).textContent = FOLLOWUP;
      $(".wa-followup", card).href = waLink(lead.wa, FOLLOWUP);
      $(".toggle-followup", card).textContent = lead.followupAt ? "Desmarcar" : "Marcar como enviado";
    }

    if ($(".msg-editor", card).hidden) $(".msg-text", card).textContent = lead.message || "";
    $(".wa-msg", card).href = waLink(lead.wa, lead.message);
    $(".phone", card).textContent = lead.phone || "";
    $(".call", card).href = `tel:+${lead.wa || ""}`;

    const links = $(".links", card);
    links.replaceChildren();
    const all = [];
    if (lead.adUrl) all.push({ label: "Anúncio", url: lead.adUrl });
    for (const link of Array.isArray(lead.links) ? lead.links : []) if (link && link.url) all.push(link);
    for (const link of all) {
      const a = document.createElement("a");
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = link.label || "Link";
      links.append(a);
    }

    const dates = [];
    if (lead.createdAt) dates.push(`Na lista desde ${fmtDay(lead.createdAt)}`);
    if (lead.sentAt) dates.push(`1ª mensagem em ${fmtDay(lead.sentAt)}`);
    $(".dates", card).textContent = dates.join(" · ");
  }

  function groupHeader(key, label, count) {
    let header = state.groups.get(key);
    if (!header) {
      header = document.createElement("h2");
      header.className = "group";
      const n = document.createElement("span");
      n.className = "n";
      header.append(document.createElement("span"), n);
      state.groups.set(key, header);
    }
    header.firstChild.textContent = label;
    header.lastChild.textContent = count == null ? "" : String(count);
    return header;
  }

  /** Põe os nós na ordem pedida mexendo só no que mudou (não perde o foco). */
  function syncChildren(parent, nodes) {
    let ref = parent.firstChild;
    for (const node of nodes) {
      if (node === ref) {
        ref = ref.nextSibling;
        continue;
      }
      parent.insertBefore(node, ref);
    }
    while (ref) {
      const next = ref.nextSibling;
      parent.removeChild(ref);
      ref = next;
    }
  }

  function render() {
    const leads = [...state.leads.values()];
    const where = new Map(leads.map((lead) => [lead.id, bucket(lead)]));
    const counts = { agora: 0, aguardando: 0, encerradas: 0, todas: leads.length };
    for (const place of where.values()) counts[place.tab]++;

    for (const tab of $$("#tabs .tab")) {
      const id = tab.dataset.tab;
      tab.setAttribute("aria-pressed", String(!state.query && state.tab === id));
      const n = $(".n", tab);
      n.textContent = String(counts[id] || 0);
      n.classList.toggle("hot", id === "agora" && counts.agora > 0);
    }
    $(".bar").classList.toggle("searching", Boolean(state.query));
    renderSummary(leads);

    for (const [id, card] of state.cards) {
      if (!state.leads.has(id)) {
        card.remove();
        state.cards.delete(id);
        state.expanded.delete(id);
      }
    }
    const cardFor = (lead) => {
      let card = state.cards.get(lead.id);
      if (!card) {
        card = buildCard(lead.id);
        state.cards.set(lead.id, card);
      }
      fillCard(card, lead);
      return card;
    };

    const nodes = [];
    let shown = 0;
    if (state.query) {
      const found = leads.filter((lead) => matches(lead, state.query)).sort(byOrder);
      if (found.length) nodes.push(groupHeader("busca", found.length === 1 ? "1 resultado" : `${found.length} resultados`));
      for (const lead of found) nodes.push(cardFor(lead));
      shown = found.length;
    } else if (state.tab === "todas") {
      for (const lead of leads.sort(byOrder)) nodes.push(cardFor(lead));
      shown = leads.length;
    } else {
      for (const [key, label] of GROUPS[state.tab]) {
        const items = leads
          .filter((lead) => where.get(lead.id).tab === state.tab && where.get(lead.id).group === key)
          .sort(SORTS[key]);
        if (!items.length) continue;
        nodes.push(groupHeader(key, label, items.length));
        for (const lead of items) nodes.push(cardFor(lead));
        shown += items.length;
      }
    }
    syncChildren($("#list"), nodes);

    const empty = $("#empty");
    if (!state.loaded) {
      empty.hidden = false;
      $("#empty-title").textContent = "Carregando a lista…";
      $("#empty-text").textContent = "";
    } else if (shown) {
      empty.hidden = true;
    } else {
      empty.hidden = false;
      const [title, text] =
        state.failed && !leads.length
          ? ["A lista não carregou.", "Veja o aviso acima."]
          : state.query
            ? [`Nada encontrado para “${state.query}”.`, "Tente outro pedaço do nome, o ramo ou o bairro."]
            : EMPTY[state.tab];
      $("#empty-title").textContent = title;
      $("#empty-text").textContent = text;
    }
  }

  function renderSummary(leads) {
    const summary = $("#summary");
    if (!state.loaded) return;
    if (!leads.length) {
      summary.textContent = state.failed ? "A lista não carregou." : "Nenhuma empresa ainda.";
      return;
    }
    const count = (status) => leads.filter((lead) => statusOf(lead) === status).length;
    const talking = count("respondeu") + count("conversa");
    const closed = count("fechado");
    const parts = [`${leads.length - count("novo")} de ${leads.length} contatadas`];
    if (talking) parts.push(`${talking} em conversa`);
    parts.push(`${closed} ${closed === 1 ? "fechada" : "fechadas"}`);
    summary.textContent = parts.join(" · ");
  }

  /* ---------- Painel: status e anotações ---------- */

  const statusSheet = $("#status-sheet");
  let statusFor = null;
  for (const [id, info] of Object.entries(STATUS)) {
    const option = document.createElement("label");
    option.className = "opt";
    option.dataset.status = id;
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "status";
    input.value = id;
    const text = document.createElement("span");
    text.textContent = info.short;
    option.append(input, text);
    $("#status-opts").append(option);
  }

  function openStatus(id, { notes = false } = {}) {
    const lead = state.leads.get(id);
    if (!lead) return;
    statusFor = id;
    $("#status-name").textContent = lead.name || "";
    for (const input of $$("#status-opts input")) input.checked = input.value === statusOf(lead);
    const area = $("#status-notes");
    area.value = lead.notes || "";
    statusSheet.showModal();
    if (notes) {
      area.focus();
      area.setSelectionRange(area.value.length, area.value.length);
    } else {
      const checked = $("#status-opts input:checked");
      if (checked) checked.focus({ preventScroll: true });
    }
  }

  $("#status-save").addEventListener("click", () => {
    const id = statusFor;
    const lead = id && state.leads.get(id);
    statusSheet.close();
    if (!lead) return;
    const checked = $("#status-opts input:checked");
    const status = checked ? checked.value : statusOf(lead);
    const notes = $("#status-notes").value;
    const patch = {};
    if (status !== statusOf(lead)) patch.status = status;
    if (notes !== (lead.notes || "")) patch.notes = notes;
    if (!Object.keys(patch).length) return;
    update(id, patch, {
      message: patch.status ? `${shortName(lead)}: ${STATUS[status].label.toLowerCase()}.` : "Anotação salva.",
    });
  });

  $("#status-date").addEventListener("click", () => {
    const area = $("#status-notes");
    const stamp = `${new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}: `;
    const current = area.value.replace(/\s+$/, "");
    area.value = current ? `${current}\n${stamp}` : stamp;
    area.focus();
    area.setSelectionRange(area.value.length, area.value.length);
    area.scrollTop = area.scrollHeight;
  });

  /* ---------- Painel: adicionar ou corrigir empresa ---------- */

  const leadSheet = $("#lead-sheet");
  const leadForm = $("#lead-form");
  const FIELDS = ["name", "phone", "niche", "area", "finding"];
  let leadFor = null;

  function openLead(id = null) {
    leadForm.reset();
    leadFor = id;
    const lead = id ? state.leads.get(id) : null;
    $("#lead-title").textContent = lead ? "Corrigir dados" : "Adicionar empresa";
    $("#lead-submit").textContent = lead ? "Salvar" : "Adicionar";
    $("#f-message-field").hidden = Boolean(lead);
    $("#lead-delete").hidden = !lead;
    $("#lead-err").hidden = true;
    if (lead) for (const field of FIELDS) leadForm.elements[field].value = lead[field] || "";
    leadSheet.showModal();
    if (!lead) leadForm.elements.name.focus();
  }

  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const err = $("#lead-err");
    const values = {};
    for (const field of [...FIELDS, "message"]) values[field] = leadForm.elements[field].value.trim();
    if (!values.name || values.phone.replace(/\D/g, "").length < 10) {
      err.textContent = !values.name ? "Informe o nome da empresa." : "Informe o WhatsApp com DDD, por exemplo (47) 99999-9999.";
      err.hidden = false;
      (values.name ? leadForm.elements.phone : leadForm.elements.name).focus();
      return;
    }
    err.hidden = true;
    const button = $("#lead-submit");
    button.disabled = true;
    try {
      if (leadFor) {
        const lead = state.leads.get(leadFor) || {};
        const patch = {};
        for (const field of FIELDS) if (values[field] !== (lead[field] || "")) patch[field] = values[field];
        if (Object.keys(patch).length) {
          const data = await request(`${API}/${encodeURIComponent(leadFor)}`, { method: "PATCH", body: JSON.stringify(patch) });
          state.leads.set(leadFor, data.lead);
        }
        leadSheet.close();
        render();
        toast("Dados salvos.");
      } else {
        const data = await request(API, { method: "POST", body: JSON.stringify(values) });
        state.leads.set(data.lead.id, data.lead);
        leadSheet.close();
        state.query = "";
        $("#q").value = "";
        state.tab = "agora";
        store.set(KEY_TAB, state.tab);
        render();
        const card = state.cards.get(data.lead.id);
        if (card) {
          card.scrollIntoView({ block: "center" });
          card.classList.add("flash");
          setTimeout(() => card.classList.remove("flash"), 1800);
        }
        toast("Empresa adicionada.");
      }
    } catch (error) {
      err.textContent = explain(error);
      err.hidden = false;
    } finally {
      button.disabled = false;
    }
  });

  $("#lead-delete").addEventListener("click", async () => {
    const id = leadFor;
    const lead = id && state.leads.get(id);
    if (!lead) return;
    if (!window.confirm(`Excluir “${lead.name}” da lista? Não dá para desfazer.`)) return;
    const button = $("#lead-delete");
    button.disabled = true;
    try {
      await request(`${API}/${encodeURIComponent(id)}`, { method: "DELETE" });
      state.leads.delete(id);
      state.pending.delete(id);
      savePending();
      leadSheet.close();
      render();
      toast("Empresa excluída.");
    } catch (error) {
      $("#lead-err").textContent = explain(error);
      $("#lead-err").hidden = false;
    } finally {
      button.disabled = false;
    }
  });

  /* ---------- Painéis, abas, busca ---------- */

  for (const dialog of $$("dialog.sheet")) {
    // Toque fora do painel fecha, como no app.
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    for (const button of $$("[data-close]", dialog)) button.addEventListener("click", () => dialog.close());
  }

  for (const button of $$("#tabs .tab")) {
    button.addEventListener("click", () => {
      state.query = "";
      $("#q").value = "";
      state.tab = button.dataset.tab;
      store.set(KEY_TAB, state.tab);
      render();
      const top = $(".bar").offsetTop;
      if (window.scrollY > top) window.scrollTo({ top });
    });
  }

  const search = $("#q");
  search.addEventListener("input", () => {
    state.query = search.value.trim();
    render();
  });
  search.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      search.value = "";
      state.query = "";
      render();
    }
    // "Buscar" no teclado do celular só fecha o teclado.
    if (event.key === "Enter") search.blur();
  });

  $("#reload").addEventListener("click", () => load({ manual: true }));
  $("#add-open").addEventListener("click", () => openLead());

  // O botão + some ao rolar para baixo e volta ao rolar para cima ou no fim da lista.
  let lastY = window.scrollY;
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const y = window.scrollY;
        if (Math.abs(y - lastY) < 12) return;
        const atEnd = window.innerHeight + y >= document.documentElement.scrollHeight - 40;
        $("#add-open").classList.toggle("tuck", y > lastY && y > 160 && !atEnd);
        lastY = y;
      });
    },
    { passive: true },
  );

  // Ao voltar para a aba (do WhatsApp, por exemplo), busca de novo: a lista
  // pode ter mudado em outro aparelho, e os dias passam.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;
    if (Date.now() - state.lastLoad > 30000) load();
    else render();
  });

  render();
  load();
})();
