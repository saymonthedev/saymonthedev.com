import {
  AppWindow,
  LayoutDashboard,
  MonitorSmartphone,
  Sparkles,
  Webhook,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/** Ícone de cada serviço. Os textos ficam em `services.items` no dicionário. */
export const serviceIcons: Record<string, LucideIcon> = {
  sites: MonitorSmartphone,
  saas: AppWindow,
  apis: Webhook,
  dashboards: LayoutDashboard,
  automation: Workflow,
  ai: Sparkles,
};
