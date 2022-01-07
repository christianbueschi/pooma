import styled from '@emotion/styled';
import { theme } from '../theme';

const BUTTON_STYLES = {
  solid: {
    default: {
      background: theme.colors.green,
      color: 'white',
      hover: {
        background: theme.colors.greenDark,
        color: 'white',
      },
    },
    focus: {
      background: theme.colors.blue,
      color: 'white',
      hover: {
        background: theme.colors.blue,
        color: 'white',
      },
    },
    danger: {
      background: theme.colors.red,
      color: 'white',
      hover: {
        background: theme.colors.redDark,
        color: 'white',
      },
    },
  },
  ghost: {
    default: {
      background: 'transparent',
      color: theme.colors.green,
      hover: {
        background: 'transparent',
        color: theme.colors.greenDark,
      },
    },
    focus: {
      background: theme.colors.blue,
      color: 'white',
      hover: {
        background: theme.colors.blue,
        color: 'white',
      },
    },
    danger: {
      background: 'transparent',
      color: theme.colors.red,
      hover: {
        background: theme.colors.redDark,
        color: 'white',
      },
    },
  },
  link: {
    default: {
      background: 'transparent',
      color: theme.colors.green,
      hover: {
        background: 'transparent',
        color: theme.colors.blue,
      },
    },
    focus: {
      background: 'transparent',
      color: theme.colors.blue,
      hover: {
        background: 'transparent',
        color: theme.colors.blue,
      },
    },
    danger: {
      background: 'transparent',
      color: theme.colors.red,
      hover: {
        background: 'transparent',
        color: theme.colors.redDark,
      },
    },
  },
};

type ButtonVariants = 'solid' | 'link' | 'ghost';

type ButtonProps = {
  variant: ButtonVariants;
  type?: 'submit';
  icon?: string;
  isActive?: boolean;
  isDanger?: boolean;
  onClick: (ev: React.FormEvent) => void;
};

export const Button: React.FC<ButtonProps> = ({
  isActive,
  isDanger,
  children,
  type,
  icon,
  ...rest
}) => {
  const elementState = isActive ? 'focus' : isDanger ? 'danger' : 'default';

  return (
    <StyledButton elementState={elementState} {...rest} type={type}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button<{
  elementState: 'default' | 'focus' | 'danger';
  variant: ButtonVariants;
}>`
  display: inline-block;
  padding: 1rem;
  font-size: 24px;
  border-radius: 8px;
  border: none;
  background-color: ${({ variant, elementState }) =>
    BUTTON_STYLES[variant][elementState].background};
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
`;
