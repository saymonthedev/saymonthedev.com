/**
 * Worker do saymonthedev.com.
 *
 * O site continua 100% estático: a Cloudflare serve os arquivos de out/ sem
 * passar por aqui. Este código só roda em /admin (ver run_worker_first em
 * wrangler.jsonc), a área privada com a lista de prospecção:
 *
 * - quem entra passa pelo login do Cloudflare Access, e o Worker confere o
 *   token assinado que o Access envia em cada requisição;
 * - os dados ficam no banco D1 (binding DB), nunca no repositório, que é
 *   público.
 */

const STATUSES = new Set(["novo", "enviado", "respondeu", "conversa", "fechado", "sem_interesse"]);
const MAX_BODY = 20_000;
const NOINDEX = "noindex, nofollow";

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isAdmin = url.pathname === "/admin" || url.pathname.startsWith("/admin/");
    // Qualquer outra rota segue para os arquivos estáticos, como antes.
    if (!isAdmin) return env.ASSETS.fetch(request);

    // Uma origem só para a área privada: o login do Access vale por domínio.
    if (url.hostname.startsWith("www.")) {
      url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }

    const isApi = url.pathname.startsWith("/admin/api/");
    const auth = await authorize(request, env);
    if (!auth.ok) return isApi ? json({ error: auth.error }, auth.status) : lockedPage(auth.status);

    if (isApi) {
      try {
        return await api(request, env, url);
      } catch (error) {
        if (error instanceof HttpError) return json({ error: error.message }, error.status);
        console.error("admin api", error);
        return json({ error: "Erro interno. Tente de novo." }, 500);
      }
    }
    return privateAsset(await env.ASSETS.fetch(request));
  },
};

export default worker;

/* ---------- Login: token do Cloudflare Access ---------- */

let jwks = { team: "", fetchedAt: 0, keys: new Map() };

async function authorize(request, env) {
  const team = String(env.ACCESS_TEAM_DOMAIN || "").trim().replace(/\/+$/, "");
  const aud = String(env.ACCESS_AUD || "").trim();
  // Sem configuração, a área fica fechada para todo mundo.
  if (!team || !aud) return { ok: false, status: 503, error: "O login desta área ainda não foi configurado." };

  const token = request.headers.get("cf-access-jwt-assertion");
  if (!token) return { ok: false, status: 401, error: "Faça login para continuar." };
  try {
    const claims = await verifyAccessToken(token, team, aud);
    return { ok: true, email: typeof claims.email === "string" ? claims.email : "" };
  } catch {
    return { ok: false, status: 403, error: "Acesso negado." };
  }
}

async function verifyAccessToken(token, team, aud) {
  const [h, p, s, extra] = token.split(".");
  if (!h || !p || !s || extra !== undefined) throw new Error("token malformado");
  const header = JSON.parse(decodeText(h));
  if (header.alg !== "RS256" || typeof header.kid !== "string") throw new Error("algoritmo");

  const key = await signingKey(team, header.kid);
  const signed = new TextEncoder().encode(`${h}.${p}`);
  const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, base64urlBytes(s), signed);
  if (!valid) throw new Error("assinatura");

  const claims = JSON.parse(decodeText(p));
  const now = Math.floor(Date.now() / 1000);
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (claims.iss !== team) throw new Error("emissor");
  if (!audiences.includes(aud)) throw new Error("audiência");
  if (typeof claims.exp !== "number" || claims.exp < now - 30) throw new Error("expirado");
  if (typeof claims.nbf === "number" && claims.nbf > now + 30) throw new Error("ainda não vale");
  return claims;
}

/** Chaves públicas do Access, guardadas por até 1 hora. */
async function signingKey(team, kid) {
  const age = Date.now() - jwks.fetchedAt;
  const wrongTeam = jwks.team !== team;
  const unknownKid = !jwks.keys.has(kid);
  // Um kid desconhecido busca as chaves de novo, no máximo uma vez por minuto.
  if (wrongTeam || age > 3_600_000 || (unknownKid && age > 60_000)) {
    const res = await fetch(`${team}/cdn-cgi/access/certs`);
    if (!res.ok) throw new Error("chaves indisponíveis");
    const { keys = [] } = await res.json();
    const map = new Map();
    for (const jwk of keys) {
      if (jwk.kty !== "RSA" || typeof jwk.kid !== "string") continue;
      const key = await crypto.subtle.importKey(
        "jwk",
        { kty: "RSA", n: jwk.n, e: jwk.e, alg: "RS256", ext: true },
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["verify"],
      );
      map.set(jwk.kid, key);
    }
    jwks = { team, fetchedAt: Date.now(), keys: map };
  }
  const key = jwks.keys.get(kid);
  if (!key) throw new Error("chave desconhecida");
  return key;
}

function base64urlBytes(value) {
  const b64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

const decodeText = (value) => new TextDecoder().decode(base64urlBytes(value));

/* ---------- API da lista ---------- */

async function api(request, env, url) {
  const path = url.pathname.replace(/\/+$/, "");
  const writing = request.method !== "GET" && request.method !== "HEAD";
  // Escritas só a partir da própria página (bloqueia formulários de outros sites).
  if (writing) {
    const origin = request.headers.get("origin");
    if (origin && origin !== url.origin) throw new HttpError(403, "Origem não permitida.");
  }

  if (path === "/admin/api/leads") {
    if (request.method === "GET") return json({ leads: await listLeads(env) });
    if (request.method === "POST") return createLead(request, env);
    return json({ error: "Método não permitido." }, 405, { allow: "GET, POST" });
  }
  const match = path.match(/^\/admin\/api\/leads\/([a-z0-9-]{1,80})$/);
  if (match) {
    if (request.method === "PATCH") return updateLead(request, env, match[1]);
    if (request.method === "DELETE") return deleteLead(env, match[1]);
    return json({ error: "Método não permitido." }, 405, { allow: "PATCH, DELETE" });
  }
  throw new HttpError(404, "Não encontrado.");
}

async function listLeads(env) {
  const { results } = await env.DB.prepare("SELECT * FROM leads ORDER BY priority, sort_order, created_at").all();
  return results.map(toLead);
}

async function updateLead(request, env, id) {
  const body = await readJson(request);
  const current = await env.DB.prepare("SELECT * FROM leads WHERE id = ?").bind(id).first();
  if (!current) throw new HttpError(404, "Empresa não encontrada.");

  const now = new Date().toISOString();
  const sets = [];
  const values = [];
  const reset = body.status === "novo";
  if ("status" in body) {
    if (!STATUSES.has(body.status)) throw new HttpError(400, "Status inválido.");
    sets.push("status = ?");
    values.push(body.status);
    if (body.status === "enviado" && !current.sent_at) {
      sets.push("sent_at = ?");
      values.push(now);
    }
    // Voltar para "A contatar" zera o histórico de envio.
    if (reset) sets.push("sent_at = NULL", "followup_at = NULL");
  }
  // Retorno (follow-up): true marca como enviado agora, false desmarca.
  if ("followup" in body && !reset) {
    if (typeof body.followup !== "boolean") throw new HttpError(400, "Retorno inválido.");
    sets.push("followup_at = ?");
    values.push(body.followup ? now : null);
  }
  // Dados da empresa, para corrigir o que foi digitado errado.
  for (const [field, max] of [["name", 120], ["niche", 80], ["area", 80], ["finding", 500]]) {
    if (!(field in body)) continue;
    const value = text(body[field], max).trim();
    if (field === "name" && !value) throw new HttpError(400, "Informe o nome da empresa.");
    sets.push(`${field} = ?`);
    values.push(value);
  }
  if ("phone" in body) {
    const { phone, wa } = parsePhone(body.phone);
    sets.push("phone = ?", "wa = ?");
    values.push(phone, wa);
  }
  if ("notes" in body) {
    sets.push("notes = ?");
    values.push(text(body.notes, 5000));
  }
  if ("message" in body) {
    const message = text(body.message, 2000).trim();
    if (!message) throw new HttpError(400, "A mensagem não pode ficar vazia.");
    sets.push("message = ?");
    values.push(message);
  }
  if (!sets.length) throw new HttpError(400, "Nada para atualizar.");
  sets.push("updated_at = ?");
  values.push(now);

  await env.DB.prepare(`UPDATE leads SET ${sets.join(", ")} WHERE id = ?`).bind(...values, id).run();
  const row = await env.DB.prepare("SELECT * FROM leads WHERE id = ?").bind(id).first();
  return json({ lead: toLead(row) });
}

async function deleteLead(env, id) {
  const { meta } = await env.DB.prepare("DELETE FROM leads WHERE id = ?").bind(id).run();
  if (!meta.changes) throw new HttpError(404, "Empresa não encontrada.");
  return json({ ok: true });
}

/** Telefone como foi digitado + só os dígitos com o 55, para o link do WhatsApp. */
function parsePhone(value) {
  const phone = text(value ?? "", 40).trim();
  const digits = phone.replace(/\D/g, "");
  const wa = digits.startsWith("55") && digits.length >= 12 ? digits : `55${digits}`;
  if (wa.length < 12 || wa.length > 13) throw new HttpError(400, "Informe o WhatsApp com DDD, por exemplo (47) 99999-9999.");
  return { phone, wa };
}

async function createLead(request, env) {
  const body = await readJson(request);
  const name = text(body.name ?? "", 120).trim();
  if (!name) throw new HttpError(400, "Informe o nome da empresa.");
  const { phone, wa } = parsePhone(body.phone);

  const niche = text(body.niche ?? "", 80).trim();
  const area = text(body.area ?? "", 80).trim();
  const finding = text(body.finding ?? "", 500).trim();
  const message =
    text(body.message ?? "", 2000).trim() ||
    `Oi, tudo bem? Sou o Saymon, desenvolvedor aqui de Jaraguá. Vi a ${name} e queria te mostrar uma ideia de site para vocês. Fiz o site e a agenda online da ORTS Climatização (ortsclimatizacao.com.br). Quer que eu te mostre como poderia ficar o de vocês? Sem compromisso.`;

  const slug = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "empresa";
  const id = `${slug}-${crypto.randomUUID().slice(0, 6)}`;
  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO leads (id, name, niche, area, phone, wa, priority, sort_order, finding, message, source, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 2, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM leads), ?, ?, 'Adicionada à mão', ?)`,
  )
    .bind(id, name, niche, area, phone, wa, finding, message, now)
    .run();
  const row = await env.DB.prepare("SELECT * FROM leads WHERE id = ?").bind(id).first();
  return json({ lead: toLead(row) }, 201);
}

function toLead(row) {
  const https = (value) => (typeof value === "string" && value.startsWith("https://") ? value : "");
  let links = [];
  try {
    const parsed = JSON.parse(row.links || "[]");
    if (Array.isArray(parsed)) {
      links = parsed
        .filter((link) => link && https(link.url))
        .map((link) => ({ label: String(link.label || "Link"), url: link.url }));
    }
  } catch {
    links = [];
  }
  return {
    id: row.id,
    name: row.name,
    niche: row.niche,
    area: row.area,
    reviews: row.reviews,
    rating: row.rating,
    phone: row.phone,
    wa: row.wa,
    priority: row.priority,
    order: row.sort_order,
    finding: row.finding,
    offer: row.offer,
    check: row.check_note,
    message: row.message,
    adUrl: https(row.ad_url),
    links,
    source: row.source,
    status: row.status,
    notes: row.notes,
    sentAt: row.sent_at,
    followupAt: row.followup_at ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function readJson(request) {
  if (!(request.headers.get("content-type") || "").includes("application/json")) {
    throw new HttpError(415, "Envie os dados em JSON.");
  }
  const raw = await request.text();
  if (raw.length > MAX_BODY) throw new HttpError(413, "Conteúdo grande demais.");
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    throw new HttpError(400, "JSON inválido.");
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new HttpError(400, "JSON inválido.");
  return body;
}

function text(value, max) {
  if (typeof value !== "string") throw new HttpError(400, "Texto inválido.");
  if (value.length > max) throw new HttpError(400, `Texto longo demais (máximo de ${max} caracteres).`);
  return value;
}

/* ---------- Respostas ---------- */

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": NOINDEX,
      "x-content-type-options": "nosniff",
      ...extra,
    },
  });
}

function privateAsset(response) {
  const headers = new Headers(response.headers);
  headers.set("cache-control", "no-store");
  headers.set("x-robots-tag", NOINDEX);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function lockedPage(status) {
  const copy = {
    503: ["Área em configuração", "O login desta área ainda não foi ativado."],
    401: ["Área restrita", "Entre pelo login da Cloudflare para continuar."],
    403: ["Área restrita", "Você não tem acesso a esta página."],
  };
  const [title, message] = copy[status] || copy[403];
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${title}</title>
<style>
  :root { color-scheme: light dark; --bg: #f2f5fa; --fg: #0b1220; --muted: #556075; --accent: #1d4ed8; }
  @media (prefers-color-scheme: dark) { :root { --bg: #090e18; --fg: #e8edf6; --muted: #9aa6bb; --accent: #8db2ff; } }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: var(--bg); color: var(--fg);
    font: 16px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; padding: 24px; box-sizing: border-box; }
  main { max-width: 28rem; }
  h1 { font-size: 1.5rem; margin: 0 0 8px; letter-spacing: -0.02em; }
  p { margin: 0 0 16px; color: var(--muted); }
  a { color: var(--accent); }
</style>
</head>
<body>
<main>
  <h1>${title}</h1>
  <p>${message}</p>
  <p><a href="/">Voltar para o site</a></p>
</main>
</body>
</html>`;
  return new Response(html, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": NOINDEX,
      "x-content-type-options": "nosniff",
      "x-frame-options": "DENY",
      "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    },
  });
}
