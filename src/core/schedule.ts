import { addDays } from "date-fns";
import { and, gt, lt } from "drizzle-orm";
import { db } from "~/server/db";
import { shows } from "~/server/db/schema";

export namespace Schedule {
  export const getSchedule = async () => {
    const now = new Date();
    now.setHours(now.getHours() - 5);
    let oneWeekFromNow = new Date();
    oneWeekFromNow = addDays(oneWeekFromNow, 10);
    const result = await db
      .select()
      .from(shows)
      .where(and(gt(shows.startTime, now), lt(shows.startTime, oneWeekFromNow)))
      .orderBy(shows.startTime);
    return result;
  };
}
