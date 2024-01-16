"use client";

import { type RouterOutputs } from "~/trpc/shared";
import { ShowInfo } from "../ShowInfo";
import { Chat } from "../chat/Chat";
import { SlimShowInfo } from "../SlimShowInfo";
import { Player } from "../Player";

interface LiveViewProps {
  payload: NonNullable<RouterOutputs["live"]["getLivePayload"]>;
}

export const LiveView = ({ payload }: LiveViewProps) => {
  return (
    <>
      <div className="text-center text-red-500">UNDER CONSTRUCTION</div>
      <div className="flex flex-1 grid-cols-[1fr_400px] flex-col gap-6 md:grid">
        <div className="">
          <ShowInfo show={payload.currentShow}></ShowInfo>
          <div>Next Up...</div>
          {payload.nextShows.map((show) => (
            <SlimShowInfo key={show.id} show={show} />
          ))}
          <Player />
        </div>
        <Chat showId={payload.currentShow.id} />
      </div>
    </>
  );
};
