import Ably from 'ably/promises';

export const ably = new Ably.Rest(process.env.ABLY_SERVER_API_KEY || '');

export const getTeamChannel = (id: string) => ably.channels.get(`${id}-team`);

export const getMembersChannel = (teamId: string | null) =>
  ably.channels.get(`${teamId}-members`);
