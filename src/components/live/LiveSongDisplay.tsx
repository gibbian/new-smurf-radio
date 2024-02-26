import Image from "next/image";
import { api } from "~/trpc/react";
import { cn } from "~/utils";

interface LiveSongDisplayProps {
  showId: string;
}
export const LiveSongDisplay = ({ showId }: LiveSongDisplayProps) => {
  const { data } = api.live.getCurrentlyPlayingSong.useQuery(
    {
      showId: showId,
    },
    {
      refetchInterval: 5000,
    },
  );
  if (!data) {
    return <div></div>;
  }
  return (
    <div
      onClick={() => {
        if (data.externalUrl) {
          window.open(data.externalUrl, "_blank");
        }
      }}
      className={cn(
        "mt-4 flex w-full items-center gap-2 border-none border-border bg-card-bg p-2 md:mt-0 md:w-auto md:items-end md:border md:bg-transparent md:p-0",
        data.externalUrl && "cursor-pointer",
      )}
    >
      {data.albumArt && (
        <Image
          className="h-12 w-12 cursor-pointer sm:h-[140px] sm:w-[140px] xl:h-[190px] xl:w-[190px]"
          alt="Album art"
          width={160}
          height={160}
          src={data.albumArt}
        ></Image>
      )}
      <div>
        <div className="font-semibold md:text-[21px]">{data.title}</div>
        <div className="opacity-70 md:text-[18px]">{data.artist}</div>
      </div>
    </div>
  );
};
