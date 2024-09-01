import { eq } from "drizzle-orm";
import { z } from "zod";
import { djs } from "../db/schema";
import { createTRPCRouter, publicProcedure, djProcedure } from "./trpc";
import { djProfileSchema } from "~/shared/schemas/djProfile";

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
        with: {
          shows: {
            columns: {
              genres: true,
            },
          },
          user: true,
          slot: true,
        },
      });

      return result;
    }),
  updateProfile: djProcedure
    .input(
      z.object({
        djId: z.string(),
        name: z.string().min(2),
        bio: z.string().max(500).optional(),
        instagramLink: z.string().url().optional(),
        twitterLink: z.string().url().optional(),
        spotifyLink: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { djId, ...updateData } = input;

      const updatedDJ = await ctx.db
        .update(djs)
        .set(updateData)
        .where(eq(djs.id, djId))
        .returning();

      // ... rest of the function ...
    }),
});
