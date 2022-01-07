import styled from '@emotion/styled';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { api } from './api';
import { useMember, useTeam } from './apiHooks';
import { Loading } from './elements/Loading';

export const Sidebar: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [cardMode, setCardMode] = useState<string>('fibonacci');

  const [team, teamIsLoading] = useTeam();
  const [member, memberisLoading] = useMember();

  const isLoading = teamIsLoading && memberisLoading;

  const onResetUser = () => {
    // this.$store.dispatch("removeUser", { team: this.team, user: this.user });
    // this.$router.push({ path: "/" });
  };

  const onToggleNav = () => {
    setIsActive(!isActive);
  };

  const onChangeCardMode = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (!team) return;

    setCardMode(ev.currentTarget.value);

    await api.updateTeam(team.id, { cardMode: ev.target.value });
  };

  const router = useRouter();

  return (
    <aside>
      <SidebarToggle onClick={onToggleNav} isActive={isActive}>
        <span></span>
        <span></span>
      </SidebarToggle>

      <SidebarContainer isOpen={isActive}>
        <SidebarHeader>
          <SidebarSection>
            <SidebarLabel>Team</SidebarLabel>
            <SidebarTitel isSet={!!team}>
              {team ? team.name : 'No team set'}
            </SidebarTitel>
          </SidebarSection>
          <SidebarSection>
            <SidebarLabel>User</SidebarLabel>
            <SidebarTitel isSet={!!member}>
              {member ? member.name : 'No user set'}
            </SidebarTitel>
          </SidebarSection>
          {team && (
            <SidebarSection>
              <SidebarLabel>Card Mode</SidebarLabel>
              <SidebarInputLabel htmlFor='fibonacci'>
                <input
                  type='radio'
                  name='cardMode'
                  id='fibonacci'
                  value='fibonacci'
                  checked={cardMode === 'fibonacci'}
                  onChange={onChangeCardMode}
                />
                Fibonacci
              </SidebarInputLabel>
              <SidebarInputLabel htmlFor='tshirt'>
                <input
                  type='radio'
                  name='cardMode'
                  id='tshirt'
                  value='tshirt'
                  checked={cardMode === 'tshirt'}
                  onChange={onChangeCardMode}
                />
                T-Shirt
              </SidebarInputLabel>
            </SidebarSection>
          )}
        </SidebarHeader>
        <nav>
          <Link href='/' passHref>
            <SidebarNavLink isActive={router.pathname === '/'}>
              <i className='fas fa-home'></i>
              Home
            </SidebarNavLink>
          </Link>
          {team && (
            <>
              <Link
                href={{
                  pathname: `/[teamId]/dashboard`,
                  query: { teamId: team.id },
                }}
                passHref
              >
                <SidebarNavLink isActive={router.pathname === '/dashboard'}>
                  <i className='fas fa-tachometer-alt'></i>
                  Dashboard
                </SidebarNavLink>
              </Link>
              <Link
                href={{
                  pathname: `/[teamId]/play`,
                  query: { teamId: team.id },
                }}
                passHref
              >
                <SidebarNavLink isActive={router.pathname === '/play'}>
                  <i className='fas fa-play'></i>
                  Play
                </SidebarNavLink>
              </Link>
            </>
          )}
          {(member || team) && (
            <button onClick={onResetUser}>
              <>
                <i className='fas fa-sign-out-alt'></i>
                Sign Out
              </>
            </button>
          )}
        </nav>

        <SidebarContactLink href='mailto:hello@pooma.app'>
          hello@pooma.app
        </SidebarContactLink>
      </SidebarContainer>
    </aside>
  );
};

const SidebarToggle = styled.button<{ isActive: boolean }>`
  position: absolute;
  right: 0;
  top: 27px;
  z-index: 100;
  width: 50px;
  height: 35px;
  border: none;
  background: ${({ theme }) => theme.colors.blue};
  box-shadow: 0px 5px 30px -5px rgb(0, 0, 0);
  border-radius: 8px 0 0 8px;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  span {
    position: absolute;
    width: 20px;
    height: 3px;
    background-color: white;
    border-radius: 5px;
    transition: all 0.25s ease-in-out;

    &:first-child {
      top: 12px;
      left: 10px;
    }

    &:last-child {
      bottom: 12px;
      left: 20px;
    }
  }

  ${({ isActive }) =>
    isActive &&
    `
      background: transparent;

      span {
        &:first-child {
          top: 17px;
          left: 17px;
          transform: rotate(45deg);
        }

        &:last-child {
          top: 17px;
          left: 17px;
          transform: rotate(-45deg);
        }
      }

  `}

  @media (min-width: 880px) {
    display: none;
  }
`;

const SidebarContainer = styled.section<{ isOpen: boolean }>`
  position: fixed;
  background: ${({ theme }) => theme.colors.blue};
  right: ${({ isOpen }) => (isOpen ? 0 : '-300px')};
  top: 0;
  width: 250px;
  height: 100vh;
  padding: 50px 60px 50px 40px;
  z-index: 99;
  box-shadow: 0px 5px 30px -5px rgb(0, 0, 0);

  transition: right 0.25s ease-in-out;

  @media (min-width: 880px) {
    right: 0;
  }
`;

const SidebarHeader = styled.header`
  margin-bottom: 4rem;
`;

const SidebarSection = styled.section`
  margin-bottom: 2rem;
`;

const SidebarLabel = styled.h6`
  color: white;
  font-size: 14px;
  text-align: left;
  font-weight: 300;
  margin: 0;
  padding-bottom: 2px;
  border-bottom: 1px solid white;
`;

const SidebarInputLabel = styled.label`
  display: block;
  color: white;
  cursor: pointer;

  &:first-of-type {
    margin-top: 0.5rem;
  }
`;

const SidebarTitel = styled.h2<{ isSet: boolean }>`
  color: white;
  font-size: ${({ isSet }) => (isSet ? '26px' : '14px')};
  text-align: left;
  font-weight: 300;
  margin: ${({ isSet }) => (isSet ? 0 : '0.5rem')};
  font-style: ${({ isSet }) => (isSet ? 'normal' : 'italic')}; ;
`;

const SidebarNavLink = styled.a<{ isActive: boolean }>`
  display: block;
  margin-bottom: 0.5rem;
  text-decoration: none;
  color: ${({ isActive, theme }) => (isActive ? theme.colors.green : 'white')};
  cursor: pointer;
  position: relative;
  padding-left: 1.5rem;

  i {
    position: absolute;
    left: 0;
  }
`;

const SidebarContactLink = styled(Link)`
  color: white;
  position: absolute;
  bottom: 20px;
`;
