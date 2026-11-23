import type { Dictionary } from "./pt-BR";

export const en: Dictionary = {
  meta: {
    title: "Websites & online booking in Jaraguá do Sul, Brazil · Saymon",
    description:
      "Websites and online booking for service businesses in Jaraguá do Sul (SC), Brazil, and the surrounding region. Business websites from R$ 1,500, with direct support on WhatsApp.",
    ogAlt: "Saymon Oliveira de Castro, websites and online booking in Jaraguá do Sul",
    /** Linha de serviços na imagem de compartilhamento. */
    ogTags: ["Websites", "Online booking", "Custom systems"],
    keywords: [
      "website development",
      "website design Jaraguá do Sul",
      "small business website",
      "online booking",
      "appointment scheduling system",
      "landing page",
      "management system",
      "developer in Jaraguá do Sul",
      "freelance developer",
      "full stack developer",
    ],
  },

  sections: {
    home: "home",
    services: "services",
    about: "about",
    stack: "stack",
    projects: "projects",
    process: "process",
    contact: "contact",
  },

  whatsappMessage: "Hi Saymon! I saw your website and would like to get a quote.",

  a11y: {
    skipToContent: "Skip to content",
    mainNav: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    languageSwitcher: "Site language",
    newTab: "opens in a new tab",
    home: "Saymon Oliveira de Castro — home",
  },

  language: {
    "pt-BR": { short: "PT", name: "Português" },
    en: { short: "EN", name: "English" },
  },

  nav: {
    services: "Services",
    about: "About",
    stack: "Stack",
    projects: "Work",
    process: "How it works",
    contact: "Contact",
    cta: "Get a quote",
  },

  hero: {
    availability: "Serving Jaraguá do Sul and the region",
    headline: "Websites and online booking for",
    headlineAccent: "service businesses.",
    lead: "I'm Saymon, a developer based in Jaraguá do Sul, Brazil. I build the website that sends customers straight to your WhatsApp and the schedule that organizes your appointments on your phone, with open slots at a glance and no double bookings.",
    primaryCta: "Get a quote on WhatsApp",
    secondaryCta: "See my work",
    note: "You talk directly to me, no middlemen.",
    scroll: "Scroll to see my work",
    card: {
      photoAlt: "Photo of Saymon Oliveira de Castro in a suit and blue tie",
      rows: {
        role: "Specialty",
        base: "Based in",
        status: "Status",
        languages: "Languages",
      },
      timeLabel: "Brasília time",
      roleValue: "Websites & booking",
      baseValue: "Jaraguá do Sul, BR",
      statusValue: "Open to projects",
      languagesValue: "PT · EN",
    },
  },

  services: {
    eyebrow: "Services & pricing",
    title: "What I do",
    titleAccent: "and what it costs.",
    intro:
      "Reference prices so you have an idea before we talk. The final price depends on what your business needs, and you get the quote in writing before any work starts.",
    idealFor: "Great for",
    items: [
      {
        id: "site",
        title: "Business website",
        price: { from: "from", value: "R$ 1,500" },
        description:
          "A fast page that looks great on phones, with your services, photos of your work and a button straight to WhatsApp. Set up for Google, so people looking for your service in town can find you.",
        tags: ["Businesses with only Instagram", "An old or broken website", "Getting quote requests"],
      },
      {
        id: "agenda",
        title: "Website + online booking",
        highlight: "My specialty",
        price: { from: "from", value: "R$ 3,000", extra: "+ R$ 149/month" },
        description:
          "The website plus a schedule on your phone, with open slots at a glance, no double bookings and confirmations on WhatsApp. If it makes sense, customers can book on their own through the site. The monthly fee covers hosting, maintenance and support.",
        tags: ["Installation & maintenance", "Barbershops & beauty", "Appointment-based services"],
      },
      {
        id: "custom",
        title: "Custom system",
        price: { value: "Custom quote" },
        description:
          "For when spreadsheets and WhatsApp can't keep up anymore: jobs, orders, quotes and your team in one place, with separate access for each employee. Like the Stainhaus system.",
        tags: ["Stone & woodworking shops", "Field teams", "Order tracking"],
      },
    ],
    cta: {
      text: "Need something else, like an online store, an automation or an integration? Tell me about it.",
      button: "Tell me about your project",
    },
  },

  about: {
    eyebrow: "About me",
    title: "A local developer,",
    titleAccent: "from Jaraguá do Sul.",
    paragraphs: [
      "I'm Saymon. I like taking whatever is a hassle in a business today, like a paper appointment book or orders lost in WhatsApp chats, and turning it into something simple to use.",
      "I studied Systems Development through the CentroWEG program, in partnership with SENAI in Jaraguá do Sul, and I'm now studying Software Engineering at Católica SC. I work as a developer at WEG Drives & Controls, where I'm the only developer in my section: I understand the need, propose a path and own the solution.",
      "Freelance work is no different: you talk directly to me, from first contact to delivery.",
    ],
    timelineTitle: "Journey",
    timeline: [
      {
        period: "2023 — 2025",
        title: "Systems Development program",
        place: "CentroWEG in partnership with SENAI · Jaraguá do Sul",
      },
      {
        period: "2025 — 2029",
        title: "Software Engineering degree",
        place: "Católica SC",
      },
      {
        period: "Currently",
        title: "Developer at WEG Drives & Controls",
        place: "Quality department, WEG Automação",
        detail: "The only developer in the section",
      },
      {
        period: "Alongside",
        title: "Freelance projects",
        place: "Websites, online booking and systems for businesses in the region",
      },
    ],
    award: {
      eyebrow: "Recognition · 2025",
      title: "Quick Kaizen standout at WEG's Kaizen Olympics",
      text: "Standout for Factory VIII in the Quick Kaizen category, with the project “Rota WMR – Fluxo Axial”. The category honors practical improvements implemented by the people who live the process every day. It's the same mindset I bring to your business.",
      tags: ["Quick Kaizen", "Factory VIII", "Continuous improvement"],
      schema: "Quick Kaizen category standout — WEG Kaizen Olympics 2025",
    },
    traits: [
      {
        id: "direct",
        title: "Straight to me",
        text: "No call center and no middlemen: the person you talk to is the person doing the work.",
      },
      {
        id: "custom",
        title: "Made for your business",
        text: "No templates: each website is designed for your brand, and the schedule follows the rules of how you work.",
      },
      {
        id: "mobile",
        title: "Built for phones",
        text: "Tested on phones, where your customers will open it, and light even on 4G.",
      },
      {
        id: "local",
        title: "From the region",
        text: "I'm from Jaraguá do Sul and work with businesses in the city and the surrounding region.",
      },
    ],
  },

  stack: {
    eyebrow: "Stack",
    title: "The tools",
    titleAccent: "I build with.",
    intro:
      "A modern, proven ecosystem, chosen to deliver applications that are fast, secure and easy to maintain.",
    categories: {
      frontend: {
        title: "Frontend",
        note: "Fast, accessible and responsive interfaces.",
      },
      backend: {
        title: "Backend",
        note: "Business rules, services and integrations.",
      },
      data: {
        title: "Databases & tools",
        note: "Well-modeled data and version control.",
      },
      devops: {
        title: "DevOps & infrastructure",
        note: "Containers, networking, environments and continuous delivery.",
      },
      engineering: {
        title: "Software engineering",
        note: "Practices that keep quality high.",
      },
    },
    items: {
      rest: "REST APIs",
      cicd: "CI/CD",
      networking: "Networking",
      testing: "Testing",
      cleancode: "Clean Code",
      bestpractices: "Best practices",
      architecture: "Software architecture",
      integrations: "Systems integration",
    },
  },

  projects: {
    eyebrow: "Portfolio",
    title: "Work",
    titleAccent: "that's already live.",
    intro:
      "Clients from Jaraguá do Sul and concept projects that show what's possible for your business. Everything is live: open it and try it.",
    labels: {
      repo: "View repository",
      live: "Visit website",
      stack: "Tech stack",
      highlights: "Highlights",
      browse: "Scroll through the page",
      browseStop: "Back to the top of the page",
      desktopPreview: "desktop version",
      mobilePreview: "mobile version",
    },
    more: {
      title: "Yours could be next",
      text: "Tell me how your business handles customers today and I'll tell you what makes sense to build, and what it costs.",
      cta: "Chat on WhatsApp",
    },
  },

  process: {
    eyebrow: "How it works",
    title: "From first contact",
    titleAccent: "to going live.",
    intro: "No hassle and no jargon: you know what will be built, what it costs and when it'll be ready.",
    steps: [
      {
        title: "Conversation",
        text: "Tell me how you handle customers today and what's slowing you down. Text, voice message or a call all work.",
      },
      {
        title: "Proposal",
        text: "I send you in writing what will be built, the timeline and the price. Work only starts once you approve.",
      },
      {
        title: "Development",
        text: "You follow along as it takes shape and test everything before it goes live.",
      },
      {
        title: "Launch",
        text: "I put it live and show you how to use it. On monthly plans, support continues after launch.",
      },
    ],
    note: "Quotes come with no commitment: you only decide once you know exactly what you're getting.",
  },

  contact: {
    eyebrow: "Contact",
    title: "Tell me how your business",
    titleAccent: "handles customers today.",
    text: "In a quick WhatsApp chat I'll tell you what makes sense for your business and what it costs. No strings attached.",
    primary: "Chat on WhatsApp",
    channels: {
      whatsapp: "WhatsApp",
      email: "Email",
      github: "GitHub",
      linkedin: "LinkedIn",
    },
    form: {
      title: "Get started",
      description:
        "Fill in the fields and your message opens ready to go in WhatsApp or your email app, so you can review it before sending.",
      name: "Your name",
      namePlaceholder: "What should I call you?",
      type: "What you need",
      optional: "optional",
      types: ["Business website", "Website + online booking", "Custom system", "Something else"],
      message: "About your business",
      messagePlaceholder: "Tell me briefly what your business does and what you need.",
      sendWhatsapp: "Send via WhatsApp",
      sendEmail: "Send via email",
      errors: {
        name: "Please enter your name.",
        message: "Tell me a little more (at least 10 characters).",
      },
      openedWhatsapp: "WhatsApp opened in a new tab with your message.",
      openedEmail: "Your email app opened with the message ready.",
      template: {
        greeting: "Hi Saymon! My name is {name}.",
        intro: "I saw your website and would like to get a quote.",
        type: "What I need: {type}",
        subject: "Quote — {name}",
      },
    },
  },

  footer: {
    role: "Full Stack Developer",
    description: "Websites and online booking for service businesses in Jaraguá do Sul and the region.",
    navTitle: "Navigation",
    socialTitle: "Social",
    contactTitle: "Contact",
    rights: "All rights reserved.",
    independent: "Freelance services provided independently.",
    builtWith: "Built with Next.js, TypeScript and Tailwind CSS.",
    backToTop: "Back to top",
  },
};
