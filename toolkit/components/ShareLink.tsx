import {
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  useClipboard,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { QRCode } from 'react-qrcode-logo';

type ShareLinkProps = {};

export const ShareLink: React.FC<ShareLinkProps> = ({}) => {
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
  const qrCodeBackgroundColor = useColorModeValue('#6ea0a2', '#2c4a52');
  const qrCodeForegroundColor = useColorModeValue('#2C3333', '#A5C9CA');

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
              Invite others to this team
            </Heading>
            <HStack p={2}>
              <QRCode
                value={value}
                qrStyle='dots'
                eyeRadius={8}
                fgColor={qrCodeForegroundColor}
                bgColor={qrCodeBackgroundColor}
                size={100}
                removeQrCodeBehindLogo={true}
              />
              <Button onClick={onCopy} w='150px'>
                {hasCopied ? 'Copied' : 'Copy Link'}
              </Button>
            </HStack>
          </VStack>
        </Flex>
      )}
    </>
  );
};
