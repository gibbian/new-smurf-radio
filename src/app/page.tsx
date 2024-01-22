import { format } from "date-fns";
import { type ReactNode } from "react";
import { ShowInfo } from "~/components/ShowInfo";
import { SlimShowInfo } from "~/components/SlimShowInfo";
import { api } from "~/trpc/server";
import { cn } from "~/utils";

const HomepageHeader = ({
  children,
  classname,
}: {
  children: ReactNode;
  classname?: string;
}) => {
  return (
    <div className={cn("text-[22px] font-bold", classname)}>{children}</div>
  );
};

export default async function Home() {
  const liveNow = await api.shows.getLiveShow.query();

  return (
    <div className="grid gap-8 px-8 pt-4 md:grid-cols-[1fr_300px]">
      <main className="">
        {liveNow && (
          <>
            <HomepageHeader>Live Now</HomepageHeader>
            <ShowInfo show={liveNow} />
          </>
        )}

        <HomepageHeader classname="mt-8">Announcements</HomepageHeader>
        <div>Mandatory Meeting: 6pm, Jan. 22</div>

        <HomepageHeader classname="mt-8">About Us</HomepageHeader>
        <div>
          Student Managed University Radio Frequency is SMU’s college radio
          program! We were officiated in April of 2023. This program is open to
          all music and/or radio enthusiasts, and we strive to provide a
          community for people across all majors. Music brings everyone together
          and we are proud to further that connection on campus. In the past,
          due to the monetary and technological restrictions of traditional
          radio broadcasting, SMU’s radio station was discontinued. However,
          S.M.U.R.F. has resuscitated the radio, with a modern twist, allowing
          for remote, online, broadcasting and listening. Now, members can
          broadcast from the comfort of their home, and listeners can tune in
          anywhere, anytime. This allows for a broader reach, equipped to keep
          up with modern technological advances. If you love radio and want to
          be a part of this organization, contact us! If you want to listen,
          click the banner!
        </div>
      </main>
      <HomepageSidebar />
    </div>
  );
}

const HomepageSidebar = async () => {
  const shows = await api.shows.getSchedule.query();

  // Group shows by startDate
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
    <main>
      <HomepageHeader classname="mb-2">Schedule</HomepageHeader>
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
    </main>
  );
};
