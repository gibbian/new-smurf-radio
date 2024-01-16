"use client";

import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { api } from "~/trpc/react";
import { Card } from "./Card";

export const Player = () => {
  const { data } = api.mixlr.getCurrentShowAudio.useQuery();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  return (
    <Card>
      {!isPlaying ? (
        <div
          onClick={async () => {
            if (audioRef.current?.src) {
              await audioRef.current?.play();
            }
          }}
        >
          <FontAwesomeIcon size="lg" icon={faPlay} />
        </div>
      ) : (
        <div
          onClick={async () => {
            if (audioRef.current?.src) {
              audioRef.current?.pause();
            }
          }}
        >
          <FontAwesomeIcon size="lg" icon={faPause} />
        </div>
      )}
      <audio
        onPlay={() => {
          setIsPlaying(true);
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
        ref={audioRef}
        className="hidden"
        controls
        autoPlay
        src={data ?? undefined}
      ></audio>
    </Card>
  );
};
