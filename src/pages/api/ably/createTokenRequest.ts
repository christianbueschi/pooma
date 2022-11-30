import Ably from 'ably/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';

export const ablyClient = new Ably.Realtime(
  process.env.NEXT_PUBLIC_ABLY_CLIENT_API_KEY || ''
);

ablyClient.connection.on('connected', function () {
  console.log('Connected to ably!');
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const randomName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors],
    length: 2,
  });

  const tokenRequestData = await ablyClient.auth.createTokenRequest({
    clientId: randomName,
  });

  res.status(200).json(tokenRequestData);
}
