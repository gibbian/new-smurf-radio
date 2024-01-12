import { nanoid } from "nanoid";
import { z } from "zod";
import { djs, slots, users } from "../db/schema";
import { adminProcedure, createTRPCRouter } from "./trpc";

import { getDay, getHours } from "date-fns";
import { asc, eq } from "drizzle-orm";

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
      return result.at(0);
    }),

  linkDJ: adminProcedure
    .input(
      z.object({
        userEmail: z.string(),
        djId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Make sure there is a matching email
      const matching = await ctx.db
        .select()
        .from(users)
        .where(eq(users.email, input.userEmail));
      if (matching.length === 0) {
        throw new Error("No user with that email");
      }

      const result = await ctx.db
        .update(users)
        .set({
          djId: input.djId,
        })
        .where(eq(users.email, input.userEmail))
        .returning();
      return result.at(0);
    }),

  listDJs: adminProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.select().from(djs);
    return result;
  }),

  assignSlot: adminProcedure
    .input(
      z.object({
        djId: z.string(),
        time: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Make sure that the dj doesn't already have a slot
      const result = await ctx.db
        .insert(slots)
        .values({
          time: input.time,
          djId: input.djId,
          dayOfWeek: getDay(input.time),
          hourOfDay: getHours(input.time),
        })
        .onConflictDoUpdate({
          target: slots.djId,
          set: {
            time: input.time,
            dayOfWeek: getDay(input.time),
            hourOfDay: getHours(input.time),
          },
        })
        .returning();

      return result;
    }),

  listDjSlots: adminProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        djId: djs.id,
        name: djs.name,
        time: slots.time,
      })
      .from(djs)
      .leftJoin(slots, eq(slots.djId, djs.id))
      .orderBy(asc(slots.dayOfWeek));

    return result;
  }),
});
