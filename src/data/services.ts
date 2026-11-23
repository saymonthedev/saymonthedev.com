import { CalendarCheck, LayoutDashboard, MonitorSmartphone, type LucideIcon } from "lucide-react";

/** Ícone de cada serviço. Os textos e preços ficam em `services.items` no dicionário. */
export const serviceIcons: Record<string, LucideIcon> = {
  site: MonitorSmartphone,
  agenda: CalendarCheck,
  custom: LayoutDashboard,
};
