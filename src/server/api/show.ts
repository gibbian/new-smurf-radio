import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "./trpc";
import { shows } from "../db/schema";
import { eq } from "drizzle-orm";

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
});
