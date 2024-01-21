import { eq } from "drizzle-orm";
import { z } from "zod";
import { users } from "../db/schema";
import { createTRPCRouter, protectedProcedure } from "./trpc";

export const accountRouter = createTRPCRouter({
  changeName: protectedProcedure
    .input(
      z.object({
        newName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const possibleUser = await ctx.db
        .select()
        .from(users)
        .where(eq(users.name, input.newName))
        .then((res) => res.at(0));

      if (possibleUser) {
        throw new Error("Username already exists");
      }

      const newUser = ctx.db
        .update(users)
        .set({
          name: input.newName,
        })
        .where(eq(users.id, ctx.session.user.id));

      return newUser;
    }),
});
