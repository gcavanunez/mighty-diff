import { router, protectedProcedure, BadReqTRPCError } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const diffablesRouter = router({
  index: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.prisma.diffable.findMany({
      take: 20,
    });
    return {
      rows,
    };
  }),
  show: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const diffable = await ctx.prisma.diffable.findFirst({
        where: {
          id: input.id,
        },
      });
      console.log(diffable);
      if (!diffable) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
      return {
        diffable,
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        label: z.string(),
        identifier: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const diffable = await ctx.prisma.diffable.create({
        data: {
          // label: input.label,
          identifier: input.identifier,
          label: input.label,
        },
      });
      return diffable;
    }),
  update: protectedProcedure.mutation(async ({ ctx }) => {
    return {
      msg: "User remove",
    };
  }),
});
