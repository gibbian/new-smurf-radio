import { format } from "date-fns";
import { ShowInfo } from "~/components/ShowInfo";
import { api } from "~/trpc/server";

export default async function Page() {
  const shows = await api.shows.getSchedule.query();

  // Group shows by startDate
  const groupedShows = shows.reduce(
    (acc, show) => {
      const key = format(show.startTime, "yds");
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
    <main>
      <div className="mb-4 text-lg font-semibold">Schedule</div>
      <div className="m-auto flex max-w-[600px] flex-col gap-8">
        {Object.entries(groupedShows).map(([key, shows]) => (
          <div key={key}>
            <div className="mb-1 text-[20px] font-semibold">
              {format(shows[0]!.startTime, "EEEE, LLL d")}
            </div>
            <div className="flex flex-col gap-1">
              {shows.map((show) => (
                <ShowInfo
                  key={show.id}
                  fillBg={false}
                  variant="compact"
                  show={show}
                ></ShowInfo>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
