/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from "react";

import { cn } from "src/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "bg-input-bg file:bg-transparent focus:border-white/40 dark:border-neutral-800 flex h-10 w-full border border-border px-3 py-2 text-sm ring-offset-bg file:border-0 file:text-sm file:font-medium placeholder:text-border focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
