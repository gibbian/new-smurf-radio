import { HomepageOffline } from "~/components/OfflineBox";
import { LiveView } from "~/components/views/LiveView";
import { api } from "~/trpc/server";

export default async function Page() {
  const payload = await api.live.getLivePayload.query();

  if (!payload) {
    return (
      <div className="mx-auto mt-8 max-w-[400px]">
        <HomepageOffline />
      </div>
    );
  }

  return <LiveView payload={payload} />;
}
