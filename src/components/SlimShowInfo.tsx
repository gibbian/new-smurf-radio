"use client";
import { cva } from "class-variance-authority";
import { format } from "date-fns";
import { type InferSelectModel } from "drizzle-orm";
import { type shows } from "~/server/db/schema";
import { GenreList } from "./small/GenreList";

interface ShowInfoProps {
  show: InferSelectModel<typeof shows>;
  fillBg?: boolean;
  showDate?: boolean;
}

export const SlimShowInfo = ({ show, fillBg = false }: ShowInfoProps) => {
  const outer = cva("border justify-between flex border-border px-4 p-2", {
    variants: {
      fillBg: {
        true: "bg-card-bg",
        false: "bg-transparent border-2",
      },
    },

    defaultVariants: {
      fillBg: true,
    },
  });

  return (
    <div className={outer({ fillBg })}>
      <div className="flex items-baseline gap-4">
        <div>{show.djName}</div>
        <div className="text-[12px] text-white/70">{show.title}</div>
      </div>
      <div className="text-[14px]">
        {format(show.startTime, "haa")} - {format(show.endTime, "haa")}
      </div>
    </div>
  );
};
