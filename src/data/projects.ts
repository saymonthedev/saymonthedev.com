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
import ortsDesktop from "@/assets/projects/orts-climatizacao-desktop.webp";
import ortsMobile from "@/assets/projects/orts-climatizacao-mobile.webp";
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
 *
 * A ordem é a de quem procura um site para a empresa: clientes reais primeiro,
 * depois os projetos conceituais e, por último, os projetos pessoais. Os
 * destaques falam do que o cliente ganha; as tecnologias ficam nos selos.
 */
export const projects: Project[] = [
  {
    slug: "orts-climatizacao",
    title: "ORTS Climatização",
    published: true,
    year: "2026",
    badge: {
      "pt-BR": "Cliente em destaque",
      en: "Featured client",
    },
    kind: {
      "pt-BR": "Cliente · Site e agenda de atendimentos",
      en: "Client project · Website and appointment schedule",
    },
    description: {
      "pt-BR":
        "Site e agenda de atendimentos da ORTS Climatização, de Jaraguá do Sul (SC). O site mostra os serviços e os trabalhos reais da empresa e leva o cliente direto ao WhatsApp. A agenda, que o dono usa no celular, organiza as instalações e manutenções por dia, semana e mês.",
      en: "Website and appointment schedule for ORTS Climatização, an HVAC company in Jaraguá do Sul, Brazil. The site shows the company's services and real work and sends customers straight to WhatsApp. The schedule, which the owner uses on their phone, organizes installations and maintenance visits by day, week and month.",
    },
    highlights: {
      "pt-BR": [
        "O cliente vê os serviços e fotos de trabalhos reais e chama no WhatsApp com um toque",
        "Agenda no celular do dono, com os horários livres na hora e nada marcado em dobro",
        "Considera expediente, pausas e o tempo de deslocamento entre um cliente e outro",
        "Logo redesenhada em alta qualidade, com variações e paleta de cores própria",
      ],
      en: [
        "Customers see the services and photos of real work, and reach out on WhatsApp in one tap",
        "A schedule on the owner's phone, with open slots at a glance and no double bookings",
        "Accounts for working hours, breaks and travel time between one customer and the next",
        "Logo redrawn in high quality, with variations and its own color palette",
      ],
    },
    stack: [
      { name: "Next.js", logo: "nextjs" },
      { name: "TypeScript", logo: "typescript" },
      { name: "Node.js", logo: "nodejs" },
      { name: "PostgreSQL", logo: "postgresql" },
      { name: "Tailwind CSS", logo: "tailwind" },
    ],
    images: {
      desktop: ortsDesktop,
      mobile: ortsMobile,
      alt: {
        "pt-BR": "Site institucional da ORTS Climatização e, no celular, a agenda do painel administrativo com dados fictícios",
        en: "ORTS Climatização website and, on mobile, the admin scheduling dashboard with fictional data",
      },
    },
    repoUrl: "https://github.com/saymonthedev/agenda-orts-climatizacao",
    liveUrl: "https://ortsclimatizacao.com.br",
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
        "Sistema de gestão sob medida para a Stainhaus Marmoraria, de Jaraguá do Sul (SC): cada obra acompanhada da medição à instalação, com clientes, tarefas, agenda de medições e entregas e uma equipe em que cada um tem o seu acesso.",
      en: "Custom management system for Stainhaus Marmoraria, a stone shop in Jaraguá do Sul, Brazil: every job tracked from measuring to installation, with customers, tasks, a schedule of site visits and deliveries, and a team where everyone has their own access.",
    },
    highlights: {
      "pt-BR": [
        "Cada obra segue as etapas reais da produção: orçamento, medição, corte, acabamento e instalação",
        "Agenda de medições e entregas ligada às obras, por dia, semana e mês",
        "Cada colaborador vê só o que precisa, com permissões por pessoa",
        "Tem demonstração aberta: entre e teste o sistema com dados fictícios",
      ],
      en: [
        "Every job follows the real production stages: quote, measuring, cutting, finishing and installation",
        "A schedule of site visits and deliveries tied to each job, by day, week and month",
        "Each employee sees only what they need, with per-person permissions",
        "There's an open demo: log in and try the system with fictional data",
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
    slug: "barbearia-cobre",
    title: "Barbearia Cobre",
    published: true,
    year: "2026",
    kind: {
      "pt-BR": "Projeto conceitual · Site com agendamento online",
      en: "Concept project · Website with online booking",
    },
    description: {
      "pt-BR":
        "Site para uma barbearia fictícia em que o cliente marca o horário sozinho: escolhe o serviço, o profissional, o dia e o horário, e a confirmação sai pronta para o WhatsApp.",
      en: "Website for a fictional barbershop where customers book on their own: they pick a service, a barber, a day and a time, and the confirmation is ready to send on WhatsApp.",
    },
    highlights: {
      "pt-BR": [
        "O cliente marca sozinho, a qualquer hora, sem esperar alguém responder",
        "Mostra o próximo horário livre e reserva com um toque",
        "A confirmação sai pronta para enviar pelo WhatsApp",
        "Visual com a cara da barbearia: espelho, letreiro, comanda e placa",
      ],
      en: [
        "Customers book on their own, any time, without waiting for a reply",
        "Shows the next open slot and books it in one tap",
        "The confirmation is ready to send on WhatsApp",
        "A look that feels like the shop itself: mirror, letter board, ticket and sign",
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
      "pt-BR": "Projeto conceitual · Site profissional",
      en: "Concept project · Business website",
    },
    description: {
      "pt-BR":
        "Site para uma empresa fictícia de bordados personalizados, com identidade visual própria e uma animação no topo em que a agulha borda a marca, ponto a ponto.",
      en: "Website for a fictional custom embroidery business, with its own visual identity and an animation at the top where a needle stitches the brand mark, one stitch at a time.",
    },
    highlights: {
      "pt-BR": [
        "A agulha borda a logo no topo da página, com botão para pausar a animação",
        "Galeria com peças de exemplo: uniforme, boné, jaleco, toalha e patch",
        "Pedido de orçamento direto no WhatsApp, com a mensagem já escrita",
        "Identidade visual criada do zero: logo, cores e ícones em pesponto",
      ],
      en: [
        "A needle stitches the logo at the top of the page, with a button to pause the animation",
        "A gallery of sample pieces: uniform, cap, lab coat, towel and patch",
        "Quote requests straight to WhatsApp, with the message already written",
        "Visual identity built from scratch: logo, colors and stitched icons",
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
        "pt-BR": "Captura de tela do site da Litoral Bordados, projeto conceitual, com o bastidor bordando a marca",
        en: "Screenshot of the Litoral Bordados concept website, with the embroidery hoop stitching the brand",
      },
    },
    repoUrl: "https://github.com/saymonthedev/litoral-bordados",
    liveUrl: "https://litoralbordados.com",
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
        "Cardápio e pedido online para uma hamburgueria fictícia: o cliente monta o lanche camada por camada, vê o preço na hora e fecha o pedido pelo WhatsApp, para entrega ou retirada.",
      en: "Online menu and ordering for a fictional burger joint: customers build their burger layer by layer, see the price right away and send the order on WhatsApp, for delivery or pickup.",
    },
    highlights: {
      "pt-BR": [
        "O cliente monta o burger camada por camada e vê o preço na hora",
        "O pedido chega organizado no WhatsApp, sem ida e volta de mensagens",
        "Horário de funcionamento, taxa por bairro, agendamento e cupom funcionando de verdade",
        "Comanda que separa os itens por estação da cozinha",
      ],
      en: [
        "Customers build their burger layer by layer and see the price right away",
        "Orders arrive organized on WhatsApp, with no back-and-forth",
        "Opening hours, delivery fees by neighborhood, scheduling and a coupon that really work",
        "A ticket that splits items by kitchen station",
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
    slug: "dominio-politico",
    title: "Domínio Político",
    published: true,
    year: "2026",
    kind: {
      "pt-BR": "Projeto pessoal · Jogo de navegador",
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
];

export const publishedProjects = projects.filter((project) => project.published);
