import { LiveView } from "~/components/views/LiveView";
import OfflineView from "~/components/views/OfflineView";
import { api } from "~/trpc/server";

export default async function Page() {
  const payload = await api.live.getLivePayload.query();

  if (!payload) {
    return <OfflineView />;
  }

  return <LiveView payload={payload} />;
}
