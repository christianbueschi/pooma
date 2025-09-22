import { defineRecipe } from '@chakra-ui/react';

export const buttonStyles = defineRecipe({
  base: {
    fontWeight: 'bold',
    borderRadius: '3xl',
  },
  variants: {
    variant: {
      solid: {
        bg: { base: 'cyan.400', _dark: 'green.400' },
        color: { base: 'green.400', _dark: 'cyan.400' },
        _hover: {
          bg: { base: 'green.400', _dark: 'green.500' },
          color: { base: 'cyan.400', _dark: 'cyan.400' },
          _disabled: {
            bg: 'green.500',
          },
        },
        _focus: {
          bg: { base: 'green.500', _dark: 'green.500' },
          color: { base: 'cyan.400', _dark: 'cyan.400' },
        },
        _disabled: {
          bg: 'green.500',
        },
      },
      ghost: {
        bg: 'transparent',
        color: { base: 'green.400', _dark: 'cyan.400' },
        _hover: {
          bg: { base: 'cyan.400', _dark: 'green.400' },
          color: { base: 'green.500', _dark: 'cyan.400' },
          _disabled: {
            bg: { base: 'transparent', _dark: 'cyan.400' },
          },
        },
        _focus: {
          bg: { base: 'cyan.400', _dark: 'green.400' },
          color: { base: 'green.500', _dark: 'cyan.400' },
        },
        _disabled: {
          bg: 'green.500',
          border: '1px solid',
          borderColor: 'grey.200',
        },
      },
    },
  },
  // sizes: {
  //   md: {
  //     fontSize: 'md',
  //     px: [4, 4, 6],
  //     py: 4,
  //   },
  // },
  defaultVariants: {
    variant: 'solid',
  },
});
