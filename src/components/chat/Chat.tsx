"use client";

import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nanoid } from "nanoid";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { type z } from "zod";
import { chatMessageSchema } from "~/shared/schemas/chatMessage";
import { supabase } from "~/supabase";
import { api } from "~/trpc/react";
import { timeSince } from "~/utils/time";
import { MessageSendBar } from "./MessageSendBar";

interface ChatProps {
  showId: string;
}

export const Chat = ({ showId }: ChatProps) => {
  const utils = api.useUtils();
  const { data: session, status: userStatus } = useSession();
  const { data: messages } = api.chat.getInitialMessages.useQuery({
    showId,
  });

  const [viewerCount, setViewerCount] = useState(0);

  const msgContainer = useRef<HTMLDivElement>(null);

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
  const room = useRef(
    supabase.channel(showId, {
      config: {
        presence: { key: nanoid(5) },
      },
    }),
  );

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
        .on("presence", { event: "sync" }, () => {
          const newState = room.current.presenceState();
          setViewerCount(Object.keys(newState).length);
          console.log("NEWSTATE", newState);
        })
        .subscribe();
      void room.current.track({ imhere: true });
      subscribed.current = true;
    }
  }, [room]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessagesMutation = api.chat.sendMessage.useMutation({
    onSettled() {
      cancelFetch();
      console.log("done");
      scrollToBottom();
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
      scrollToBottom();
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

  const scrollToBottom = () => {
    console.log("Bottom");
    if (msgContainer.current) {
      msgContainer.current.scrollTop = msgContainer.current.scrollHeight;
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="text-xl font-bold">Chat</div>
        <div className="flex items-center gap-2 text-gray-500">
          <FontAwesomeIcon
            size="xs"
            color="gray"
            icon={faUser}
          ></FontAwesomeIcon>
          {viewerCount}
        </div>
      </div>
      <div
        style={{
          overflowAnchor: "auto",
        }}
        ref={msgContainer}
        className="hide-scrollbar flex flex-grow flex-col justify-self-start overflow-y-auto max-sm:max-h-[60vh]"
      >
        {messages?.map((msg) => <Message message={msg} key={msg.id}></Message>)}
        {messages?.length === 0 && (
          <div className="text-center text-sm text-white/40">
            No Messages Yet
          </div>
        )}
      </div>
      {userStatus == "unauthenticated" && (
        <div
          onClick={() => {
            void signIn("google");
          }}
          className="cursor-pointer pb-4 text-center text-sm text-white/60"
        >
          Sign in with Google to chat...
        </div>
      )}
      {userStatus == "authenticated" && (
        <MessageSendBar onMessage={handleSendMessage} />
      )}
    </>
  );
};

interface MessageProps {
  message: z.infer<typeof chatMessageSchema>;
}

export const Message = ({ message }: MessageProps) => {
  return (
    <div className="my-2">
      <div className="flex justify-between text-xs">
        <div className="text-white/80">{message.userName}</div>
        <div className="text-white/50">{timeSince(message.timestamp)}</div>
      </div>
      <div className="text-wrap text-[14px]">{message.message}</div>
    </div>
  );
};
