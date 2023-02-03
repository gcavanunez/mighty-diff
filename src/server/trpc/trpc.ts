import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { type Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

export const router = t.router;

export const publicProcedure = t.procedure;

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: {
        // ...ctx.session,
        destroy: ctx.session.destroy,
        save: ctx.session.save,
        user: ctx.session.user,
        // ...example,
        // func: () => {
        //   console.log("he");
        // },
      },
    },
  });
});

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthed);

export class BadReqTRPCError extends TRPCError {
  constructor(message: string, path: string) {
    const errorConfig = {
      code: "BAD_REQUEST" as typeof TRPCError.prototype.code,
      message: message,
    };

    super({
      ...errorConfig,
      // this here fixed it
      cause: new ZodError([{ code: "custom", path: [path], message }]),
    });
  }
}
