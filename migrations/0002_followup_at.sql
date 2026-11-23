-- Retorno (follow-up): quando a segunda mensagem foi enviada. Fica vazio
-- enquanto o retorno não foi mandado; a página usa isso para tirar a empresa
-- da fila de "Fazer agora".
ALTER TABLE leads ADD COLUMN followup_at TEXT;
