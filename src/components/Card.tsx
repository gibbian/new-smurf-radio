import { type ReactNode } from "react";
import { cn } from "~/utils";

export const Card = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("border border-border bg-card-bg p-4", className)}>
      {children}
    </div>
  );
};
