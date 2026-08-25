import Link from "next/link";
import { clsx } from "clsx";
import type { ReactNode } from "react";

interface GoldButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

export default function GoldButton({
  href,
  onClick,
  children,
  variant = "solid",
  size = "md",
  className,
  type = "button",
  disabled,
}: GoldButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-label text-xs tracking-[0.15em] uppercase transition-all duration-300 focus-visible:outline-champagne disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    solid: "bg-gold-gradient text-ink shadow-gold hover:shadow-gold-lg hover:-translate-y-0.5",
    outline: "border border-champagne/60 text-champagne hover:bg-champagne/10 hover:border-champagne",
    ghost: "text-champagne hover:bg-champagne/10",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-sm",
  };

  const classes = clsx(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {children}
    </button>
  );
}
