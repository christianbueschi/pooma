import styled from '@emotion/styled';
import { NextPage } from 'next';
import Link from 'next/link';
import { useMember, useTeam } from '../../components/apiHooks';
import { Cards } from '../../components/Cards';
import { Loading } from '../../components/elements/Loading';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';

const Play: NextPage = () => {
  const [team, teamIsLoading] = useTeam();
  const [member, memberIsLoading] = useMember();

  const isLoading = teamIsLoading && memberIsLoading;

  return (
    <div>
      <Header />

      {isLoading ? (
        <Loading />
      ) : (
        member && team && <Cards member={member} team={team} />
      )}

      <Sidebar />
      {!member && !isLoading && (
        <StyledLink>
          <p>You have not yet joined a team.</p>
          <Link href='home'>Join Team</Link>
        </StyledLink>
      )}
    </div>
  );
};

export default Play;

const StyledLink = styled.div`
  text-align: center;
  p {
    margin-bottom: 1rem;
  }
`;
