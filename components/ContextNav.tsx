import styled from '@emotion/styled';
import React, { useEffect, useRef } from 'react';

type ContextNavProps = {
  handleClose: () => void;
};

export const ContextNav: React.FC<ContextNavProps> = ({
  handleClose,
  children,
}) => {
  const ref = useRef(null);

  const handleClickOutside = (ev: MouseEvent) => {
    if (ref.current && !ref.current.contains(ev.target)) {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return <StyledDroplet>{children}</StyledDroplet>;
};

const StyledDroplet = styled.div`
  position: absolute;
  right: 0;
  top: 40px;
  background-color: ${({ theme }) => theme.colors.blue};
  border-radius: ${({ theme }) => theme.borderRadius[8]};
  width: 250px;
  padding: ${({ theme }) => theme.spacings[16]};

  &:before {
    content: '';
  }
`;
