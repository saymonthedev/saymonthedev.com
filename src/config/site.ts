/**
 * Informações pessoais e canais de contato.
 * Tudo que aparece no site sobre contato sai daqui.
 */
export const site = {
  name: "Saymon Oliveira de Castro",
  shortName: "Saymon",
  initials: "SOC",
  email: "saymonthedev@gmail.com",
  whatsapp: {
    /** Somente números: DDI + DDD + número. */
    number: "5547999171788",
    display: "+55 47 99917-1788",
  },
  github: {
    url: "https://github.com/saymonthedev",
    handle: "saymonthedev",
  },
  linkedin: {
    url: "https://www.linkedin.com/in/saymon-oliveira-de-castro-821b71319",
    handle: "saymon-oliveira-de-castro",
  },
  /** Fuso usado no relógio do cartão do Hero. */
  timeZone: "America/Sao_Paulo",
} as const;
