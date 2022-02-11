import styled from '@emotion/styled';
import React, { useEffect, useRef } from 'react';

type ContextNavProps = {
  handleClose: () => void;
};

export const ContextNav: React.FC<ContextNavProps> = ({
  handleClose,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (ev: MouseEvent) => {
    // @ts-ignore
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

  return <StyledDroplet ref={ref}>{children}</StyledDroplet>;
};

const StyledDroplet = styled.div`
  position: absolute;
  z-index: 1;
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