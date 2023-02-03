import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { IronSession, IronSessionData } from "iron-session";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../common/get-server-auth-session";

// import { getIronSession } from "iron-session";

import { prisma } from "../db/client";

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
// type CreateContextOptions = Record<string, never>;
type CreateContextOptions = {
  session: IronSession;
  // session: IronSessionData;
  request: NextApiRequest;
  response: NextApiResponse;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    // session: {
    //   ...opts.session,
    //   func: () => {
    //     console.log("he");
    //   },
    // },
    session: opts.session,
    prisma,
    request: opts.request,
    response: opts.response,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;
  const session = await getServerAuthSession({ req, res });
  return await createContextInner({
    session,
    request: req,
    response: res,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
