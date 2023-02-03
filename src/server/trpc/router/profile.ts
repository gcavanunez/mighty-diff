import {
  router,
  publicProcedure,
  protectedProcedure,
  BadReqTRPCError,
} from "../trpc";
import { z } from "zod";
import bcrypt from "bcrypt";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
export const profileRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  deleteMe: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.user.delete({
      where: {
        id: ctx.session.user.id,
      },
    });
    ctx.session.destroy();
    return {
      msg: "User remove",
    };
  }),
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const matchingUser = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
          NOT: {
            id: ctx.session.user.id,
          },
        },
      });
      if (matchingUser) {
        throw new BadReqTRPCError("Email Exists", "email");
      }
      await ctx.session.destroy();
      const user = await ctx.prisma.user.update({
        data: {
          name: input.name,
          email: input.email,
        },
        where: {
          id: ctx.session.user.id,
        },
      });

      return {
        user,
      };
    }),
  updatePassword: protectedProcedure
    .input(
      z
        .object({
          current_password: z.string(),
          new_password: z.string(),
          password_confirm: z.string(),
        })
        .refine((data) => data.new_password === data.password_confirm, {
          message: "Passwords don't match",
          path: ["password_confirm"],
        })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      });
      if (!user) {
        throw new BadReqTRPCError(
          "Incorrect email or password ",
          "current_password"
        );
      }
      const valid_hash = await bcrypt.compare(
        input.current_password,
        user.password
      );
      if (!valid_hash) {
        throw new BadReqTRPCError(
          "Incorrect email or password ",
          "current_password"
        );
      }
      const salt = await bcrypt.genSalt(10, "b");
      const password = await bcrypt.hash(input.new_password, salt);
      await ctx.prisma.user.update({
        data: {
          password,
        },
        where: {
          id: ctx.session.user.id,
        },
      });
      return {
        message: "Password Updated",
      };
    }),
});
