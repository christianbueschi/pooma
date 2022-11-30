import { mergeRouters } from '../trpc';
import { memberRouter } from './member';
import { teamRouter } from './team';

export const appRouter = mergeRouters(teamRouter, memberRouter);

export type AppRouter = typeof appRouter;
