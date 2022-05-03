import styled from '@emotion/styled';
import { FiX } from 'react-icons/fi';
import { Flex } from '../elements/Flex';
import { Title } from '../elements/Title';
import { MQ } from './constants';

type ModalProps = {
  title: string;
  handleClose?: () => void;
  children?: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({
  title,
  handleClose,
  children,
}) => {
  return (
    <StyledModal>
      <StyledModalInner>
        {handleClose && (
          <StyledButton onClick={handleClose}>
            <FiX size={32} />
          </StyledButton>
        )}
        <Flex gap={48}>
          <Title css={{ textAlign: 'center' }}>{title}</Title>
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
  background-color: ${({ theme }) => theme.colors.blue};

  display: flex;
  align-items: start;
  justify-content: center;
  z-index: 9999;
`;

const StyledModalInner = styled.div`
  position: relative;
  top: 100px;
  width: 600px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius[8]};
  padding: ${({ theme }) => `${theme.spacings[24]}`};
  margin: ${({ theme }) => `${theme.spacings[24]}`};

  ${MQ[1]} {
    padding: ${({ theme }) => `${theme.spacings[24]} 84px`};
  }
`;

const StyledButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
`;
