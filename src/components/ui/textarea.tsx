import * as React from "react";

import { cn } from "src/utils";
import { Label } from "./label";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <div>
        {props.label && <Label>{props.label}</Label>}
        <textarea
          className={cn(
            "flex min-h-[80px] w-full border border-border bg-input-bg px-3 py-2 text-sm ring-offset-bg placeholder:text-text/70 focus:border-white/40 focus-visible:outline-none focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
