import { SpotifyApi, type Track } from "@spotify/web-api-ts-sdk";
import { type InferSelectModel } from "drizzle-orm";
import { env } from "~/env";
import { type songs } from "./db/schema";

export const spotify = SpotifyApi.withClientCredentials(
  env.SPOTIFY_CLIENT_ID,
  env.SPOTIFY_CLIENT_SECRET,
);

export const mapSpotifyToDb = (track: Track) => {
  return {
    album: track.album?.name,
    albumArt: track.album.images.at(0)?.url ?? null,
    albumId: track.album.id,
    id: track.id,
    artist: track.artists.at(0)?.name ?? null,
    artistId: track.artists?.at(0)?.id ?? null,
    duration: BigInt(track.duration_ms),
    explicit: track.explicit || false,
    externalUrl: track.external_urls.spotify,
    popularity: track.popularity,
    previewUrl: track.preview_url,
    title: track?.name,
  };
};
