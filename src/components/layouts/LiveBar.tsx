"use client";

import { api } from "~/trpc/react";
import { LiveIndicator } from "../small/LiveIndicator";
import { lightFormat } from "date-fns";

export const LiveBar = () => {
  const { data: possibleLive, status } = api.shows.getLiveShow.useQuery(
    undefined,
    { refetchInterval: 5000, enabled: false },
  );

  if (status != "success") {
    return null;
  }

  if (!possibleLive) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-7 border-b border-[#939393] bg-bg px-6 py-[7px] md:justify-start ">
      <LiveIndicator />
      <div className="flex items-center gap-4">
        <div className="text-[14px] font-bold">{possibleLive?.djName}</div>
        <div className="text-[14px] font-normal">
          {lightFormat(possibleLive?.startTime, "ha")} -{" "}
          {lightFormat(possibleLive?.endTime, "ha")}
        </div>
      </div>
    </div>
  );
};
