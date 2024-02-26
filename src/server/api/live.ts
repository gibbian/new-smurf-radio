import { addHours } from "date-fns";
import {
  InferSelectModel,
  and,
  eq,
  getTableColumns,
  gt,
  lt,
} from "drizzle-orm";
import { shows, songs } from "../db/schema";
import { createTRPCRouter, djProcedure, publicProcedure } from "./trpc";
import { z } from "zod";
import { dbSongSchema } from "~/types/dbSong";

export const liveRouter = createTRPCRouter({
  getLivePayload: publicProcedure.query(async ({ ctx }) => {
    const currentShow = await ctx.db
      .select()
      .from(shows)
      .where(
        and(lt(shows.startTime, new Date()), gt(shows.endTime, new Date())),
      )
      .then((shows) => shows.at(0));

    // TODO: update with local time
    let tomorrowMorning = new Date();
    tomorrowMorning = addHours(tomorrowMorning, 4);

    console.log({ tomorrowMorning });

    const now = new Date();

    const nextShows = await ctx.db
      .select()
      .from(shows)
      .where(
        and(
          gt(shows.startTime, now),
          gt(shows.endTime, now),
          lt(shows.startTime, tomorrowMorning),
        ),
      )
      .orderBy(shows.startTime);

    console.log({ currentShow, nextShows });

    if (!currentShow) {
      return null;
    }
    return { currentShow, nextShows };
  }),

  setCurrentlyPlayingSong: djProcedure
    .input(
      z.object({
        // Use the db type
        song: dbSongSchema,
        showId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input.song);
      const insertedSong = await ctx.db
        .insert(songs)
        .values(input.song)
        .onConflictDoNothing({
          target: songs.id,
        });

      const result = await ctx.db
        .update(shows)
        .set({
          currentlyPlaying: input.song.id,
        })
        .where(and(eq(shows.id, input.showId)));

      return { result, insertedSong };
    }),

  clearCurrentlyPlayingSong: djProcedure
    .input(z.object({ showId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(shows)
        .set({
          currentlyPlaying: null,
        })
        .where(and(eq(shows.id, input.showId)));

      return { result };
    }),

  getCurrentlyPlayingSong: publicProcedure
    .input(z.object({ showId: z.string() }))
    .query(async ({ ctx, input }) => {
      const currentShow = await ctx.db
        .select({
          song: getTableColumns(songs),
        })
        .from(shows)
        .where(eq(shows.id, input.showId))
        .leftJoin(songs, eq(shows.currentlyPlaying, songs.id))
        .then((shows) => shows.at(0));

      if (!currentShow) {
        return null;
      }

      return currentShow.song;
    }),
});
