import { router } from "../trpc";
import { authRouter } from "./auth";
import { profileRouter } from "./profile";
import { diffablesRouter } from "./diffables-routes";

export const appRouter = router({
  auth: authRouter,
  profile: profileRouter,
  diffables: diffablesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
