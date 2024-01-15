import { and, gt, lt } from "drizzle-orm";
import { shows } from "../db/schema";
import { createTRPCRouter, publicProcedure } from "./trpc";

export const liveRouter = createTRPCRouter({
  getLivePayload: publicProcedure.query(async ({ ctx }) => {
    const payload = await ctx.db
      .select()
      .from(shows)
      .where(
        and(lt(shows.startTime, new Date()), gt(shows.endTime, new Date())),
      )
      .then((shows) => shows.at(0));

    if (!payload) {
      return null;
    }
    return payload;
  }),
});
