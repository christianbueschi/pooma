import styled from '@emotion/styled';
import { Flex } from './Flex';

export const Loading: React.FC = () => {
  return (
    <Flex gap={8} css={{ alignItems: 'center' }}>
      <StyledLoadingImage src='/assets/loading.svg' />
    </Flex>
  );
};

const StyledLoadingImage = styled.img`
  animation: rotating 1s linear infinite;
  width: 60px;
  height: 60px;

  @-webkit-keyframes rotating /* Safari and Chrome */ {
    from {
      -webkit-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(360deg);
      -o-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes rotating {
    from {
      -ms-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -ms-transform: rotate(360deg);
      -moz-transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
      -o-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`;
