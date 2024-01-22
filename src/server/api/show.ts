import { and, eq, gt, lt, sql } from "drizzle-orm";
import { z } from "zod";
import { shows } from "../db/schema";
import { getCurrentShow } from "../helpers/shows";
import { createTRPCRouter, publicProcedure } from "./trpc";
import { addDays } from "date-fns";

// NOTE: will maybe use in the future
// const showWithNameCol = () => {
//   return {
//     ...getTableColumns(shows),
//     djName: djs.name,
//   };
// };

export const showRouter = createTRPCRouter({
  getShow: publicProcedure
    .input(z.object({ showId: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(shows)
        .where(eq(shows.id, input.showId))
        .limit(1)
        .then((r) => r.at(0));

      if (!result) {
        throw new Error("No show found");
      }

      return result;
    }),

  getLiveShow: publicProcedure.query(async () => {
    return await getCurrentShow();
  }),

  getSchedule: publicProcedure.query(async ({ ctx }) => {
    const now = new Date();
    // Set timezone to cst
    now.setHours(now.getHours() - 5);
    let oneWeekFromNow = new Date();
    oneWeekFromNow = addDays(oneWeekFromNow, 10);
    const result = await ctx.db
      .select()
      .from(shows)
      .where(and(gt(shows.startTime, now), lt(shows.startTime, oneWeekFromNow)))
      .orderBy(shows.startTime);
    return result;
  }),

  getNextShow: publicProcedure.query(async ({ ctx }) => {
    const nextShow = await ctx.db
      .select()
      .from(shows)
      .where(gt(shows.startTime, new Date()))
      .orderBy(shows.startTime)
      .limit(4);
    console.log(nextShow);
    return nextShow[0];
  }),

  nextShowsForToday: publicProcedure.query(async ({ ctx }) => {
    const tomorrowMorning = new Date();
    tomorrowMorning.setHours(0, 0, 0, 0);
    addDays(tomorrowMorning, 1);
    const result = await ctx.db
      .select()
      .from(shows)
      .where(
        and(
          gt(shows.startTime, new Date()),
          gt(shows.endTime, new Date()),
          lt(shows.startTime, tomorrowMorning),
        ),
      )
      .orderBy(shows.startTime)
      .limit(3);

    return result;
  }),
});
