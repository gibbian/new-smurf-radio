import { nanoid } from "nanoid";
import { z } from "zod";
import { djs, shows, slots, users } from "../db/schema";
import { adminProcedure, createTRPCRouter } from "./trpc";

import { addHours, addWeeks, getDay, getHours } from "date-fns";
import {
  and,
  asc,
  eq,
  getTableColumns,
  gt,
  isNotNull,
  isNull,
  lt,
  type InferInsertModel,
} from "drizzle-orm";
import { getCurrentShow } from "../helpers/shows";
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
    const result = await ctx.db.select().from(djs).orderBy(djs.name);
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
      .orderBy(asc(slots.dayOfWeek), asc(slots.time));

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
      .onConflictDoNothing({
        target: shows.startTime,
      })
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

  goLive: adminProcedure.mutation(async ({ ctx }) => {
    const possibleCurrent = await getCurrentShow();
    if (possibleCurrent) {
      throw new Error("There is already a show live");
    }
    const now = new Date();
    // Round down now to the nearest hour
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);

    const dj = await ctx.db
      .select()
      .from(djs)
      .where(eq(djs.id, ctx.session.user.djId))
      .then((r) => r.at(0));

    if (!dj) {
      throw new Error("No DJ found");
    }

    const result = await ctx.db.insert(shows).values({
      id: "ls-" + nanoid(5),
      startTime: now,
      djId: ctx.session.user.djId,
      endTime: addHours(now, 1),
      djName: dj.name,
    });

    return result;
  }),

  createManualShow: adminProcedure
    .input(
      z.object({
        djId: z.string(),
        startTime: z.date(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      input.startTime.setSeconds(0);
      input.startTime.setMilliseconds(0);

      // Make sure there isn't already a show at this time
      const existing = await ctx.db
        .select()
        .from(shows)
        .where(eq(shows.startTime, input.startTime))
        .then((r) => r.at(0));

      if (existing) {
        throw new Error("There is already a show at that time");
      }

      const dj = await ctx.db
        .select()
        .from(djs)
        .where(eq(djs.id, input.djId))
        .then((r) => r.at(0));

      if (!dj) {
        throw new Error("No DJ found");
      }

      const result = await ctx.db
        .insert(shows)
        .values({
          id: "ms-" + nanoid(5),
          startTime: input.startTime,
          djId: input.djId,
          djName: dj.name,
          endTime: addHours(input.startTime, 1),
        })
        .returning()
        .then((r) => r.at(0));
      return result;
    }),

  userEmails: adminProcedure.query(async ({ ctx }) => {
    const emails = await ctx.db
      .select({ email: users.email })
      .from(users)
      .then((r) => r.map((u) => u.email));
    return emails.sort();
  }),

  getUserSlot: adminProcedure
    .input(
      z.object({
        djId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const slot = ctx.db
        .select()
        .from(slots)
        .where(eq(slots.djId, input.djId))
        .then((r) => r.at(0));
      return slot;
    }),
});
