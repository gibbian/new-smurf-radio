"use client";

import { useViewportSize } from "@mantine/hooks";
import { type RouterOutputs } from "~/trpc/shared";
import { Player } from "../Player";
import { ShowInfo } from "../ShowInfo";
import { SlimShowInfo } from "../SlimShowInfo";

import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "../Card";
import { Chat } from "../chat/Chat";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { useSession } from "next-auth/react";
import { BottomLiveView } from "../live/BottomLiveView";

interface LiveViewProps {
  payload: NonNullable<RouterOutputs["live"]["getLivePayload"]>;
}

export const LiveView = ({ payload }: LiveViewProps) => {
  const { width } = useViewportSize();
  const session = useSession();

  const ChatComponent = (
    <>
      <Card className="flex flex-col justify-between gap-3 max-sm:hidden md:min-w-[350px] md:max-w-[350px]">
        <Chat showId={payload.currentShow.id} />
      </Card>
      <Drawer preventScrollRestoration>
        {width < 700 && (
          <DrawerTrigger>
            <div className="fixed bottom-0 flex w-screen items-center justify-center gap-4 rounded-t-2xl border border-border border-b-transparent bg-card-bg py-2 text-sm focus:ring-transparent sm:hidden">
              <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
              Open Chat
            </div>
          </DrawerTrigger>
        )}
        <DrawerContent>
          <div className="flex flex-col gap-3">
            <Chat showId={payload.currentShow.id} />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );

  return (
    <div className="flex max-h-full flex-1 flex-col gap-6 overflow-y-auto sm:flex-row md:h-full">
      <div className="LEFT flex-grow p-[1px] md:flex md:flex-col md:justify-between">
        <div className="TOP ">
          <ShowInfo
            extraElements={
              <Player title={"SMURF Radio - " + payload.currentShow.djName} />
            }
            show={payload.currentShow}
          ></ShowInfo>
          {payload.nextShows.length > 0 && (
            <div className="my-4 text-center text-xs text-text/50">
              Next Up...
            </div>
          )}
          <div className="flex flex-col gap-2">
            {payload.nextShows.map((show) => (
              <SlimShowInfo key={show.id} show={show} />
            ))}
          </div>
        </div>
        {/* <Player title={"SMURF Radio - " + payload.currentShow.djName} /> */}
        <BottomLiveView
          isHost={payload.currentShow.djId === session.data?.user.djId}
          showId={payload.currentShow.id}
        />
      </div>
      {ChatComponent}
    </div>
  );
};
