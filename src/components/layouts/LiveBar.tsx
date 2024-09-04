"use client";

import { api } from "~/trpc/react";
import { LiveIndicator } from "../small/LiveIndicator";
import { lightFormat } from "date-fns";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const LiveBar = () => {
  const pathname = usePathname();
  const { data: possibleLive, status } = api.shows.getLiveShow.useQuery(
    undefined,
    { refetchInterval: 30_000 },
  );

  if (status != "success") {
    return null;
  }

  if (!possibleLive) {
    return null;
  }

  if (pathname === "/live") {
    return null;
  }

  return (
    <Link href="/live">
      <div className="flex items-center justify-between gap-7 border-b border-[#939393] bg-[#111830]  px-6 py-[7px] md:justify-start md:px-36 ">
        <LiveIndicator />
        <div className="flex items-center gap-4">
          <div className="text-[14px]">{possibleLive?.djName}</div>
          <div className="text-[14px] font-normal">
            {lightFormat(possibleLive?.startTime, "ha")} -{" "}
            {lightFormat(possibleLive?.endTime, "ha")}
          </div>
        </div>
      </div>
    </Link>
  );
};
