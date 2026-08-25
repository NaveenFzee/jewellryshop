import { clsx } from "clsx";
import type { ReactNode } from "react";

export default function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx("glass-card", className)}>{children}</div>;
}
