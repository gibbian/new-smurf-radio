import { eq, and, gte } from "drizzle-orm";
import { z } from "zod";
import { djs, djLinkingCodes, users } from "../db/schema";
import {
  createTRPCRouter,
  publicProcedure,
  djProcedure,
  protectedProcedure,
} from "./trpc";
import { djProfileSchema } from "~/shared/schemas/djProfile";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import slugify from "slugify";

export const djRouter = createTRPCRouter({
  getDjDetails: publicProcedure
    .input(
      z.object({
        djId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.djs.findFirst({
        where: eq(djs.id, input.djId),
        with: {
          shows: true,
          user: true,
          slot: true,
        },
      });

      return result;
    }),
  updateProfile: djProcedure
    .input(
      z.object({
        djId: z.string(),
        name: z.string().min(2),
        bio: z.string().max(500).optional(),
        instagramLink: z.string().url().optional(),
        twitterLink: z.string().url().optional(),
        spotifyLink: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { djId, ...updateData } = input;

      const updatedDJ = await ctx.db
        .update(djs)
        .set(updateData)
        .where(eq(djs.id, djId))
        .returning();

      // ... rest of the function ...
    }),
  generateLinkingCode: protectedProcedure
    .input(z.object({ djId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const dj = await ctx.db.query.djs.findFirst({
        where: eq(djs.id, input.djId),
      });

      if (!dj) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "DJ not found",
        });
      }

      const code = `${slugify(dj.name, { lower: true })}-${nanoid(6)}`;
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

      await ctx.db.insert(djLinkingCodes).values({
        code,
        djId: dj.id,
        expiresAt,
      });

      return { code };
    }),

  linkUserToDj: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const linkingCode = await ctx.db.query.djLinkingCodes.findFirst({
        where: eq(djLinkingCodes.code, input.code),
      });

      if (!linkingCode || linkingCode.expiresAt < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired linking code",
        });
      }

      await ctx.db
        .update(users)
        .set({ djId: linkingCode.djId })
        .where(eq(users.id, ctx.session.user.id));

      // Delete the used linking code
      await ctx.db
        .delete(djLinkingCodes)
        .where(eq(djLinkingCodes.code, input.code));

      return { success: true };
    }),

  getExistingLinkingCode: protectedProcedure
    .input(z.object({ djId: z.string() }))
    .query(async ({ ctx, input }) => {
      const now = new Date();
      const existingCode = await ctx.db.query.djLinkingCodes.findFirst({
        where: and(
          eq(djLinkingCodes.djId, input.djId),
          gte(djLinkingCodes.expiresAt, now),
        ),
      });

      return existingCode;
    }),
});
