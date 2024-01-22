import { ScheduleShow } from "~/components/views/ScheduleShow";
import { api } from "~/trpc/server";

export default async function Page() {
  const shows = await api.shows.getSchedule.query();

  return <ScheduleShow shows={shows}></ScheduleShow>;
}
