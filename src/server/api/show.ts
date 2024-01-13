import { eq, gt } from "drizzle-orm";
import { z } from "zod";
import { shows } from "../db/schema";
import { getCurrentShow } from "../helpers/shows";
import { createTRPCRouter, publicProcedure } from "./trpc";

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
    const result = await ctx.db
      .select()
      .from(shows)
      .where(gt(shows.startTime, now));
    return result;
  }),
});
