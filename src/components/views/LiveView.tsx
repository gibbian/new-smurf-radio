"use client";

import { type RouterOutputs } from "~/trpc/shared";
import { ShowInfo } from "../ShowInfo";
import { SlimShowInfo } from "../SlimShowInfo";
import { Player } from "../Player";
import { Chat } from "../chat/Chat";

interface LiveViewProps {
  payload: NonNullable<RouterOutputs["live"]["getLivePayload"]>;
}

export const LiveView = ({ payload }: LiveViewProps) => {
  // return (
  //   <div className="flex h-full max-h-full flex-1 flex-col overflow-y-scroll bg-purple-300">
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //     <div>Test</div>
  //   </div>
  // );
  return (
    <div className="flex h-full max-h-full flex-1 flex-row overflow-y-scroll bg-purple-300">
      <div className="flex-grow">
        <ShowInfo show={payload.currentShow}></ShowInfo>
        {payload.nextShows.length > 0 && <div>Next Up...</div>}
        {payload.nextShows.map((show) => (
          <SlimShowInfo key={show.id} show={show} />
        ))}
        <Player />
      </div>
      <Chat showId={payload.currentShow.id} />
    </div>
  );
};
