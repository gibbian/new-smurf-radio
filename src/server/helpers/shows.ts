import { and, gt, lt } from "drizzle-orm";
import { db } from "../db";
import { shows } from "../db/schema";

export const getCurrentShow = async () => {
  const now = new Date();
  const result = await db
    .select()
    .from(shows)
    .where(and(lt(shows.startTime, now), gt(shows.endTime, now)))
    .then((shows) => shows.at(0));
  return result ?? null;
};
