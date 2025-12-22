'use client';

import styled from 'styled-components';
import { useRouter } from 'next/router';
import Link from 'next/link';

const HeaderNav = () => {
  const Router = useRouter();

  return (
    <HeaderNavWrapper>
      <Link passHref href={'/'}><HeaderNavLinks $active={Router.pathname == "/" ? true : false} >
        Campaigns
      </HeaderNavLinks></Link>
      <Link passHref href={'/createcampaign'}><HeaderNavLinks $active={Router.pathname == "/createcampaign" ? true : false} >
        Create Campaign
      </HeaderNavLinks></Link>
      <Link passHref href={'/dashboard'}><HeaderNavLinks $active={Router.pathname == "/dashboard" ? true : false} >
        Dashboard
      </HeaderNavLinks></Link>
    </HeaderNavWrapper>
  )
}

const HeaderNavWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.bgDiv};
  padding: 6px;
  height: 50%;
  border-radius: 10px;
  
  @media (max-width: 768px) {
    width: 100%;
    order: 3;
    margin-top: 10px;
    justify-content: space-around;
    padding: 8px 4px;
  }
`

const HeaderNavLinks = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.$active ? props.theme.bgSubDiv : props.theme.bgDiv };
  height: 100%;
  font-family: 'Roboto';
  margin: 5px;
  border-radius: 10px;
  padding: 0 5px 0 5px;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: bold;
  font-size: small;
  
  @media (max-width: 768px) {
    font-size: xx-small;
    margin: 2px;
    padding: 4px 6px;
  }
  
  @media (max-width: 480px) {
    font-size: 9px;
    margin: 1px;
    padding: 3px 4px;
  }
`

export default HeaderNav