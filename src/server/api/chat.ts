import { and, eq, isNotNull } from "drizzle-orm";
import { z } from "zod";
import { chatMessages, users } from "../db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "./trpc";
import { chatMessageSchema } from "~/shared/schemas/chatMessage";

export const chatRouter = createTRPCRouter({
  getInitialMessages: publicProcedure
    .input(
      z.object({
        showId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const messages = await ctx.db
        .select({
          showId: chatMessages.showId,
          userName: users.name,
          userId: users.id,
          message: chatMessages.message,
          timestamp: chatMessages.timestamp,
          id: chatMessages.id,
        })
        .from(chatMessages)
        .innerJoin(users, eq(users.id, chatMessages.userId))
        .where(
          and(
            eq(chatMessages.showId, input.showId),
            // username is not null
            isNotNull(users.name),
          ),
        )
        .orderBy(chatMessages.timestamp)
        .limit(100);
      return messages;
    }),

  sendMessage: protectedProcedure
    .input(chatMessageSchema)
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .insert(chatMessages)
        .values({
          ...input,
        })
        .returning()
        .then((r) => r.at(0));
      if (!result) {
        throw new Error("Failed to send message");
      }
      return result;
    }),
});
