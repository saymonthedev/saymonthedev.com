import type { StaticImageData } from "next/image";
import type { Localized } from "@/i18n/config";
import type { BrandIconName } from "./brand-icons";
import cobreDesktop from "@/assets/projects/barbearia-cobre-desktop.webp";
import cobreMobile from "@/assets/projects/barbearia-cobre-mobile.webp";
import litoralDesktop from "@/assets/projects/litoral-bordados-desktop.webp";
import litoralMobile from "@/assets/projects/litoral-bordados-mobile.webp";

export type Project = {
  slug: string;
  title: string;
  /** Só projetos com `published: true` aparecem no site. */
  published: boolean;
  year: string;
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
      "pt-BR": "Site institucional · Landing page",
      en: "Company website · Landing page",
    },
    description: {
      "pt-BR":
        "Site institucional para uma empresa de bordados personalizados, com identidade visual própria e uma animação autoral no topo da página: uma agulha borda, ponto a ponto, o mesmo desenho da marca.",
      en: "Company website for a custom embroidery business, with its own visual identity and a signature animation at the top of the page: a needle stitches the brand mark, one stitch at a time.",
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
    // O README do projeto aponta https://litoralbordados.com, mas o endereço
    // não respondeu na verificação. Descomente quando estiver no ar:
    // liveUrl: "https://litoralbordados.com",
  },
];

export const publishedProjects = projects.filter((project) => project.published);
