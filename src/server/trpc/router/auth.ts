import { TRPCError } from "@trpc/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { router, publicProcedure, BadReqTRPCError } from "../trpc";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { getBaseUrl } from "@/utils/trpc";
import { SendEmail } from "@/server/actions/send-forgot-password-email";
const lessThanOneHourAgo = (date: number) => {
  const HOUR = 1000 * 60 * 60;
  const anHourAgo = Date.now() - HOUR;

  return date > anHourAgo;
};
export const authRouter = router({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email({ message: "Hey, try with an email instead" }),
        password: z.string(),
        remember: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
      });

      if (!user) {
        // throw new TRPCError({ code: "BAD_REQUEST", cause: "User not found" });
        throw new BadReqTRPCError("Incorrect email or password ", "password");
      }

      const valid_hash = await bcrypt.compare(input.password, user.password);
      if (!valid_hash) {
        throw new BadReqTRPCError("Incorrect email or password ", "password");
      }

      if (input.remember) {
        const session = await getServerAuthSession({
          req: ctx.request,
          res: ctx.response,
          ttl: 0,
        });
        session["user"] = { id: user.id };
        await session.save();
        ctx.session = session;
      } else {
        ctx.session["user"] = { id: user.id };
        await ctx.session.save();
      }

      return {
        user,
      };
    }),
  register: publicProcedure
    .input(
      z
        .object({
          name: z.string(),
          email: z.string(),
          password: z.string(),
          password_confirm: z.string(),
        })
        .refine((data) => data.password === data.password_confirm, {
          message: "Passwords don't match",
          path: ["password_confirm"],
        })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
      });
      if (user) {
        // const err = new ZodError([
        //   { code: "custom", message: "Email exists", path: ["email"] },
        // ]);
        // throw new TRPCError({ code: "BAD_REQUEST", cause: err });
        throw new BadReqTRPCError("Email Exists", "email");
      }

      const salt = await bcrypt.genSalt(10, "b");
      const password = await bcrypt.hash(input.password, salt);
      await ctx.prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          password,
        },
      });
      return {
        message: input,
      };
    }),
  passwordEmail: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      /**
       * 1. check user exists
       * 2. remove any older tokens
       * 3. generate a hash
       * 4. create a hash and persist it to the database (should send email)
       * 5. return a sucess message
       */
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
      });

      if (!user) {
        throw new TRPCError({ code: "BAD_REQUEST", cause: "User not found" });
      }

      const hasToken = await ctx.prisma.passwordReset.findFirst({
        where: {
          email: input.email,
        },
      });
      if (hasToken) {
        await ctx.prisma.passwordReset.delete({
          where: {
            email: input.email,
          },
        });
      }

      const char = crypto.randomBytes(20).toString("hex");
      const salt = await bcrypt.genSalt(10, "b");
      const token = await bcrypt.hash(char, salt);
      console.log(char);
      const url = `${getBaseUrl()}/auth/password-reset/${char}?email=${
        user.email
      }`;
      console.log(url);
      await ctx.prisma.passwordReset.create({
        data: {
          email: input.email,
          token,
        },
      });
      await SendEmail({ url, name: user.name });
      return {
        message: "We've emailed you the link to reset your password!",
      };
    }),
  passwordReset: publicProcedure
    .input(
      z
        .object({
          token: z.string(),
          email: z.string(),
          password: z.string(),
          password_confirm: z.string(),
        })
        .refine((data) => data.password === data.password_confirm, {
          message: "Passwords don't match",
          path: ["password_confirm"],
        })
    )
    .mutation(async ({ input, ctx }) => {
      const latestReset = await ctx.prisma.passwordReset.findFirst({
        where: {
          email: input.email,
        },
      });
      if (!latestReset) {
        throw new BadReqTRPCError("Email Exists", "email");
      }
      const isWithingOneHour = lessThanOneHourAgo(
        Number(new Date(latestReset.created_at))
      );

      const validHash = await bcrypt.compare(input.token, latestReset.token);
      if (!validHash || !isWithingOneHour) {
        throw new BadReqTRPCError("Reset link expired", "email");
      }
      const salt = await bcrypt.genSalt(10, "b");
      const password = await bcrypt.hash(input.password, salt);
      await ctx.prisma.user.update({
        where: {
          email: input.email,
        },
        data: {
          password,
        },
      });
      await ctx.prisma.passwordReset.delete({
        where: {
          email: input.email,
        },
      });

      return {
        message: "We've emailed you the link to reset your password!",
      };
    }),
  getUser: publicProcedure.query(async ({ ctx }) => {
    // console.log({ id: ctx.session.user?.id });
    if (!ctx.session.user?.id) {
      throw new TRPCError({ code: "CONFLICT", cause: "User not found in ctx" });
    }
    const user = await ctx.prisma.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
    });
    if (!user) {
      throw new TRPCError({ code: "CONFLICT", cause: "User not found" });
    }
    return {
      user,
    };
  }),
  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.session.destroy();
    return;
  }),
});
