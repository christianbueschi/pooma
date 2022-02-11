import styled from '@emotion/styled';
import Dropdown, { Option } from 'react-dropdown';
import { Body } from './Body';

export const Label = styled.label`
  color: ${({ theme }) => theme.colors.grey40};
`;

export const StyledDropdown = styled(Dropdown)`
  .Dropdown-root {
  }
  .Dropdown-control {
    border-radius: ${({ theme }) => theme.borderRadius[8]};
    height: 42px;
    display: flex;
    align-items: center;
  }
`;

export const ErrorInfo = styled.div`
  background-color: ${({ theme }) => theme.colors.red};
  border-radius: ${({ theme }) => theme.borderRadius[8]};
  color: white;
  padding: ${({ theme }) => theme.spacings[16]};
`;

export const Info = styled.div<{ color?: 'green' | 'blue' }>`
  background-color: ${({ theme, color }) =>
    color === 'blue' ? theme.colors.blue : theme.colors.green};
  border-radius: ${({ theme }) => theme.borderRadius[8]};
  color: white;
  padding: ${({ theme }) => theme.spacings[16]};
`;

export const Input = styled.input`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.grey20};
  border-radius: ${({ theme }) => theme.borderRadius[8]};
  height: 42px;
  padding: ${({ theme }) => theme.spacings[12]};
  font-size: 16px;
  display: block;

  -webkit-appearance: none;

  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.colors.green};
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-gap: ${({ theme }) => theme.spacings[12]};
  width: 100%;
  align-items: center;
`;
