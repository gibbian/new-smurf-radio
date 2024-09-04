import { api } from "~/trpc/server";
import { Card } from "./Card";
import { ClientRenderTime } from "./ClientRenderTime";

export const HomepageOffline = async () => {
  const nextShow = await api.shows.getNextShow.query();
  return (
    <Card className="mb-6 grid place-items-center bg-[#191919] text-text/80">
      <div className="mb-2">SMURF is currently offline.</div>
      {nextShow && (
        <>
          <div>Next Show:</div>
          <div className="text-[18px]">
            {nextShow?.djName} at{" "}
            <ClientRenderTime
              time={nextShow?.startTime}
              formatString="haa LLL. d"
            />
          </div>
        </>
      )}
    </Card>
  );
};
