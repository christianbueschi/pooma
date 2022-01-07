import styled from '@emotion/styled';
import { NextPage } from 'next';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Tabs } from '../components/Tabs';

const Home: NextPage = () => {
  return (
    <>
      <Header />

      <section>
        <StyledText>
          <span>Scrum Planning Poker at it&apos;s finest!</span>
          <span>Virtually estimate your team stories with ease 🎉</span>
        </StyledText>
      </section>

      <Tabs />

      <Sidebar />
    </>
  );
};

export default Home;

const StyledText = styled.p`
  color: ${({ theme }) => theme.colors.grey};
  margin: 0 auto;
  font-size: 20px;
  margin-bottom: 4rem;
  text-align: center;

  @media (min-width: 672px) {
    span {
      display: block;
    }
  }
`;
