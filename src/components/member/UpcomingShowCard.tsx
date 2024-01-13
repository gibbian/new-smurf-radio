import { format } from "date-fns";
import { type InferSelectModel } from "drizzle-orm";
import { type shows } from "~/server/db/schema";
import { Card } from "../Card";

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
      <div className="text-[16px] font-semibold">{show.title}</div>
      <div className="text-[12px] text-white/70">{show.description}</div>
    </Card>
  );
};
