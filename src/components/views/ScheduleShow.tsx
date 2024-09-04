"use client";

import { format } from "date-fns";
import { type RouterOutputs } from "~/trpc/shared";
import { ShowInfo } from "../ShowInfo";
import { SlimShowInfo } from "../SlimShowInfo";

interface ScheduleShowProps {
  shows: RouterOutputs["shows"]["getSchedule"];
}
export const ScheduleShow = ({ shows }: ScheduleShowProps) => {
  const groupedShows = shows.reduce(
    (acc, show) => {
      console.log(format(show.startTime, "yd"));
      const key = new Date(show.startTime).toDateString();
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
    <main className="py-9">
      <div className="mb-4 py-4 text-lg md:hidden">Schedule</div>
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
};

export const HomepageScheduleShow = ({ shows }: ScheduleShowProps) => {
  const groupedShows = shows.reduce(
    (acc, show) => {
      console.log(format(show.startTime, "yd"));
      const key = new Date(show.startTime).toDateString();
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
    <div className="m-auto flex max-w-[600px] flex-col gap-8">
      {Object.entries(groupedShows).map(([key, shows]) => (
        <div key={key}>
          <div className="mb-1 text-[14px] font-semibold">
            {format(shows[0]!.startTime, "EEEE, LLL d")}
          </div>
          <div className="flex flex-col gap-1">
            {shows.map((show) => (
              <SlimShowInfo
                key={show.id}
                fillBg={false}
                show={show}
              ></SlimShowInfo>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
