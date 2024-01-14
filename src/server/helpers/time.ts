import {
  addWeeks,
  getHours,
  getMinutes,
  isSameDay,
  nextDay,
  type Day,
} from "date-fns";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { shows, slots } from "../db/schema";

export const getNextAvailableShowTimes = async (
  djId: string,
  count: number,
): Promise<Date[]> => {
  const timesAlreadyUsed = (
    await db
      .select({ time: shows.startTime })
      .from(shows)
      .where(eq(shows.djId, djId))
  ).map((time) => time.time);

  const slotInfo = (
    await db.select().from(slots).where(eq(slots.djId, djId))
  )[0];

  if (!slotInfo) {
    throw new Error("No slot info found");
  }

  const rightNow = new Date();
  rightNow.setHours(getHours(slotInfo.time));
  rightNow.setMinutes(getMinutes(slotInfo.time));
  rightNow.setSeconds(0);
  rightNow.setMilliseconds(0);

  let next = rightNow;
  if (next.getDay() !== slotInfo.dayOfWeek) {
    next = nextDay(next, slotInfo.dayOfWeek as Day);
  }

  const results = [];

  let maxLoop = 100;
  while (results.length < count) {
    if (
      !timesAlreadyUsed.some((n) => {
        // TODO: make more specific
        return isSameDay(n, next);
      })
    ) {
      results.push(next);
    }

    next = addWeeks(next, 1);

    maxLoop--;
    if (maxLoop < 0) {
      throw new Error("Too many loops");
    }
  }

  return results;
};
