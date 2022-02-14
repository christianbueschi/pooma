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
    <Info
      css={{ cursor: 'pointer' }}
      color={inverse ? 'green' : 'blue'}
      onClick={copyTextToClipboard}
    >
      <Body css={{ wordBreak: 'break-all' }}>{href} ✂️</Body>
    </Info>
  );
};
