import styled from '@emotion/styled';
import { FiX } from 'react-icons/fi';
import { Button } from './elements/Button';
import { Flex } from './elements/Flex';
import { Title } from './Tabs';

type ModalProps = {
  title: string;
  handleClose: () => void;
};

export const Modal: React.FC<ModalProps> = ({
  title,
  handleClose,
  children,
}) => {
  return (
    <StyledModal>
      <StyledModalInner>
        <StyledButton variant='ghost' onClick={handleClose}>
          <FiX size={32} />
        </StyledButton>
        <Flex gap={24}>
          <Title css={{ textAlign: 'center', color: 'white' }}>{title}</Title>
          {children}
        </Flex>
      </StyledModalInner>
    </StyledModal>
  );
};

const StyledModal = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const StyledModalInner = styled.div`
  position: relative;
  width: 600px;
  background: ${({ theme }) => theme.colors.blue};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacings[24]};
`;

const StyledButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
`;
