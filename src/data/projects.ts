import type { StaticImageData } from "next/image";
import type { Localized } from "@/i18n/config";
import type { BrandIconName } from "./brand-icons";
import cobreDesktop from "@/assets/projects/barbearia-cobre-desktop.webp";
import crostaDesktop from "@/assets/projects/crosta-desktop.webp";
import crostaMobile from "@/assets/projects/crosta-mobile.webp";
import dominioDesktop from "@/assets/projects/dominio-politico-desktop.webp";
import dominioMobile from "@/assets/projects/dominio-politico-mobile.webp";
import cobreMobile from "@/assets/projects/barbearia-cobre-mobile.webp";
import litoralDesktop from "@/assets/projects/litoral-bordados-desktop.webp";
import litoralMobile from "@/assets/projects/litoral-bordados-mobile.webp";
import stainhausDesktop from "@/assets/projects/stainhaus-desktop.webp";
import stainhausMobile from "@/assets/projects/stainhaus-mobile.webp";

export type Project = {
  slug: string;
  title: string;
  /** Só projetos com `published: true` aparecem no site. */
  published: boolean;
  year: string;
  /** Selo de destaque no cartão (use em um projeto só; ele vai primeiro na lista). */
  badge?: Localized<string>;
  kind: Localized<string>;
  description: Localized<string>;
  highlights: Localized<string[]>;
  stack: { name: string; logo: BrandIconName }[];
  /**
   * Capturas reais do projeto. `desktop` deve ser a página inteira (a prévia
   * percorre a imagem de cima a baixo); `mobile` é opcional.
   */
  images: {
    desktop: StaticImageData;
    mobile?: StaticImageData;
    alt: Localized<string>;
  };
  repoUrl?: string;
  /** Preencha apenas depois de confirmar que o endereço está no ar. */
  liveUrl?: string;
};

/**
 * Para adicionar um projeto: coloque as capturas em src/assets/projects/,
 * importe-as acima e acrescente um item a esta lista. O layout se adapta à
 * quantidade de projetos publicados.
 */
export const projects: Project[] = [
  {
    slug: "dominio-politico",
    title: "Domínio Político",
    published: true,
    year: "2026",
    badge: {
      "pt-BR": "Projeto em destaque",
      en: "Featured project",
    },
    kind: {
      "pt-BR": "Projeto autoral · Jogo de navegador",
      en: "Personal project · Browser game",
    },
    description: {
      "pt-BR":
        "Simulador de carreira política em que você começa como cidadão comum e tenta chegar ao Planalto num Brasil que parte do real: o dia seguinte a um 2º turno presidencial, de 2002 a 2026, com os partidos, os eleitos e a economia daquele momento. Dali em diante, a história é simulada e o país continua andando mesmo quando você sai.",
      en: "A political career simulator where you start as an ordinary citizen and try to reach the presidency in a Brazil that begins with real data: the day after a presidential runoff, from 2002 to 2026, with that moment's parties, elected officials and economy. From there the story is simulated, and the country keeps moving even while you're away.",
    },
    highlights: {
      "pt-BR": [
        "Motor de simulação determinístico: eleições com 2º turno e quociente eleitoral, Congresso, economia mensal e regras de cada época",
        "Dados reais do TSE e do Banco Central, com mapa interativo dos 5.570 municípios",
        "Crimes, investigações e dossiês só para personagens fictícios, com política de conteúdo verificada pelo motor",
        "Mundo compartilhado entre jogadores, mundo só seu ou totalmente fictício, além de conquistas e ranking",
      ],
      en: [
        "Deterministic simulation engine: two-round and proportional elections, Congress, a monthly economy and the rules of each era",
        "Real data from Brazil's electoral court and central bank, with an interactive map of all 5,570 municipalities",
        "Crimes, investigations and dossiers only for fictional characters, with a content policy enforced by the engine",
        "A world shared with other players, a private one or a fully fictional one, plus achievements and a leaderboard",
      ],
    },
    stack: [
      { name: "Next.js", logo: "nextjs" },
      { name: "TypeScript", logo: "typescript" },
      { name: "Supabase", logo: "supabase" },
      { name: "PostgreSQL", logo: "postgresql" },
    ],
    images: {
      desktop: dominioDesktop,
      mobile: dominioMobile,
      alt: {
        "pt-BR": "Captura de tela da página inicial do Domínio Político, com o mapa do Brasil por estado",
        en: "Screenshot of the Domínio Político home page, with a map of Brazil by state",
      },
    },
    repoUrl: "https://github.com/saymonthedev/dominio-politico",
    liveUrl: "https://dominio-politico.com.br",
  },
  {
    slug: "stainhaus",
    title: "Stainhaus",
    published: true,
    year: "2026",
    kind: {
      "pt-BR": "Cliente · Sistema de gestão",
      en: "Client project · Management system",
    },
    description: {
      "pt-BR":
        "Sistema de gestão feito sob medida para a Stainhaus Marmoraria, de Jaraguá do Sul (SC): projetos da medição à instalação, clientes, tarefas, agenda de medições e entregas, equipe com permissões e o histórico de cada obra.",
      en: "Custom management system for Stainhaus Marmoraria, a stone shop in Jaraguá do Sul, Brazil: projects from measuring to installation, customers, tasks, a schedule of site visits and deliveries, a team with permissions and the history of every job.",
    },
    highlights: {
      "pt-BR": [
        "Fluxo de etapas da produção real: orçamento, medição, corte, acabamento e instalação",
        "Permissões por colaborador, conferidas no servidor em cada ação",
        "Agenda por dia, semana e mês, ligada aos projetos, e histórico completo de cada obra",
        "Modo demonstração público com dados fictícios, que volta ao estado inicial todo dia",
      ],
      en: [
        "Stages that follow real production: quote, measuring, cutting, finishing and installation",
        "Per-employee permissions, checked on the server for every action",
        "Day, week and month schedule tied to projects, plus a full history of every job",
        "Public demo mode with fictional data that resets every day",
      ],
    },
    stack: [
      { name: "Next.js", logo: "nextjs" },
      { name: "TypeScript", logo: "typescript" },
      { name: "PostgreSQL", logo: "postgresql" },
      { name: "Prisma", logo: "prisma" },
      { name: "Tailwind CSS", logo: "tailwind" },
    ],
    images: {
      desktop: stainhausDesktop,
      mobile: stainhausMobile,
      alt: {
        "pt-BR": "Telas do sistema de gestão da Stainhaus Marmoraria, com dados fictícios",
        en: "Screens from the Stainhaus Marmoraria management system, with fictional data",
      },
    },
    repoUrl: "https://github.com/saymonthedev/agenda-marmoraria",
    liveUrl: "https://agenda-marmoraria-stainhaus.vercel.app",
  },
  {
    slug: "crosta",
    title: "Crosta",
    published: true,
    year: "2026",
    kind: {
      "pt-BR": "Projeto conceitual · Cardápio e pedido online",
      en: "Concept project · Online menu and ordering",
    },
    description: {
      "pt-BR":
        "Cardápio e pedido online para uma hamburgueria fictícia de smash burger: o cliente monta o burger camada por camada, acompanha tudo numa comanda de papel térmico e fecha o pedido pelo WhatsApp, para entrega ou retirada.",
      en: "Online menu and ordering for a fictional smash burger joint: customers build their burger layer by layer, follow everything on a thermal-paper ticket and send the order on WhatsApp, for delivery or pickup.",
    },
    highlights: {
      "pt-BR": [
        "Ficha técnica em SVG que desenha cada camada escolhida, com legenda e preço",
        "Comanda que imprime os itens por estação da cozinha, com o checkout dentro do papel",
        "Horário real de Brasília, agendamento, taxa por bairro, campanha e cupom com regras de verdade",
        "68 testes de fluxo no navegador e Lighthouse 99 no desktop",
      ],
      en: [
        "SVG spec sheet that draws every chosen layer, with labels and prices",
        "A ticket that prints items by kitchen station, with checkout right on the paper",
        "Real São Paulo opening hours, scheduling, delivery fees by area, a campaign and a coupon with real rules",
        "68 end-to-end browser tests and a 99 desktop Lighthouse score",
      ],
    },
    stack: [
      { name: "Next.js", logo: "nextjs" },
      { name: "React", logo: "react" },
      { name: "TypeScript", logo: "typescript" },
      { name: "Tailwind CSS", logo: "tailwind" },
    ],
    images: {
      desktop: crostaDesktop,
      mobile: crostaMobile,
      alt: {
        "pt-BR": "Captura de tela do site da Crosta, projeto conceitual de hamburgueria",
        en: "Screenshot of the Crosta burger joint concept website",
      },
    },
    repoUrl: "https://github.com/saymonthedev/crosta",
    liveUrl: "https://crosta-smash.vercel.app",
  },
  {
    slug: "barbearia-cobre",
    title: "Barbearia Cobre",
    published: true,
    year: "2026",
    kind: {
      "pt-BR": "Projeto conceitual · Landing page e agendamento",
      en: "Concept project · Landing page and booking",
    },
    description: {
      "pt-BR":
        "Site e landing page para uma barbearia fictícia, com agendamento online em uma comanda de papel: o cliente escolhe serviço, profissional, dia e horário, e a confirmação sai pronta para o WhatsApp.",
      en: "Website and landing page for a fictional barbershop, with online booking on a paper ticket: customers pick a service, a barber, a day and a time, and the confirmation is ready to send on WhatsApp.",
    },
    highlights: {
      "pt-BR": [
        "Cada seção é um objeto da barbearia: espelho, letreiro de feltro, comanda, cartas e placa",
        "Calendário, horários e formulários feitos do zero, sem componentes padrão do navegador",
        "Próximo horário livre calculado na hora, com reserva em um toque",
        "Acessibilidade 100 no Lighthouse e publicação contínua na Vercel",
      ],
      en: [
        "Every section is an object from the shop: mirror, felt letter board, ticket, cards and sign",
        "Calendar, time slots and forms built from scratch, with no default browser widgets",
        "Next available slot computed live, bookable in one tap",
        "100 accessibility score on Lighthouse and continuous deployment on Vercel",
      ],
    },
    stack: [
      { name: "Next.js", logo: "nextjs" },
      { name: "React", logo: "react" },
      { name: "TypeScript", logo: "typescript" },
      { name: "Tailwind CSS", logo: "tailwind" },
    ],
    images: {
      desktop: cobreDesktop,
      mobile: cobreMobile,
      alt: {
        "pt-BR": "Captura de tela do site da Barbearia Cobre, projeto conceitual",
        en: "Screenshot of the Barbearia Cobre concept website",
      },
    },
    repoUrl: "https://github.com/saymonthedev/barbearia-cobre",
    liveUrl: "https://barbearia-cobre.vercel.app",
  },
  {
    slug: "litoral-bordados",
    title: "Litoral Bordados",
    published: true,
    year: "2026",
    kind: {
      "pt-BR": "Cliente · Landing page",
      en: "Client project · Landing page",
    },
    description: {
      "pt-BR":
        "Landing page feita para a Litoral Bordados, empresa de bordados personalizados, com identidade visual própria e uma animação autoral no topo da página: uma agulha borda, ponto a ponto, o mesmo desenho da marca.",
      en: "Landing page built for Litoral Bordados, a custom embroidery business, with its own visual identity and a signature animation at the top of the page: a needle stitches the brand mark, one stitch at a time.",
    },
    highlights: {
      "pt-BR": [
        "Animação “Do fio ao bordado” feita à mão com SVG e CSS",
        "Respeita a preferência de movimento reduzido e tem controle de pausa",
        "Rolagem com inércia e parallax entre as seções",
        "Gerado como site estático, preparado para publicação na Cloudflare",
      ],
      en: [
        "Hand-built “thread to stitch” animation in SVG and CSS",
        "Honors reduced-motion preferences and includes a pause control",
        "Inertia scrolling and parallax between sections",
        "Built as a static site, set up for deployment on Cloudflare",
      ],
    },
    stack: [
      { name: "Next.js", logo: "nextjs" },
      { name: "React", logo: "react" },
      { name: "TypeScript", logo: "typescript" },
      { name: "Tailwind CSS", logo: "tailwind" },
    ],
    images: {
      desktop: litoralDesktop,
      mobile: litoralMobile,
      alt: {
        "pt-BR": "Captura de tela do site da Litoral Bordados",
        en: "Screenshot of the Litoral Bordados website",
      },
    },
    repoUrl: "https://github.com/saymonthedev/litoral-bordados",
    liveUrl: "https://litoralbordados.com",
  },
];

export const publishedProjects = projects.filter((project) => project.published);
