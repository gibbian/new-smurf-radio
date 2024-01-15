"use client";

import { type RouterOutputs } from "~/trpc/shared";
import { ShowInfo } from "../ShowInfo";
import { Chat } from "../chat/Chat";

interface LiveViewProps {
  payload: NonNullable<RouterOutputs["live"]["getLivePayload"]>;
}

export const LiveView = ({ payload }: LiveViewProps) => {
  return (
    <div className="grid flex-1 grid-cols-[1fr_400px] gap-6">
      <div className="">
        <ShowInfo show={payload}></ShowInfo>
      </div>
      <Chat />
    </div>
  );
};
