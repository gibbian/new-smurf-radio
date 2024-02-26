import { type InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { type songs } from "~/server/db/schema";

export type DbSong = InferSelectModel<typeof songs>;

export const dbSongSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string().nullable(),
  album: z.string(),
  albumArt: z.string().nullable(),
  albumId: z.string().nullable(),
  artistId: z.string().nullable(),
  duration: z.bigint().nullable(),
  explicit: z.boolean(),
  externalUrl: z.string().nullable(),
  popularity: z.number().nullable(),
  previewUrl: z.string().nullable(),
});
