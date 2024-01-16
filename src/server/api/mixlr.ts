import { getShow } from "../mixlr/getShow";
import { createTRPCRouter, publicProcedure } from "./trpc";

export const mixlrRouter = createTRPCRouter({
  getCurrentShowAudio: publicProcedure.query(async ({}) => {
    const showInfo = await getShow();
    return showInfo;
  }),
});
