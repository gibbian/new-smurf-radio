import { and, gt, lt } from "drizzle-orm";
import { shows } from "../db/schema";
import { createTRPCRouter, publicProcedure } from "./trpc";
import { addDays } from "date-fns";

export const liveRouter = createTRPCRouter({
  getLivePayload: publicProcedure.query(async ({ ctx }) => {
    const currentShow = await ctx.db
      .select()
      .from(shows)
      .where(
        and(lt(shows.startTime, new Date()), gt(shows.endTime, new Date())),
      )
      .then((shows) => shows.at(0));

    let tomorrowMorning = new Date();
    tomorrowMorning.setHours(0, 0, 0, 0);
    tomorrowMorning = addDays(tomorrowMorning, 1);

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
});
