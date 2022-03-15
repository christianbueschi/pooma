import styled from '@emotion/styled';
import { Body } from '../elements/Body';
import { Info } from '../elements/Form';

type ShareLinkProps = {
  inverse?: boolean;
};

export const ShareLink: React.FC<ShareLinkProps> = ({ inverse }) => {
  const href = window?.location.href;

  const copyTextToClipboard = () => {
    navigator.clipboard.writeText(href);
  };

  return (
    <StyledInfo
      color={inverse ? 'green' : 'blue'}
      onClick={copyTextToClipboard}
    >
      <Body css={{ wordBreak: 'break-all' }}>
        <span data-testid='share-link'>{href}</span> ✂️
      </Body>
    </StyledInfo>
  );
};

const StyledInfo = styled(Info)`
  cursor: pointer;
  /* background-color: ${({ theme }) => theme.colors.white}; */
  /* color: ${({ theme }) => theme.colors.green}; */

  /* &:hover {
    background-color: ${({ theme }) => theme.colors.green};
  } */
`;
