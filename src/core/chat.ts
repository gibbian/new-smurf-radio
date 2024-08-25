import { z } from "zod";
import { and, eq, isNotNull } from "drizzle-orm";
import { fn } from "~/core/utils";
import { db } from "~/server/db";
import { chatMessages, users } from "~/server/db/schema";
import { chatMessageSchema } from "~/shared/schemas/chatMessage";

export namespace Chat {
  export const getMessages = fn(
    z.object({
      showId: z.string(),
    }),
    async (input) => {
      const messages = await db
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
    },
  );

  export const sendMessage = fn(chatMessageSchema, async (input) => {
    const result = await db
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
  });
}
