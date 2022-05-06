import {
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

type PModalProps = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  preventClosing?: boolean;
  handleClose: () => void;
};

export const Modal: React.FC<PModalProps> = ({
  title,
  isOpen,
  preventClosing,
  handleClose,
  children,
}) => {
  return (
    <ChakraModal size='2xl' onClose={handleClose} isOpen={isOpen}>
      <ModalOverlay opacity='0.5' backgroundColor='blue.700' />
      <ModalContent>
        <ModalHeader textAlign='center'>{title}</ModalHeader>
        {!preventClosing && <ModalCloseButton />}
        <ModalBody p={12}>{children}</ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};
