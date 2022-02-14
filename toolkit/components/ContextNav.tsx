import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';

type ContextNavProps = {
  TriggerComponent: JSX.Element;
};

export const ContextNav: React.FC<ContextNavProps> = ({
  TriggerComponent,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [showContext, toggleContext] = useState(false);

  const handleClickOutside = (ev: MouseEvent) => {
    // @ts-ignore
    if (ref.current && !ref.current.contains(ev.target)) {
      // stop propagation for context toggle button
      ev.stopImmediatePropagation();

      toggleContext(false);
    }
  };

  useEffect(() => {
    if (!showContext) return;

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [showContext]);

  const ClonedTriggerComponent = React.cloneElement(TriggerComponent, {
    onClick: () => toggleContext(!showContext),
  });

  return (
    <>
      {ClonedTriggerComponent}
      {showContext && <ContextNavInner ref={ref}>{children}</ContextNavInner>}
    </>
  );
};

const ContextNavInner = styled.div`
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
