"use client";

import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { chatMessageSchema } from "~/shared/schemas/chatMessage";
import { supabase } from "~/supabase";
import { api } from "~/trpc/react";
import { Card } from "../Card";
import { MessageSendBar } from "./MessageSendBar";
import { type z } from "zod";

interface ChatProps {
  showId: string;
}

export const Chat = ({ showId }: ChatProps) => {
  const utils = api.useUtils();
  const { data: session, status: userStatus } = useSession();
  const { data: messages } = api.chat.getInitialMessages.useQuery({
    showId,
  });

  const cancelFetch = () => {
    utils.chat.getInitialMessages
      .cancel()
      .then((r) => r)
      .catch((e) => {
        console.log(e);
      });
  };

  // Fix dev mode
  const subscribed = useRef(false);

  // TODO: add presence
  const room = useRef(supabase.channel("show-" + showId));

  useEffect(() => {
    if (room.current !== null && !subscribed.current) {
      room.current
        .on("broadcast", { event: "message" }, (data) => {
          cancelFetch();
          const parsed = chatMessageSchema.parse(data.payload);
          utils.chat.getInitialMessages.setData({ showId }, (old) => {
            if (!old) {
              return [parsed];
            }
            return [...old, parsed];
          });
        })
        .subscribe();
      subscribed.current = true;
    }
  }, []);

  const addMessagesMutation = api.chat.sendMessage.useMutation({
    onSettled() {
      cancelFetch();
      console.log("done");
    },
    async onMutate(variables) {
      cancelFetch();
      await room.current.send({
        event: "message",
        type: "broadcast",
        payload: variables,
      });
      utils.chat.getInitialMessages.setData({ showId }, (old) => {
        if (!old) {
          return [variables];
        }
        return [...old, variables];
      });
    },
  });

  const handleSendMessage = (msg: string) => {
    cancelFetch();
    if (!session?.user.name) {
      return;
    }
    addMessagesMutation.mutate({
      showId: showId,
      id: "msg-" + nanoid(5),
      message: msg,
      timestamp: new Date(),
      userId: session.user.id,
      userName: session.user.name,
    });
  };

  return (
    <Card className="flex flex-col justify-between gap-3">
      <div className="text-xl font-bold">Chat</div>
      <div className="debug flex flex-grow flex-col gap-2 justify-self-start overflow-y-scroll">
        {messages
          ?.reverse()
          ?.map((msg) => <Message message={msg} key={msg.id}></Message>)}
      </div>
      {userStatus == "unauthenticated" && <div>Log in to send messages</div>}
      {userStatus == "authenticated" && (
        <MessageSendBar onMessage={handleSendMessage} />
      )}
    </Card>
  );
};

interface MessageProps {
  message: z.infer<typeof chatMessageSchema>;
}

export const Message = ({ message }: MessageProps) => {
  return (
    <Card>
      <div className="py-3">{message.message}</div>
    </Card>
  );
};
