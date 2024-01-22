import { type InferSelectModel } from "drizzle-orm";
import { type shows } from "~/server/db/schema";
import { Card } from "../Card";
import { ClientRenderTime } from "../ClientRenderTime";
import { GenreList } from "../small/GenreList";

interface UpcomingShowCardProps {
  show: InferSelectModel<typeof shows>;
}
export const UpcomingShowCard = ({ show }: UpcomingShowCardProps) => {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex justify-between">
        <div className="text-[16px] font-semibold">
          <ClientRenderTime time={show.startTime} formatString="EEEE, MMM d" />
        </div>
        <div>Published</div>
      </div>
      {show.title && (
        <div className="text-[16px] font-semibold">{show.title}</div>
      )}
      {show.description && (
        <div className="text-[12px] text-text/70">{show.description}</div>
      )}
      <GenreList genres={show.genres}></GenreList>
    </Card>
  );
};
