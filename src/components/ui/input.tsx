/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from "react";

import { cn } from "src/utils";
import { Label } from "./label";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div>
        {props.label && <Label>{props.label}</Label>}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full border border-border bg-input-bg px-3 py-2 text-sm ring-offset-bg file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/70 focus:border-white/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
