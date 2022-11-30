import { z } from 'zod';
import { prisma } from '../../../prisma/client';
import { ably, getMembersChannel } from '../ably';
import { procedure, router } from '../trpc';

export const memberRouter = router({
  members: procedure
    .input(
      z.object({
        teamId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const members = await prisma.member.findMany({
        where: {
          teamId: input.teamId,
        },
      });

      return members;
    }),

  member: procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const member = await prisma.member.findUnique({
        where: {
          id: input.id,
        },
      });

      return member;
    }),

  createMember: procedure
    .input(
      z.object({
        name: z.string(),
        teamId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const member = await prisma.member.create({
        data: {
          name: input.name,
          team: {
            connect: {
              id: input.teamId,
            },
          },
        },
      });

      const channel = ably.channels.get(`${input.teamId}-members`);
      channel.publish('member-created', member);

      return member;
    }),

  updateMember: procedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        card: z.string().optional(),
        isSpectactorMode: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const member = await prisma.member.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          card: input.card,
          isSpectactorMode: input.isSpectactorMode,
        },
      });

      const channel = getMembersChannel(member.teamId);
      channel.publish('member-updated', member);

      return member;
    }),

  updateMembers: procedure
    .input(
      z.object({
        teamId: z.string(),
        card: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const member = await prisma.member.updateMany({
        where: {
          teamId: input.teamId,
        },
        data: {
          card: input.card,
        },
      });

      const channel = getMembersChannel(input.teamId);
      channel.publish('member-updated', member);

      return member;
    }),

  deleteMember: procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const member = await prisma.member.delete({
        where: {
          id: input.id,
        },
      });

      const channel = getMembersChannel(member.teamId);
      channel.publish('member-updated', member);

      return member;
    }),
});
