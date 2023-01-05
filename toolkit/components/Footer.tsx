import { Stack, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { ShareLink } from './ShareLink';

export const Footer: React.FC = () => {
  const { t } = useTranslation(['common']);

  const backgroundcolor = useColorModeValue('cyan.500', 'green.500');

  return (
    <VStack
      as='footer'
      p={6}
      bg={backgroundcolor}
      justifyContent='space-between'
    >
      <ShareLink />
      <Stack alignItems='end' flexDirection='row' gap={8}>
        <Link href='/privacy' passHref>
          <Text>{t('privacyPolicyLink')}</Text>
        </Link>
        <Link href='mailto:hello@pooma.app' passHref>
          <Text>{t('email')}</Text>
        </Link>
      </Stack>
    </VStack>
  );
};
