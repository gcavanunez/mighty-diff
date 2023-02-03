import { getIronSession } from "iron-session";
import { type GetServerSidePropsContext } from "next";
import { ironOptions } from "./iron-session-options";

/**
 * Wrapper for unstable_getServerSession https://next-auth.js.org/configuration/nextjs
 * See example usage in trpc createContext or the restricted API route
 */
export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
  ttl?: number;
}) => {
  // https://github.com/vvo/iron-session/blob/70d2ff14aacb51e83284d51832fdcda539b4dabc/src/core.ts#L180 -    Object.defineProperties(
  // const { save, destroy, user } = await getIronSession(ctx.req, ctx.res, {
  return await getIronSession(ctx.req, ctx.res, {
    ...ironOptions,
    // ttl: 120,
    ttl: ctx.ttl === 0 || ctx.ttl ? ctx.ttl : 3600,
  });
  // const session = await getIronSession(ctx.req, ctx.res, {
  //   ...ironOptions,
  //   // ttl: 120,
  //   ttl: ctx.ttl === 0 || ctx.ttl ? ctx.ttl : 3600,
  // });
  // // console.log(sesh);
  // return { save: session.save, destroy: session.destroy, user: session.user };
};
