import styled from '@emotion/styled';
import React from 'react';
import { theme } from '../theme';
import { spacings } from '../theme/spacings';

const HEIGHT = '42px';

export const LINK_STYLES = {
  default: {
    background: 'transparent',
    color: theme.colors.green,
    padding: 0,
    height: HEIGHT,
    hover: {
      background: 'transparent',
      color: theme.colors.blue,
    },
  },
  focus: {
    background: 'transparent',
    color: theme.colors.blue,
    padding: 0,
    height: HEIGHT,
    hover: {
      background: 'transparent',
      color: theme.colors.blue,
    },
  },
  danger: {
    background: 'transparent',
    color: theme.colors.red,
    padding: 0,
    height: HEIGHT,
    hover: {
      background: 'transparent',
      color: theme.colors.redDark,
    },
  },
  disabled: {
    background: 'transparent',
    color: theme.colors.red,
    padding: 0,
    height: HEIGHT,
    hover: {
      background: 'transparent',
      color: theme.colors.redDark,
    },
  },
};

const BUTTON_STYLES = {
  solid: {
    default: {
      background: theme.colors.green,
      color: 'white',
      padding: `0 ${spacings[24]}`,
      height: HEIGHT,
      hover: {
        background: theme.colors.greenDark,
        color: 'white',
      },
    },
    focus: {
      background: theme.colors.blue,
      color: 'white',
      padding: `0 ${spacings[24]}`,
      height: HEIGHT,
      hover: {
        background: theme.colors.blue,
        color: 'white',
      },
    },
    danger: {
      background: theme.colors.red,
      color: 'white',
      padding: `0 ${spacings[24]}`,
      height: HEIGHT,
      hover: {
        background: theme.colors.redDark,
        color: 'white',
      },
    },
    disabled: {
      background: theme.colors.grey20,
      color: theme.colors.white,
      padding: `0 ${spacings[24]}`,
      height: HEIGHT,
      hover: {
        background: theme.colors.grey20,
        color: theme.colors.white,
      },
    },
  },
  ghost: {
    default: {
      background: 'transparent',
      color: theme.colors.green,
      padding: `0 ${spacings[24]}`,
      height: HEIGHT,
      hover: {
        background: 'transparent',
        color: theme.colors.greenDark,
      },
    },
    focus: {
      background: theme.colors.blue,
      color: 'white',
      padding: `0 ${spacings[24]}`,
      height: HEIGHT,
      hover: {
        background: theme.colors.blue,
        color: 'white',
      },
    },
    danger: {
      background: 'transparent',
      color: theme.colors.red,
      padding: `0 ${spacings[24]}`,
      height: HEIGHT,
      hover: {
        background: theme.colors.redDark,
        color: 'white',
      },
    },
    disabled: {
      background: 'transparent',
      color: theme.colors.red,
      padding: `0 ${spacings[24]}`,
      height: HEIGHT,
      hover: {
        background: theme.colors.redDark,
        color: 'white',
      },
    },
  },
  link: LINK_STYLES,
};

type ButtonVariants = 'solid' | 'link' | 'ghost';

type ButtonProps = {
  variant?: ButtonVariants;
  type?: 'submit';
  icon?: string;
  isActive?: boolean;
  isDanger?: boolean;
  isDisabled?: boolean;
  isFullWidth?: boolean;
  css?: any;
  onClick?: (ev: React.FormEvent) => void;
  children?: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({
  isActive,
  isDanger,
  isDisabled,
  children,
  type,
  icon,
  variant = 'solid',
  ...rest
}) => {
  const elementState = isActive
    ? 'focus'
    : isDanger
    ? 'danger'
    : isDisabled
    ? 'disabled'
    : 'default';

  return (
    <StyledButton
      elementState={elementState}
      variant={variant}
      type={type}
      disabled={isDisabled}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button<{
  elementState: 'default' | 'focus' | 'danger' | 'disabled';
  variant: ButtonVariants;
  isFullWidth?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ variant, elementState }) =>
    BUTTON_STYLES[variant][elementState].padding};
  width: ${({ isFullWidth }) => (isFullWidth ? '100%' : 'auto')};
  font-size: 20px;
  border-radius: ${({ theme }) => theme.borderRadius[8]};
  border: none;
  background-color: ${({ variant, elementState }) =>
    BUTTON_STYLES[variant][elementState].background};
  height: ${({ variant, elementState }) =>
    BUTTON_STYLES[variant][elementState].height};
  color: ${({ variant, elementState }) =>
    BUTTON_STYLES[variant][elementState].color};
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background-color: ${({ variant, elementState }) =>
      BUTTON_STYLES[variant][elementState].hover.background};
    color: ${({ variant, elementState }) =>
      BUTTON_STYLES[variant][elementState].hover.color};
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;
