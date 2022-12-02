import { ComponentStyleConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

export const buttonStyles: ComponentStyleConfig = {
  baseStyle: {
    fontWeight: 'bold',
    borderRadius: '3xl',
  },
  sizes: {
    md: {
      fontSize: 'md',
      px: [2, 4, 6],
      py: 4,
    },
  },
  variants: {
    solid: (props) => ({
      bg: mode('cyan.400', 'green.400')(props),
      color: mode('green.400', 'cyan.400')(props),
      _hover: {
        bg: mode('green.400', 'green.500')(props),
        color: mode('cyan.400', 'cyan.400')(props),
        _disabled: {
          bg: 'green.500',
        },
      },
      _focus: {
        bg: mode('green.500', 'green.500')(props),
        color: mode('cyan.400', 'cyan.400')(props),
      },
      _disabled: {
        bg: 'green.500',
        color: mode('cyan.400', 'cyan.400')(props),
      },
    }),
    ghost: (props) => ({
      bg: 'transparent',
      color: mode('green.400', 'cyan.400')(props),
      _hover: {
        bg: mode('cyan.400', 'green.400')(props),
        color: mode('green.500', 'cyan.400')(props),
        _disabled: {
          bg: 'transparent',
        },
      },
      _focus: {
        bg: mode('cyan.400', 'green.400')(props),
        color: mode('green.500', 'cyan.400')(props),
      },
      _disabled: {
        bg: 'green.500',
        border: '1px solid',
        borderColor: 'grey.200',
      },
    }),
    link: {
      bg: 'trnsparent',
      color: 'cyan.400',
      _hover: {
        _disabled: {
          bg: 'transparent',
        },
      },
      _focus: {},
      _disabled: {},
    },
  },
  defaultProps: {
    size: 'md',
    variant: 'solid',
  },
};
