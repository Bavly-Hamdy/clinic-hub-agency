"use client";

import React, {
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { Loader2, X } from "lucide-react";

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono uppercase tracking-wider text-stone-300">
          {label}
        </label>
        {hint && <span className="text-[11px] font-mono text-stone-500">{hint}</span>}
      </div>
      {children}
      {error && (
        <p className="text-xs text-red-400 font-mono mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

const inputBaseClass =
  "w-full border border-stone-800 bg-[#121215] px-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 outline-none transition-colors duration-150 focus:border-brass disabled:opacity-50";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBaseClass} ${props.className ?? ""}`} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`${inputBaseClass} min-h-24 resize-y ${props.className ?? ""}`}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`${inputBaseClass} cursor-pointer [&>option]:bg-stone-900 [&>option]:text-stone-200 ${props.className ?? ""}`}
    />
  );
}

export function Button({
  variant = "dark",
  loading = false,
  className = "",
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "dark" | "gold" | "line" | "danger" | "ghost";
  loading?: boolean;
}) {
  const styles = {
    gold: "bg-brass text-black font-semibold hover:bg-brass-soft active:translate-y-[1px]",
    dark: "bg-stone-800 text-stone-200 border border-stone-700 hover:bg-stone-700 active:translate-y-[1px]",
    line: "border border-stone-700 text-stone-300 hover:border-brass hover:text-brass active:translate-y-[1px]",
    danger: "border border-red-800/60 bg-red-950/30 text-red-400 hover:bg-red-900/40 active:translate-y-[1px]",
    ghost: "text-stone-400 hover:text-white hover:bg-stone-800/40",
  }[variant];

  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`}
    >
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      <span>{children}</span>
    </button>
  );
}

export function Notice({
  kind,
  children,
  onClose,
}: {
  kind: "ok" | "error" | "info";
  children: ReactNode;
  onClose?: () => void;
}) {
  const config = {
    ok: "border-brass/40 bg-brass/[0.06] text-brass-soft",
    error: "border-red-800/60 bg-red-950/40 text-red-300",
    info: "border-stone-700 bg-stone-900 text-stone-300",
  }[kind];

  return (
    <div
      role="status"
      className={`flex items-start justify-between gap-3 border p-3.5 text-xs font-mono ${config}`}
    >
      <div className="leading-relaxed">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-stone-400 hover:text-white transition-colors p-0.5"
          aria-label="إغلاق التنبيه"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "تأكيد الحذف",
  cancelLabel = "إلغاء",
  danger = true,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md border border-stone-700 bg-stone-950 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-red-400 block mb-1">
          CONFIRMATION REQUIRED
        </span>
        <h3 className="text-base font-bold text-paper">{title}</h3>
        <p className="mt-2 text-xs text-stone-400 leading-relaxed font-light">{message}</p>
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? "danger" : "gold"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
