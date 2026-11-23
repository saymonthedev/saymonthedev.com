# saymonthedev.com

Site pessoal de **Saymon Oliveira de Castro**, desenvolvedor Full Stack — portfólio e canal de contato para projetos freelance.

Bilíngue (português em `/`, inglês em `/en`), estático e publicado na Cloudflare. A única parte com servidor é a área privada `/admin`, com a lista de prospecção.

## Tecnologias

| Ferramenta | Uso |
| --- | --- |
| [Next.js 16](https://nextjs.org) (App Router, export estático) | Estrutura, SEO e geração dos arquivos |
| React 19 + TypeScript | Componentes e tipagem |
| [Tailwind CSS 4](https://tailwindcss.com) | Estilos e tema |
| [Motion](https://motion.dev) | Inclinação do cartão, menu mobile, indicador da navegação, parallax |
| [Lenis](https://lenis.darkroom.engineering) | Inércia da rolagem (mantém a rolagem nativa) |
| [Lucide](https://lucide.dev) | Ícones de interface |
| [Simple Icons](https://simpleicons.org) / [Devicon](https://devicon.dev) | Logotipos oficiais das tecnologias e redes |
| `next/font` | Geist, Geist Mono e Instrument Serif, hospedadas junto com o site |

Requisito: **Node.js 22.6 ou superior** (`node -v`).

## Comandos

```bash
npm install        # instala as dependências (uma vez)
npm run dev        # desenvolvimento em http://localhost:3000
npm run build      # gera o site em out/ (e as versões otimizadas das imagens)
npm run preview    # build + servidor local idêntico ao da Cloudflare (wrangler dev)
npm run deploy     # build + publicação na Cloudflare
npm run lint       # ESLint
npm run typecheck  # checagem de tipos
npm run icons      # regera favicon e ícones a partir do monograma
```

## Publicação na Cloudflare (domínio saymonthedev.com)

O domínio fica registrado na Hostinger, mas quem responde por ele (DNS) e hospeda o site é a Cloudflare — o mesmo arranjo do site da Litoral Bordados.

### 1. Passar o DNS do domínio para a Cloudflare (uma vez)

1. No painel da Cloudflare: **Add a domain** → `saymonthedev.com` → plano **Free**.
2. A Cloudflare importa os registros DNS atuais e mostra **dois nameservers**.
3. Na **Hostinger**: Domínios → `saymonthedev.com` → **DNS / Nameservers** → **Alterar nameservers** → cole os dois da Cloudflare e salve.
4. Aguarde a Cloudflare marcar o domínio como **Active** (minutos, às vezes até 24h).
5. Em **DNS → Records**, apague os registros `A`/`CNAME` de `saymonthedev.com` e `www` que vieram da Hostinger (páginas de estacionamento). Sem isso, o passo 2 não consegue criar o domínio próprio.

### 2. Publicar

Opção A — direto do computador:

```bash
npx wrangler login   # só na primeira vez
npm run deploy
```

Opção B — publicação automática a cada `git push` (recomendado):
**Workers & Pages → Create → Import a repository** → escolha `saymonthedev/saymonthedev.com` e use:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

As rotas de [`wrangler.jsonc`](wrangler.jsonc) ligam `saymonthedev.com` e `www.saymonthedev.com` ao site; a Cloudflare cria os registros de DNS e o certificado HTTPS sozinha. O endereço canônico usado no SEO é `https://saymonthedev.com` (para outro domínio, defina `NEXT_PUBLIC_SITE_URL` no build).

> Opcional: para que `www` redirecione para o domínio sem `www`, crie em **Rules → Redirect Rules** a regra “Redirect from WWW to root”.

## Como editar o conteúdo

| O quê | Onde |
| --- | --- |
| Contatos (WhatsApp, e-mail, GitHub, LinkedIn) | `src/config/site.ts` |
| Todos os textos, nos dois idiomas | `src/i18n/dictionaries/pt-BR.ts` e `en.ts` |
| Serviços e preços | `services.items` nos dois dicionários (ícones em `src/data/services.ts`) |
| Projetos | `src/data/projects.ts` (+ capturas em `src/assets/projects/`) |
| Ordem das seções | `src/components/HomePage.tsx` e `src/components/layout/nav.ts` |
| Tecnologias | `src/data/technologies.ts` (logos em `src/data/brand-icons.ts`) |
| Foto | `src/assets/images/saymon.jpg` |
| Cores, fontes e animações | `src/app/globals.css` e `src/config/fonts.ts` |

O dicionário em inglês tem o mesmo tipo do português: se um texto faltar em um dos idiomas, o TypeScript acusa no build.

### Adicionar um projeto

1. Salve as capturas reais em `src/assets/projects/` — a de computador deve ser a **página inteira** (a prévia percorre a imagem no hover); a de celular é opcional.
2. Em `src/data/projects.ts`, importe as imagens e copie o item existente.
3. `published: false` mantém o projeto fora do site até ser aprovado; `liveUrl` só deve ser preenchido com um endereço confirmado no ar.
4. Para destacar um projeto, preencha `badge` (o selo, nos dois idiomas) e deixe-o em primeiro na lista: ele ocupa a linha inteira e os demais formam pares. Hoje o destaque é a ORTS Climatização.
5. Escreva os destaques pensando em quem contrata (o que o cliente ganha), não em quem programa: as tecnologias já aparecem nos selos do cartão.

O layout se adapta à quantidade de projetos: o cartão “O próximo pode ser o seu”, com botão para o WhatsApp, sempre fecha a grade, no espaço que sobra do último par ou numa linha própria.

Ordem atual: clientes (ORTS, Stainhaus), projetos conceituais (Barbearia Cobre, Litoral Bordados, Crosta) e o projeto pessoal (Domínio Político).

### Página pensada para quem contrata

A ordem das seções é: início, trabalhos, serviços e preços, como funciona, sobre e contato. Quem chega pelo link no WhatsApp vê trabalhos reais logo depois do topo e encontra preço de referência sem precisar perguntar.

A seção de tecnologias (`src/components/sections/Stack.tsx`) está fora da página. Para voltar com ela, inclua `<Stack />` em `HomePage.tsx` e `"stack"` em `nav.ts`. Os nomes das tecnologias continuam nos dados estruturados (`src/lib/json-ld.ts`).

### Trocar a foto

Substitua `src/assets/images/saymon.jpg` mantendo o nome. Use uma imagem quadrada de pelo menos **800 × 800 px**, sem metadados de localização (o recorte atual tem 1000 × 1000 px).

## Como funciona

**Idiomas.** Cada idioma tem sua própria página estática (`/` e `/en`), com `lang`, metadados, Open Graph e `hreflang` próprios. No navegador, a troca acontece sem recarregar: o texto muda dentro de uma View Transition, a rolagem e as animações continuam onde estavam, a URL passa a ser a do outro idioma e um cookie guarda a escolha — quem escolheu inglês e volta a `/` é levado a `/en`. Sem JavaScript, os botões de idioma são links normais.

**Imagens.** Sem servidor de imagens, a otimização acontece no build: `scripts/optimize-images.mjs` gera versões WebP de cada imagem em várias larguras (`image-sizes.json`) e o loader em `src/lib/image-loader.ts` monta o `srcset` com elas.

**Contato.** O formulário não envia nada por trás: ele monta a mensagem e abre o WhatsApp (ou o app de e-mail) já preenchido, para a pessoa revisar e enviar.

**Imagem de compartilhamento.** `/og.png` e `/en/og.png` são geradas no build a partir de `src/lib/og-image.tsx`, com a foto e o título de cada idioma.

## Área privada (`/admin`)

Lista de prospecção: empresas da região, o que foi encontrado em cada uma, a mensagem pronta para o WhatsApp e o andamento de cada contato. Só o dono do site entra.

**Como funciona.**

- `worker/index.js` só roda em `/admin` e `/admin/*` (`run_worker_first` em [`wrangler.jsonc`](wrangler.jsonc)). O resto do site continua servido direto dos arquivos.
- O login é do **Cloudflare Access**. O Worker confere a assinatura do token que o Access envia em cada requisição (`Cf-Access-Jwt-Assertion`). Enquanto `ACCESS_TEAM_DOMAIN` e `ACCESS_AUD` estiverem vazios, `/admin` responde “Área em configuração” para todo mundo.
- Os dados ficam no banco D1 `saymon-admin` (binding `DB`). **Nunca coloque empresas ou anotações no repositório**: ele é público. Aqui vai só a estrutura, em `migrations/`.
- A página (`public/admin/`) usa CSS e JS em arquivos próprios, porque a CSP do site (`public/_headers`) não aceita `<style>` dentro do HTML.
- Feita para usar no celular. A aba **Fazer agora** junta só o que pede ação: quem respondeu, as negociações, os retornos vencidos (3 dias sem resposta) e quem ainda não recebeu mensagem. O botão verde abre o WhatsApp com o texto pronto e a ficha pergunta “Mandou?” ao voltar. O retorno enviado fica em `followup_at` (migração `0002`).
- Dá para pôr a lista na tela inicial do celular. O manifesto (`public/admin/manifest.webmanifest`) fica atrás do login, por isso o `<link rel="manifest">` usa `crossorigin="use-credentials"`; os ícones são os públicos do site.

**Ativar o login (uma vez).**

1. No painel da Cloudflare, abra **Zero Trust** e crie a organização: escolha um nome de time e o plano **Free** (a Cloudflare pede um cartão, mas não cobra).
2. Em **Access controls → Applications**, crie uma aplicação **Self-hosted and private** com o destino `saymonthedev.com/admin`.
3. Na política, use **Allow** e inclua o seu e-mail (seletor *Emails*). O login padrão é com a conta da Cloudflare; dá para adicionar código por e-mail (*One-time PIN*) em **Integrations → Identity providers**.
4. Copie o **Application Audience (AUD) Tag** da aplicação e o endereço do time (`https://<time>.cloudflareaccess.com`) para `ACCESS_AUD` e `ACCESS_TEAM_DOMAIN` em `wrangler.jsonc`, e publique.

**Comandos úteis.**

```bash
npx wrangler d1 migrations apply saymon-admin --remote   # aplica mudanças de estrutura
npx wrangler d1 execute saymon-admin --remote --command "SELECT name, status FROM leads ORDER BY sort_order"
```

## Acessibilidade e desempenho

- HTML semântico, um `h1` por página, navegação completa por teclado e foco visível.
- Link “Pular para o conteúdo”; menu mobile com foco preso, `Esc` para fechar e conteúdo de fundo `inert`.
- `prefers-reduced-motion`: sem inércia de rolagem, sem parallax e sem animações de entrada.
- Sem JavaScript, todo o conteúdo continua visível.
- Efeitos contínuos (borda luminosa, brilho do topo) ficam parados em telas de toque.

Lighthouse medido localmente no build de produção:

| | Performance | Acessibilidade | Boas práticas | SEO |
| --- | --- | --- | --- | --- |
| Desktop | 100 | 100 | 100 | 100 |
| Mobile (simulação 4G + CPU 4×) | ~90 | 100 | 100 | 100 |

## Estrutura

```text
src/
  app/
    (pt)/              página em português ( / ) e sua imagem de compartilhamento
    (en)/en/           página em inglês ( /en )
    global-not-found.tsx, sitemap.ts, robots.ts, manifest.ts, ícones
    globals.css        tema, utilitários e animações
  components/
    layout/            cabeçalho, menu mobile, seletor de idioma, rodapé
    sections/          Hero, Projetos, Serviços, Processo, Sobre, Contato (e Tecnologias, fora da página)
    ui/                botões, monograma, logos, títulos de seção
    providers/         rolagem suave, revelação ao rolar, Motion
  config/              dados pessoais e fontes
  data/                serviços, tecnologias, projetos e logotipos
  hooks/               seção ativa, spotlight dos cartões, media queries
  i18n/                idiomas, dicionários e provedor de idioma
  lib/                 links, SEO, JSON-LD, imagem de compartilhamento, loader de imagens
  assets/              foto, capturas dos projetos e fontes da imagem de compartilhamento
scripts/               otimização de imagens e geração de ícones
public/                bandeiras, ícones do app e _headers (cabeçalhos da Cloudflare)
  admin/               página da área privada /admin (HTML, CSS, JS e manifesto)
worker/                Worker da área privada: login do Access e API da lista
migrations/            estrutura do banco D1 da área privada (sem dados)
```

## Créditos

Logotipos de [Simple Icons](https://simpleicons.org) (CC0) e [Devicon](https://devicon.dev) (MIT); bandeiras de [flag-icons](https://flagicons.lipis.dev) (MIT); fontes Geist e Instrument Serif (SIL Open Font License). As marcas pertencem aos respectivos donos.

Os serviços freelance são prestados de forma independente, sem vínculo com a WEG.
