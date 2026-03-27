import React from "react";

type Variant = "primary" | "secondary" | "ghost";

export function Card({
    title,
    subtitle,
    right,
    children
}: {
    title?: string;
    subtitle?: string;
    right?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
            {(title || subtitle || right) && (
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
                    <div>
                        {title && <h2 className="text-[15px] font-semibold text-slate-900">{title}</h2>}
                        {subtitle && <p className="mt-0.5 text-sm text-slate-600">{subtitle}</p>}
                    </div>
                    {right}
                </div>
            )}
            <div className="p-4">{children}</div>
        </section>
    );
}

export function Button({
    variant = "primary",
    className = "",
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
    const base =
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold " +
        "transition active:translate-y-[0.5px] disabled:cursor-not-allowed disabled:opacity-50 " +
        "focus:outline-none focus:ring-4 focus:ring-slate-200";

    const styles: Record<Variant, string> = {
        primary: "bg-slate-900 text-white hover:bg-slate-800",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200",
        ghost: "bg-transparent text-slate-900 hover:bg-slate-100"
    };

    return <button {...props} className={`${base} ${styles[variant]} ${className}`} />;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={
                "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 " +
                "outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 " +
                (props.className ?? "")
            }
        />
    );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            {...props}
            className={
                "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 " +
                "outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 " +
                (props.className ?? "")
            }
        />
    );
}

export function Pill({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
    const cls =
        "rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700 hover:bg-slate-100";
    return onClick ? (
        <button className={cls} onClick={onClick}>
            {children}
        </button>
    ) : (
        <span className={cls}>{children}</span>
    );
}

export function MiniHint({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            {children}
        </div>
    );
}

export function Badge({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 " +
        className
      }
    >
      {children}
    </span>
  );
}