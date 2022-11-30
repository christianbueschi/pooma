import { CardMode } from '@prisma/client';
import { observable } from '@trpc/server/observable';
import EventEmitter from 'events';
import { z } from 'zod';
import { prisma } from '../../../prisma/client';
import { getTeamChannel } from '../ably';
import { procedure, router } from '../trpc';

const eventEmitter = new EventEmitter();

export const teamRouter = router({
  team: procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const team = await prisma.team.findUnique({
        where: {
          id: input.id,
        },
        include: {
          members: true,
        },
      });

      return team;
    }),

  createTeam: procedure
    .input(
      z.object({
        cardMode: z.nativeEnum(CardMode),
        name: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const team = await prisma.team.create({
        data: {
          name: input.name,
          cardMode: input.cardMode,
        },
      });

      return team;
    }),

  updateTeam: procedure
    .input(
      z.object({
        id: z.string(),
        isLocked: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const team = await prisma.team.update({
        where: {
          id: input.id,
        },
        data: {
          isLocked: input.isLocked,
        },
      });

      const channel = getTeamChannel(team.id);
      channel.publish('member-created', team);

      return team;
    }),

  onChangeLocked: procedure.subscription(() => {
    return observable<boolean>((emit) => {
      const onChangeLocked = (data: boolean) => {
        emit.next(data);
      };
      eventEmitter.on('add', onChangeLocked);
      return () => {
        eventEmitter.off('add', onChangeLocked);
      };
    });
  }),
});
