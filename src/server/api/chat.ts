import { createTRPCRouter, protectedProcedure, publicProcedure } from "./trpc";
import { Chat } from "~/core/chat";

export const chatRouter = createTRPCRouter({
  getInitialMessages: publicProcedure
    .input(Chat.getMessages.schema)
    .query(async ({ input }) => {
      return Chat.getMessages.rawCb(input);
    }),

  sendMessage: protectedProcedure
    .input(Chat.sendMessage.schema)
    .mutation(async ({ input }) => {
      return Chat.sendMessage.rawCb(input);
    }),
});
