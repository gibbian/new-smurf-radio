import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "./trpc";
import { djs, users } from "../db/schema";
import { nanoid } from "nanoid";

import { eq } from "drizzle-orm";

export const adminRouter = createTRPCRouter({
  createDJ: adminProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .insert(djs)
        .values({
          name: input.name,
          id: "dj-" + nanoid(5),
        })
        .returning();
      return result[0];
    }),

  linkDJ: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        djId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .update(users)
        .set({
          djId: input.djId,
        })
        .where(eq(users.id, input.userId))
        .returning();
      return result.at(0);
    }),
});
