import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface QuickControlCardProps {
  title?: string;
  description?: string;
  className?: string;
  children: ReactNode;
}
export const QuickControlCard = async ({
  children,
  title,
  description,
  className,
}: QuickControlCardProps) => {
  return (
    <div className={twMerge("border border-border bg-card-bg p-4", className)}>
      {title && <div className="text-lg">{title}</div>}
      {description && <div className="text-sm text-text/75">{description}</div>}
      {title && description ? <div className="p-2"></div> : null}
      {children}
    </div>
  );
};
