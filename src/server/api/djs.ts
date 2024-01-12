import { eq } from "drizzle-orm";
import { z } from "zod";
import { djs } from "../db/schema";
import { createTRPCRouter, publicProcedure } from "./trpc";

export const djRouter = createTRPCRouter({
  getDjDetails: publicProcedure
    .input(
      z.object({
        djId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.djs.findFirst({
        where: eq(djs.id, input.djId),
        with: { shows: true, user: true, slot: true },
      });

      return result;
    }),
});
