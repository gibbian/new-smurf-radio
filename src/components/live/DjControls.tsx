import { type DbSong } from "~/types/dbSong";
import { SongSearchInput } from "../SongSearchInput";
import { api } from "~/trpc/react";

interface DjSetCurrentSongProps {
  showId: string;
}
export const DjControls = ({ showId }: DjSetCurrentSongProps) => {
  const { data: liveSong } = api.live.getCurrentlyPlayingSong.useQuery(
    {
      showId: showId,
    },
    {
      refetchInterval: 5000,
    },
  );
  const utils = api.useUtils();
  const setSongMutation = api.live.setCurrentlyPlayingSong.useMutation({
    onSuccess(_, variables, __) {
      utils.live.getCurrentlyPlayingSong.setData({ showId }, variables.song);
    },
  });

  const clearSongMutation = api.live.clearCurrentlyPlayingSong.useMutation({
    onSuccess() {
      utils.live.getCurrentlyPlayingSong.setData({ showId }, null);
    },
  });

  const setNewSong = (song: DbSong) => {
    setSongMutation.mutate({
      showId: showId,
      song: song,
    });
    return;
  };

  return (
    <div className="flex flex-col items-stretch gap-2">
      {liveSong && (
        <button
          onClick={() => {
            clearSongMutation.mutate({ showId });
          }}
          className="border border-border bg-card-bg p-2 text-[12px]"
        >
          Clear
        </button>
      )}
      <SongSearchInput handleSelectSong={setNewSong} />
    </div>
  );
};
