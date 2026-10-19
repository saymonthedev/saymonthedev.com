import { site } from "@/config/site";

export function whatsappUrl(message: string) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export function mailtoUrl(subject?: string, body?: string) {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  // URLSearchParams codifica espaços como "+", que clientes de e-mail não
  // decodificam em links mailto.
  const query = params.toString().replace(/\+/g, "%20");
  return `mailto:${site.email}${query ? `?${query}` : ""}`;
}
