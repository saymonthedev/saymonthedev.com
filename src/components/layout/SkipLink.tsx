"use client";

import { useI18n } from "@/i18n/LocaleProvider";

export function SkipLink() {
  const { dict } = useI18n();
  return (
    <a
      href="#main-content"
      className="fixed top-3 left-3 z-[70] -translate-y-24 rounded-full bg-fg px-5 py-3 text-sm font-medium text-ink-950 transition-transform focus-visible:translate-y-0"
    >
      {dict.a11y.skipToContent}
    </a>
  );
}
