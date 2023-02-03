import {
  Button,
  Flex,
  Heading,
  HStack,
  useBreakpointValue,
  useClipboard,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { QRCode } from 'react-qrcode-logo';
import { colors } from '../theme/colors';

type ShareLinkProps = {};

export const ShareLink: React.FC<ShareLinkProps> = ({}) => {
  const { t } = useTranslation(['common']);

  const router = useRouter();

  const { hasCopied, onCopy, setValue, value } = useClipboard('');

  useEffect(() => {
    if (router.pathname === '/team/[teamId]') {
      setValue(window.location.href);
    } else {
      setValue('');
    }
  }, [router.pathname, setValue]);

  const color = useColorModeValue('cyan.400', 'grey.500');
  const backgroundColor = useColorModeValue('green.400', 'green.400');

  // Use explict hex values for QR code colors
  const qrCodeBackgroundColor = useColorModeValue(
    colors.cyan[500],
    colors.green[500]
  );
  const qrCodeForegroundColor = useColorModeValue(
    colors.grey[400],
    colors.cyan[400]
  );

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
              {t('inviteOthers')}
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
              <Button onClick={onCopy} w='150px' title={value}>
                {hasCopied ? 'Copied' : 'Copy Link'}
              </Button>
            </HStack>
          </VStack>
        </Flex>
      )}
    </>
  );
};
