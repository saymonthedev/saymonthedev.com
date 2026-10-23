"use client";

import { Mail, Send } from "lucide-react";
import { useId, useRef, useState, type FormEvent } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useI18n } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/cn";
import { mailtoUrl, whatsappUrl } from "@/lib/links";

type Channel = "whatsapp" | "email";
type Errors = { name?: boolean; message?: boolean };

const MIN_MESSAGE = 10;

/**
 * Monta a mensagem e abre o WhatsApp ou o app de e-mail já preenchidos.
 * Nada é enviado por trás: a pessoa revisa e envia pelo próprio canal.
 */
export function ContactComposer() {
  const { dict } = useI18n();
  const form = dict.contact.form;
  const id = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sentVia, setSentVia] = useState<Channel | null>(null);

  const validate = () => {
    const next: Errors = {
      name: name.trim().length < 2 || undefined,
      message: message.trim().length < MIN_MESSAGE || undefined,
    };
    setErrors(next);
    if (next.name) nameRef.current?.focus();
    else if (next.message) messageRef.current?.focus();
    return !next.name && !next.message;
  };

  const compose = () => {
    const { template } = form;
    const lines = [template.greeting.replace("{name}", () => name.trim()), template.intro];
    if (type !== null) lines.push(template.type.replace("{type}", () => form.types[type]));
    lines.push("", message.trim());
    return lines.join("\n");
  };

  const send = (channel: Channel) => {
    if (!validate()) return;
    const text = compose();
    if (channel === "whatsapp") {
      window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
    } else {
      window.location.href = mailtoUrl(form.template.subject.replace("{name}", () => name.trim()), text);
    }
    setSentVia(channel);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    send("whatsapp");
  };

  const fieldClass =
    "w-full rounded-2xl border bg-ink-950/60 px-4 py-3.5 text-[15px] text-fg placeholder:text-subtle transition-[border-color,box-shadow] duration-300 outline-none focus:border-accent-300/70 focus:shadow-[0_0_0_4px_rgb(59_130_246/0.15)]";

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-labelledby={`${id}-title`}
      className="relative rounded-[1.75rem] border border-(--line) bg-ink-950/70 p-5 sm:p-7"
    >
      <h3 id={`${id}-title`} className="text-xl font-semibold tracking-tight">
        {form.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{form.description}</p>

      <div className="mt-7 space-y-6">
        <div>
          <label htmlFor={`${id}-name`} className="text-sm font-medium text-soft">
            {form.name}
          </label>
          <input
            ref={nameRef}
            id={`${id}-name`}
            type="text"
            autoComplete="name"
            maxLength={80}
            value={name}
            placeholder={form.namePlaceholder}
            onChange={(event) => {
              setName(event.target.value);
              if (errors.name) setErrors((current) => ({ ...current, name: undefined }));
            }}
            aria-invalid={errors.name || undefined}
            aria-describedby={errors.name ? `${id}-name-error` : undefined}
            className={cn(fieldClass, "mt-2", errors.name ? "border-rose-400/70" : "border-(--line-strong)")}
          />
          {errors.name && (
            <p id={`${id}-name-error`} className="mt-2 text-sm text-rose-300">
              {form.errors.name}
            </p>
          )}
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-soft">
            {form.type} <span className="font-normal text-subtle">({form.optional})</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {form.types.map((label, index) => {
              const checked = type === index;
              return (
                <label key={label} className="cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value={label}
                    checked={checked}
                    onChange={() => setType(index)}
                    onClick={() => checked && setType(null)}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      "inline-flex min-h-9 items-center rounded-full border px-3.5 text-[13px] transition-colors duration-300 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-300",
                      checked
                        ? "border-accent-300/60 bg-accent/20 text-fg"
                        : "border-(--line-strong) bg-white/[0.02] text-muted hover:border-white/25 hover:text-soft",
                    )}
                  >
                    {label}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor={`${id}-message`} className="text-sm font-medium text-soft">
            {form.message}
          </label>
          <textarea
            ref={messageRef}
            id={`${id}-message`}
            rows={4}
            maxLength={1200}
            value={message}
            placeholder={form.messagePlaceholder}
            onChange={(event) => {
              setMessage(event.target.value);
              if (errors.message) setErrors((current) => ({ ...current, message: undefined }));
            }}
            aria-invalid={errors.message || undefined}
            aria-describedby={errors.message ? `${id}-message-error` : undefined}
            className={cn(
              fieldClass,
              "mt-2 min-h-32 resize-y",
              errors.message ? "border-rose-400/70" : "border-(--line-strong)",
            )}
          />
          {errors.message && (
            <p id={`${id}-message-error`} className="mt-2 text-sm text-rose-300">
              {form.errors.message}
            </p>
          )}
        </div>
      </div>

      {/* Lado a lado só quando os dois cabem inteiros; senão, um embaixo do outro. */}
      <div className="mt-7 flex flex-wrap gap-3">
        <button type="submit" className="btn btn-primary flex-auto">
          <BrandLogo name="whatsapp" tone="mono" className="size-4" />
          {form.sendWhatsapp}
          <Send aria-hidden="true" className="btn-icon btn-icon-diag hidden size-4 shrink-0 min-[360px]:block" />
        </button>
        <button type="button" onClick={() => send("email")} className="btn btn-ghost flex-auto">
          <Mail aria-hidden="true" className="size-4 shrink-0" />
          {form.sendEmail}
        </button>
      </div>

      <p role="status" className="mt-4 min-h-5 text-sm text-signal">
        {sentVia === "whatsapp" && form.openedWhatsapp}
        {sentVia === "email" && form.openedEmail}
      </p>
    </form>
  );
}
