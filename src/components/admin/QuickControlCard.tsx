import { type ReactNode } from "react";

interface QuickControlCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
}
export const QuickControlCard = async ({
  children,
  title,
  description,
}: QuickControlCardProps) => {
  return (
    <div className="border border-border bg-card-bg p-4">
      {title && <div className="text-lg">{title}</div>}
      {description && <div className="text-sm text-text/75">{description}</div>}
      {children}
    </div>
  );
};
