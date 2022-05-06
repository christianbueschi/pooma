import styled from '@emotion/styled';
import Dropdown from 'react-dropdown';

export const Label = styled.label`
  color: ${({ theme }) => theme.colors.grey40};
`;

export const StyledDropdown = styled(Dropdown)`
  .Dropdown-root {
  }
  .Dropdown-control {
    border-radius: 8px;
    height: 42px;
    display: flex;
    align-items: center;
  }
`;
