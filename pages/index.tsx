import styled from '@emotion/styled';
import { NextPage } from 'next';
import { Header } from '../components/Header';
import { Tabs } from '../components/Tabs';
import { MainTitle, LogoTitle } from '../components/elements/Title';
import { Flex } from '../components/elements/Flex';
import { BodyBig } from '../components/elements/Body';

const Home: NextPage = () => {
  return (
    <>
      <Header isHome />

      <Flex css={{ justifyContent: 'center', alignItems: 'center' }} gap={48}>
        <MainTitle>POOMA</MainTitle>
        <BodyBig css={{ textAlign: 'center' }}>
          Scrum Planning Poker at it&apos;s finest!
          <br />
          Virtually estimate your team stories with ease 🎉
        </BodyBig>
        <Tabs />
      </Flex>
    </>
  );
};

export default Home;
