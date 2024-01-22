"use client";
import { cva } from "class-variance-authority";
import { format } from "date-fns";
import { type InferSelectModel } from "drizzle-orm";
import { type shows } from "~/server/db/schema";
import { GenreList } from "./small/GenreList";
import { LiveIndicator } from "./small/LiveIndicator";
import { cn } from "~/utils";

interface ShowInfoProps {
  show: InferSelectModel<typeof shows>;
  fillBg?: boolean;
  variant?: "full" | "compact";
  showDate?: boolean;
  extraElements?: React.ReactNode;
}

export const ShowInfo = ({
  show,
  fillBg,
  variant = "full",
  extraElements,
}: ShowInfoProps) => {
  const outer = cva("border flex-col flex border-border", {
    variants: {
      variant: {
        full: "gap-3 p-4",
        compact: "gap-1 p-3",
      },
      fillBg: {
        true: "bg-card-bg",
        false: "bg-transparent border-2",
      },
    },

    defaultVariants: {
      variant: "full",
      fillBg: true,
    },
  });

  return (
    <div className={outer({ fillBg, variant })}>
      <div className="flex w-full items-center justify-between gap-8">
        <div className="flex gap-10">
          <div className="text-[16px] font-bold">{show.djName}</div>
          {variant == "compact" && (
            <div className="text-[16px] font-medium text-text/40">
              {show.title}
            </div>
          )}
        </div>
        <div className="flex gap-6 text-[14px]">
          {show.startTime < new Date() && show.endTime > new Date() ? (
            <LiveIndicator />
          ) : (
            <div>
              {format(show.startTime, "haa")} - {format(show.endTime, "haa")}
            </div>
          )}
          {extraElements}
        </div>
      </div>
      {variant == "full" && (
        <div className={cn(!show.title && !show.description && "hidden")}>
          {show.title && <div className="text-lg">{show.title}</div>}
          {show.description && (
            <div className="text-[14px]">{show.description}</div>
          )}
        </div>
      )}
      {variant == "full" ? (
        <GenreList variant="subtle" genres={show.genres} />
      ) : (
        <div className="text-[14px] text-text/80">{show.description}</div>
      )}
    </div>
  );
};
