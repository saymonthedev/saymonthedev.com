-- Lista de prospecção da área /admin (banco D1 "saymon-admin").
-- Só a estrutura fica no repositório: as empresas e as anotações vivem no
-- banco, nunca no código, porque este repositório é público.
CREATE TABLE IF NOT EXISTS leads (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  niche       TEXT NOT NULL DEFAULT '',
  area        TEXT NOT NULL DEFAULT '',
  reviews     INTEGER NOT NULL DEFAULT 0,
  rating      REAL,
  phone       TEXT NOT NULL DEFAULT '',
  wa          TEXT NOT NULL DEFAULT '',
  priority    INTEGER NOT NULL DEFAULT 2,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  finding     TEXT NOT NULL DEFAULT '',
  offer       TEXT NOT NULL DEFAULT '',
  check_note  TEXT NOT NULL DEFAULT '',
  message     TEXT NOT NULL DEFAULT '',
  ad_url      TEXT NOT NULL DEFAULT '',
  links       TEXT NOT NULL DEFAULT '[]',
  source      TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'novo'
              CHECK (status IN ('novo', 'enviado', 'respondeu', 'conversa', 'fechado', 'sem_interesse')),
  notes       TEXT NOT NULL DEFAULT '',
  sent_at     TEXT,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at  TEXT
);

CREATE INDEX IF NOT EXISTS leads_order ON leads (priority, sort_order);
