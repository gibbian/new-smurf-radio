import { nanoid } from "nanoid";
import { z } from "zod";
import { djs, shows, slots, users } from "../db/schema";
import { adminProcedure, createTRPCRouter } from "./trpc";

import { addHours, addWeeks, getDay, getHours } from "date-fns";
import {
  InferInsertModel,
  and,
  asc,
  eq,
  getTableColumns,
  gt,
  isNotNull,
  isNull,
  lt,
} from "drizzle-orm";
import { getNextAvailableShowTimes } from "../helpers/time";

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

  listAllShows: adminProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.select().from(shows).orderBy(shows.startTime);
    return result;
  }),

  fillSchedule: adminProcedure.mutation(async ({ ctx }) => {
    // Get a list of djs that don't have a slot in the next 7 days
    const nextWeek = addWeeks(new Date(), 1);
    const rightNow = new Date();
    const result = await ctx.db
      .select({
        ...getTableColumns(djs),
        slot: getTableColumns(slots),
        show: getTableColumns(shows),
      })
      .from(djs)
      .innerJoin(slots, eq(slots.djId, djs.id))
      .leftJoin(
        shows,
        and(
          eq(shows.djId, djs.id),
          gt(shows.startTime, rightNow),
          lt(shows.startTime, nextWeek),
        ),
      )
      .where(and(isNotNull(slots.djId), isNull(shows.djId)));

    const toInsert: InferInsertModel<typeof shows>[] = [];

    for (const dj of result) {
      const nextTime = (await getNextAvailableShowTimes(dj.id, 1))[0];
      if (!nextTime) {
        continue;
      }

      const oneHourLater = addHours(nextTime, 1);

      toInsert.push({
        id: "show-" + nanoid(5),
        djId: dj.id,
        djName: dj.name,
        startTime: nextTime,
        endTime: oneHourLater,
      });
    }

    if (toInsert.length === 0) {
      return [];
    }

    const insertedShows = await ctx.db
      .insert(shows)
      .values(toInsert)
      .returning();

    return insertedShows;
  }),

  deleteShow: adminProcedure
    .input(z.object({ showId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .delete(shows)
        .where(eq(shows.id, input.showId))
        .returning();
      return result;
    }),
});
