import Link from "next/link";
import { type ReactNode } from "react";
import { HomepageOffline } from "~/components/OfflineBox";
import { ShowInfo } from "~/components/ShowInfo";
import { HomepageScheduleShow } from "~/components/views/ScheduleShow";
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
  const schedule = await api.shows.getSchedule.query();

  return (
    <div className="grid gap-8 px-8 pt-4 md:grid-cols-[1fr_300px]">
      <main>
        {liveNow ? (
          <>
            <HomepageHeader>Live Now</HomepageHeader>
            <Link href="/live">
              <ShowInfo show={liveNow} />
            </Link>
            <div className="mb-8"></div>
          </>
        ) : (
          <HomepageOffline />
        )}

        <HomepageHeader>Announcements</HomepageHeader>
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
      <div>
        <HomepageHeader>Schedule</HomepageHeader>
        <HomepageScheduleShow shows={schedule} />
      </div>
    </div>
  );
}
