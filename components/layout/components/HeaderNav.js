'use client';

import styled from 'styled-components';
import { useRouter } from 'next/router';
import Link from 'next/link';

const HeaderNav = () => {
  const Router = useRouter();

  return (
    <HeaderNavWrapper>
      <HeaderNavLink href={'/'} $active={Router.pathname == "/"}>
        Campaigns
      </HeaderNavLink>
      <HeaderNavLink href={'/createcampaign'} $active={Router.pathname == "/createcampaign"}>
        Create Campaign
      </HeaderNavLink>
      <HeaderNavLink href={'/dashboard'} $active={Router.pathname == "/dashboard"}>
        Dashboard
      </HeaderNavLink>
    </HeaderNavWrapper>
  )
}

const HeaderNavWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.bgDiv};
  padding: 6px;
  min-height: 52px;
  border-radius: 10px;
  gap: 4px;
  flex: 1;
  min-width: 0;
  max-width: 520px;
  position: relative;
  z-index: 5;
  pointer-events: auto;
  
  @media (max-width: 1024px) {
    order: 3;
    max-width: none;
    width: 100%;
    justify-content: space-between;
  }
  
  @media (max-width: 768px) {
    min-height: 48px;
    padding: 6px 4px;
    gap: 2px;
  }
  
  @media (max-width: 480px) {
    padding: 4px 2px;
  }
`

const HeaderNavLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.$active ? props.theme.bgSubDiv : props.theme.bgDiv };
  min-height: 40px;
  font-family: 'Roboto';
  margin: 0;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 12px;
  white-space: nowrap;
  text-decoration: none;
  transition: all 0.25s ease;
  pointer-events: auto;
  position: relative;
  z-index: 6;
  border: 1px solid ${(props) => props.$active ? 'rgba(0, 183, 18, 0.35)' : 'transparent'};
  
  &:hover {
    opacity: 1;
    background: ${(props) => props.$active ? props.theme.bgSubDiv : 'rgba(0, 183, 18, 0.12)'};
    transform: translateY(-2px);
  }
  
  @media (max-width: 1024px) {
    font-size: 11px;
    padding: 7px 10px;
  }
  
  @media (max-width: 768px) {
    font-size: 10px;
    padding: 6px 7px;
    min-height: 38px;
    flex: 1;
  }
  
  @media (max-width: 480px) {
    font-size: 9px;
    padding: 5px 4px;
  }
`

export default HeaderNav