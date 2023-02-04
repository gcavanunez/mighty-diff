import { router } from "../trpc";
import { authRouter } from "./auth-routes";
import { profileRouter } from "./profile";
import { diffablesRouter } from "./diffables-routes";
import { diffableEntriesRouter } from "./diffable-entries-routes";

export const appRouter = router({
  auth: authRouter,
  profile: profileRouter,
  diffables: diffablesRouter,
  entries: diffableEntriesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
