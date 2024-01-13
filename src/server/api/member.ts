import { addHours } from "date-fns";
import { and, eq, gt } from "drizzle-orm";
import { nanoid } from "nanoid";
import { djs, shows } from "../db/schema";
import { getNextAvailableShowTimes } from "../helpers/time";
import { createTRPCRouter, djProcedure } from "./trpc";
import { editShowSchema } from "~/shared/schemas/editShow";
import { z } from "zod";

export const memberRouter = createTRPCRouter({
  createNewShow: djProcedure.mutation(async ({ ctx }) => {
    const timeForNextShow = (
      await getNextAvailableShowTimes(ctx.session.user.djId, 1)
    )[0];

    if (!timeForNextShow) {
      throw new Error("No more available slots");
    }

    const oneHourLater = addHours(timeForNextShow, 1);

    const dj = await ctx.db
      .select()
      .from(djs)
      .where(eq(djs.id, ctx.session.user.djId))
      .then((r) => r.at(0));

    if (!dj) {
      throw new Error("No DJ found");
    }

    const result = await ctx.db
      .insert(shows)
      .values({
        id: "show-" + nanoid(5),
        djId: ctx.session.user.djId,
        startTime: timeForNextShow,
        endTime: oneHourLater,
        djName: dj.name,
      })
      .returning()
      .then((r) => r.at(0));
    if (!result) {
      throw new Error("No show created");
    }

    return result;
  }),

  editShow: djProcedure
    .input(
      z.object({
        showId: z.string(),
        payload: editShowSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(shows)
        .set(input.payload)
        .where(eq(shows.id, input.showId));
      return;
    }),

  myUpcomingShows: djProcedure.query(async ({ ctx }) => {
    const thisMorning = new Date();
    thisMorning.setHours(0, 0, 0, 0);
    const result = await ctx.db
      .select()
      .from(shows)
      .where(
        and(
          eq(shows.djId, ctx.session.user.djId),
          gt(shows.startTime, thisMorning),
        ),
      );
    return result;
  }),

  deleteShow: djProcedure
    .input(
      z.object({
        showId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .delete(shows)
        .where(eq(shows.id, input.showId))
        .returning()
        .then((r) => r.at(0));

      return result;
    }),
});
