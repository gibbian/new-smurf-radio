"use client";

import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { supabase } from "~/supabase";

interface PresenceProps {
  showId: string;
}

export const AdminPresence = (props: PresenceProps) => {
  const [viewers, setViewers] = useState<string[]>([]);
  const subscribed = useRef(false);

  const room = useRef(
    supabase.channel(props.showId, {
      config: {
        presence: { key: nanoid(5) },
      },
    }),
  );

  useEffect(() => {
    if (room.current !== null && !subscribed.current) {
      room.current
        .on("presence", { event: "sync" }, () => {
          const newState = room.current.presenceState();
          console.log("NEWSTATE", newState);
          if (room.current.presenceState()) {
            setViewers(
              Object.keys(room.current.presenceState()).map((s) => {
                if (s.length == 6) {
                  return s;
                } else {
                  return s.slice(6);
                }
              }) || [],
            );
          }
        })
        .subscribe();
      subscribed.current = true;
    }
  }, [room]);

  return (
    <div>
      <div>Listeners:</div>
      {viewers.map((viewer) => (
        <div key={viewer}>{viewer}</div>
      ))}
    </div>
  );
};
