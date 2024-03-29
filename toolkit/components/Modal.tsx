import {
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
} from '@chakra-ui/react';

type PModalProps = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  preventClosing?: boolean;
  onClose?: () => void;
};

export const Modal: React.FC<PModalProps> = ({
  title,
  isOpen,
  preventClosing,
  onClose,
  children,
}) => {
  const backgroundColor = useColorModeValue('white', 'grey.400');

  return (
    <ChakraModal
      size='2xl'
      onClose={onClose ? onClose : () => {}}
      isOpen={isOpen}
      closeOnOverlayClick={!preventClosing}
    >
      <ModalOverlay />
      <ModalContent backgroundColor={backgroundColor} mx={[4]}>
        <ModalHeader textAlign='center'>{title}</ModalHeader>
        {!preventClosing && <ModalCloseButton />}
        <ModalBody p={[4, 6, 12]}>{children}</ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};
