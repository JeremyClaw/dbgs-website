import { ReactNode } from "react";

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  className?: string;
  children: ReactNode;
  disabled?: boolean;
};

const base =
  "text-sm font-bold px-8 py-4 rounded-full text-center transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
const variantClass = {
  primary: "grad-btn text-white",
  secondary:
    "border border-white/20 text-white hover:border-white/50 bg-transparent",
};

export function Button({
  href,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
  children,
  disabled,
}: ButtonProps) {
  const classes = `${base} ${variantClass[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
