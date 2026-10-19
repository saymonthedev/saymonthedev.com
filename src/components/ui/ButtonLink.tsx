"use client";

import type { LucideIcon } from "lucide-react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useI18n } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/cn";

type IconMotion = "x" | "y" | "diag";

type ButtonLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & {
  href: string;
  variant?: "primary" | "ghost";
  size?: "md" | "lg";
  icon?: LucideIcon;
  iconMotion?: IconMotion;
  /** Elemento exibido antes do texto (ex.: logotipo). */
  leading?: ReactNode;
  external?: boolean;
  children: ReactNode;
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconMotion = "x",
  leading,
  external,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const { dict } = useI18n();
  return (
    <a
      href={href}
      className={cn(
        "btn",
        variant === "primary" ? "btn-primary" : "btn-ghost",
        size === "lg" && "min-h-14 px-7 text-base",
        className,
      )}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {leading}
      <span>{children}</span>
      {Icon && (
        <Icon aria-hidden="true" className={cn("btn-icon size-4", `btn-icon-${iconMotion}`)} strokeWidth={2} />
      )}
      {external && <span className="sr-only">({dict.a11y.newTab})</span>}
    </a>
  );
}
