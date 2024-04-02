import { api } from "~/trpc/server";
import { AdminPresence } from "./Presence";

export default async function Page() {
  const payload = await api.live.getLivePayload.query();

  if (!payload?.currentShow?.id) {
    return <div>No Live show</div>;
  }

  return <AdminPresence showId={payload.currentShow.id} />;
}
