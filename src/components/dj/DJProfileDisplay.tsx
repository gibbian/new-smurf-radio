import { type InferSelectModel } from "drizzle-orm";
import { type djs } from "~/server/db/schema";
import { GenreList } from "../small/GenreList";

interface DJProfileDisplayProps {
  dj: InferSelectModel<typeof djs> & {
    shows: { genres: string[] | null }[];
  };
}

export function DJProfileDisplay({ dj }: DJProfileDisplayProps) {
  const allGenres = dj.shows.flatMap((show) => show.genres || []);
  const uniqueGenres = [...new Set(allGenres)];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{dj.name}</h2>
      </div>

      {dj.bio && (
        <div>
          <h3 className="text-lg font-medium">Bio</h3>
          <p className="mt-1 text-sm">{dj.bio}</p>
        </div>
      )}

      {uniqueGenres.length > 0 && (
        <div>
          <h3 className="text-lg font-medium">Genres</h3>
          <GenreList genres={uniqueGenres} />
        </div>
      )}

      {(dj.instagramLink || dj.twitterLink || dj.spotifyLink) && (
        <div>
          <h3 className="text-lg font-medium">Social Links</h3>
          <div className="mt-2 space-y-2">
            {dj.instagramLink && (
              <a
                href={dj.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 hover:underline"
              >
                Instagram
              </a>
            )}
            {dj.twitterLink && (
              <a
                href={dj.twitterLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 hover:underline"
              >
                Twitter
              </a>
            )}
            {dj.spotifyLink && (
              <a
                href={dj.spotifyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 hover:underline"
              >
                Spotify
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
