import { format, getDayOfYear } from "date-fns";
import { ShowInfo } from "~/components/ShowInfo";
import { api } from "~/trpc/server";

export default async function Page() {
  const shows = await api.shows.getSchedule.query();

  console.log(shows);

  // Group shows by startDate
  const groupedShows = shows.reduce(
    // TODO: Refactor for new years
    (acc, show) => {
      const key = getDayOfYear(show.startTime);
      if (!acc[key]) {
        acc[key] = [];
      }
      if (acc[key]) {
        // @ts-expect-error Will always be there
        acc[key].push(show);
      }
      return acc;
    },
    {} as Record<string, typeof shows>,
  );

  return (
    <div>
      <div>
        {Object.entries(groupedShows).map(([key, shows]) => (
          <div key={key}>
            <div className="text-[15px] font-medium">
              {format(shows[0]!.startTime, "EEEE, LLL d")}
            </div>
            <div>
              {shows.map((show) => (
                <ShowInfo show={show}></ShowInfo>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
