import { router, protectedProcedure, BadReqTRPCError } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { entryShapes } from "@/utils/zod-shapes";

export const diffableEntriesRouter = router({
  create: protectedProcedure
    .input(entryShapes.create)
    .mutation(async ({ ctx, input }) => {
      const entry = await ctx.prisma.diffableEntry.create({
        data: {
          diffable_id: input.diffable_id,
          entry_at: input.entry_at,
          content: input.content,
        },
      });
      return {
        created: entry,
      };
    }),
  update: protectedProcedure.mutation(async ({ ctx }) => {
    return {
      // msg: "User remove",
    };
  }),
});
