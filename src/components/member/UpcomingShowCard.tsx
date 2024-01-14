import { format } from "date-fns";
import { type InferSelectModel } from "drizzle-orm";
import { type shows } from "~/server/db/schema";
import { Card } from "../Card";
import { GenreList } from "../small/GenreList";

interface UpcomingShowCardProps {
  show: InferSelectModel<typeof shows>;
}
export const UpcomingShowCard = ({ show }: UpcomingShowCardProps) => {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex justify-between">
        <div className="text-[16px] font-semibold">
          {format(show.startTime, "EEEE, MMM d")}
        </div>
        <div>Published</div>
      </div>
      {show.title && (
        <div className="text-[16px] font-semibold">{show.title}</div>
      )}
      {show.description && (
        <div className="text-[12px] text-white/70">{show.description}</div>
      )}
      <GenreList genres={show.genres}></GenreList>
    </Card>
  );
};
