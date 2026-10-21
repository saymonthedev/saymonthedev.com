# saymonthedev.com

Site pessoal de **Saymon Oliveira de Castro**, desenvolvedor Full Stack — portfólio e canal de contato para projetos freelance.

Bilíngue (português em `/`, inglês em `/en`), 100% estático e publicado na Cloudflare.

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
| Projetos | `src/data/projects.ts` (+ capturas em `src/assets/projects/`) |
| Tecnologias | `src/data/technologies.ts` (logos em `src/data/brand-icons.ts`) |
| Ícones dos serviços | `src/data/services.ts` |
| Foto | `src/assets/images/saymon.png` |
| Cores, fontes e animações | `src/app/globals.css` e `src/config/fonts.ts` |

O dicionário em inglês tem o mesmo tipo do português: se um texto faltar em um dos idiomas, o TypeScript acusa no build.

### Adicionar um projeto

1. Salve as capturas reais em `src/assets/projects/` — a de computador deve ser a **página inteira** (a prévia percorre a imagem no hover); a de celular é opcional.
2. Em `src/data/projects.ts`, importe as imagens e copie o item existente.
3. `published: false` mantém o projeto fora do site até ser aprovado; `liveUrl` só deve ser preenchido com um endereço confirmado no ar.

O layout se adapta à quantidade de projetos: com um número ímpar, um cartão “Mais projetos a caminho” completa a grade.

### Trocar a foto

Substitua `src/assets/images/saymon.png` mantendo o nome. Use uma imagem quadrada de pelo menos **800 × 800 px**, sem metadados de localização (a foto atual tem 300 × 300 px).

## Como funciona

**Idiomas.** Cada idioma tem sua própria página estática (`/` e `/en`), com `lang`, metadados, Open Graph e `hreflang` próprios. No navegador, a troca acontece sem recarregar: o texto muda dentro de uma View Transition, a rolagem e as animações continuam onde estavam, a URL passa a ser a do outro idioma e um cookie guarda a escolha — quem escolheu inglês e volta a `/` é levado a `/en`. Sem JavaScript, os botões de idioma são links normais.

**Imagens.** Sem servidor de imagens, a otimização acontece no build: `scripts/optimize-images.mjs` gera versões WebP de cada imagem em várias larguras (`image-sizes.json`) e o loader em `src/lib/image-loader.ts` monta o `srcset` com elas.

**Contato.** O formulário não envia nada por trás: ele monta a mensagem e abre o WhatsApp (ou o app de e-mail) já preenchido, para a pessoa revisar e enviar.

**Imagem de compartilhamento.** `/og.png` e `/en/og.png` são geradas no build a partir de `src/lib/og-image.tsx`, com a foto e o título de cada idioma.

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
    sections/          Hero, Serviços, Sobre, Tecnologias, Projetos, Processo, Contato
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
```

## Créditos

Logotipos de [Simple Icons](https://simpleicons.org) (CC0) e [Devicon](https://devicon.dev) (MIT); bandeiras de [flag-icons](https://flagicons.lipis.dev) (MIT); fontes Geist e Instrument Serif (SIL Open Font License). As marcas pertencem aos respectivos donos.

Os serviços freelance são prestados de forma independente, sem vínculo com a WEG.
