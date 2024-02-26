import { useState } from "react";
import Image from "next/image";
import { api } from "~/trpc/react";
import { type DbSong } from "~/types/dbSong";

interface SongSearchInputProps {
  handleSelectSong: (song: DbSong) => void;
}

// TODO: Debounce
export const SongSearchInput = ({ handleSelectSong }: SongSearchInputProps) => {
  const [query, setQuery] = useState("");
  const { data: songs } = api.spotify.searchSongs.useQuery(
    {
      query,
      limit: 20,
    },
    {
      enabled: query.length > 0,
    },
  );
  return (
    <div className="relative">
      <input
        placeholder="Search songs to display..."
        className="min-w-[220px] border border-border bg-card-bg p-2 text-[12px] text-white placeholder:text-white/60"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="absolute bottom-[38px] left-0 right-0 max-h-[200px] overflow-y-scroll bg-card-bg">
        {songs?.map((song) => (
          <div
            key={song.id}
            className="flex cursor-pointer items-center gap-2 border border-border p-2 hover:bg-card-bg"
            onClick={() => {
              handleSelectSong(song);
              setQuery("");
            }}
          >
            {song.albumArt && (
              <Image
                alt="Album Art"
                width={40}
                height={40}
                src={song.albumArt ?? undefined}
                className="h-10 w-10"
              />
            )}
            <div>
              <div>{song.title}</div>
              <div>{song.artist}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
