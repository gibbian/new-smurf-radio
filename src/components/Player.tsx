"use client";

import { type IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faPlay,
  faVolumeHigh,
  faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ReactNode, useRef, useState } from "react";
import { api } from "~/trpc/react";
import { OfflineStreamIndicator } from "./OfflineSteamIndicator";

interface PlayerProps {
  title?: string;
}

export const Player = ({ title }: PlayerProps) => {
  const { data, refetch } = api.mixlr.getCurrentShowAudio.useQuery(
    undefined,
    {},
  );

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const play = () => {
    if (audioRef.current) {
      if (audioRef.current.muted) {
        setMuted(false);
      }
      void audioRef.current.play();
    }
  };

  const mute = () => {
    if (audioRef.current) {
      if (!audioRef.current.muted) {
        setMuted(true);
      }
    }
  };

  if (!data) {
    return (
      <div>
        <OfflineStreamIndicator refetch={refetch} />
      </div>
    );
  }

  let icon: ReactNode = null;

  if (!playing) {
    icon = <IconContainer onClick={play} icon={faPlay}></IconContainer>;
  } else if (muted) {
    icon = <IconContainer onClick={play} icon={faVolumeXmark}></IconContainer>;
  } else {
    icon = <IconContainer onClick={mute} icon={faVolumeHigh}></IconContainer>;
  }

  return (
    <div className="flex justify-end">
      {icon}
      <audio
        title={title}
        ref={audioRef}
        // className="hidden"
        onPlay={() => {
          setPlaying(true);
        }}
        onPlaying={() => {
          setPlaying(true);
        }}
        onPause={(e) => {
          e.preventDefault();
          if (audioRef.current) {
            setMuted(true);
            void audioRef.current.play();
          }
        }}
        muted={muted}
        autoPlay
        src={data ?? undefined}
      />
    </div>
  );
};

interface IconContainerProps {
  icon: IconProp;
  onClick: () => void;
}
const IconContainer = ({ icon, onClick }: IconContainerProps) => {
  return (
    <div className="cursor-pointer p-4" onClick={onClick}>
      <FontAwesomeIcon color="#bbb" size="lg" icon={icon}></FontAwesomeIcon>
    </div>
  );
};
