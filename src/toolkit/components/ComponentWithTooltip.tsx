import { Box } from '@chakra-ui/react';
import React from 'react';

export const ComponentWithTooltip = React.forwardRef<
  HTMLInputElement,
  { children: React.ReactNode }
>(({ children, ...rest }, ref) => (
  <Box ref={ref} {...rest}>
    {children}
  </Box>
));

ComponentWithTooltip.displayName = 'ComponentWithTooltip';
