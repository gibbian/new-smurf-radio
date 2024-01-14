"use client";
import { cva } from "class-variance-authority";
import { format } from "date-fns";
import { type InferSelectModel } from "drizzle-orm";
import { type shows } from "~/server/db/schema";

interface ShowInfoProps {
  show: InferSelectModel<typeof shows>;
  fillBg?: boolean;
  variant?: "full" | "compact";
  showDate?: boolean;
}

export const ShowInfo = ({ show, fillBg, variant }: ShowInfoProps) => {
  const outer = cva("border flex-col flex gap-4 border-border p-4", {
    variants: {
      variant: {
        full: "",
        compact: "",
      },
      fillBg: {
        true: "bg-card-bg",
        false: "bg-transparent",
      },
    },

    defaultVariants: {
      variant: "full",
      fillBg: true,
    },
  });

  return (
    <div className={outer({ fillBg, variant })}>
      <div className="flex w-full items-baseline justify-between">
        <div className="text-[16px] font-bold">{show.djName}</div>
        <div className="text-[14px]">
          {format(show.startTime, "haa")} - {format(show.endTime, "haa")}
        </div>
      </div>
      {show.title && <div className="text-lg">{show.title}</div>}
    </div>
  );
};
