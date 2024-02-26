import { z } from "zod";
import { createTRPCRouter, djProcedure } from "./trpc";
import { mapSpotifyToDb } from "../spotify";

export const spotifyRouter = createTRPCRouter({
  searchSongs: djProcedure
    .input(
      z.object({
        query: z.string(),
        limit: z.number().min(1).max(50).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.spotify.search(
        input.query,
        ["track"],
        "US",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        input.limit as any,
      );
      const mappedResults = results.tracks.items.map((t) => mapSpotifyToDb(t));
      return mappedResults;
    }),
});
