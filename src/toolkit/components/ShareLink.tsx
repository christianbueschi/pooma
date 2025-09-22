'use client';

import {
  Button,
  Clipboard,
  Flex,
  Heading,
  HStack,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { useTheme } from 'next-themes';
import { colors } from '../theme/colors';

type ShareLinkProps = {};

export const ShareLink: React.FC<ShareLinkProps> = ({}) => {
  const pathname = usePathname();
  const { theme } = useTheme();

  const [value, setValue] = useState('');

  useEffect(() => {
    if (pathname?.startsWith('/team/')) {
      setValue(window.location.href);
    } else {
      setValue('');
    }
  }, [pathname, setValue]);

  const color = theme === 'dark' ? 'grey.500' : 'cyan.400';
  const backgroundColor = 'green.400';

  // Use explict hex values for QR code colors
  const qrCodeBackgroundColor =
    theme === 'dark' ? colors.green[500].value : colors.cyan[500].value;
  const qrCodeForegroundColor =
    theme === 'dark' ? colors.cyan[400].value : colors.grey[400].value;

  const isMedium = useBreakpointValue({ base: false, md: true });

  return (
    <>
      {value && (
        <Flex
          mb={2}
          border='1px solid'
          borderColor={backgroundColor}
          borderRadius='8px'
        >
          <VStack alignItems='normal'>
            <Heading
              size='sm'
              color={color}
              backgroundColor={backgroundColor}
              p={2}
              borderRadius='8px 8px 0 0'
            >
              Invite Others
            </Heading>
            <HStack p={2} justifyContent='center'>
              {isMedium && (
                <QRCode
                  value={value}
                  qrStyle='dots'
                  eyeRadius={8}
                  fgColor={qrCodeForegroundColor}
                  bgColor={qrCodeBackgroundColor}
                  size={100}
                  removeQrCodeBehindLogo={true}
                />
              )}

              <Clipboard.Root value={value}>
                {/* @ts-ignore */}
                <Clipboard.Trigger asChild>
                  <Button w='150px' title={value}>
                    <Clipboard.Indicator />
                    <Clipboard.CopyText />
                  </Button>
                </Clipboard.Trigger>
              </Clipboard.Root>
            </HStack>
          </VStack>
        </Flex>
      )}
    </>
  );
};
