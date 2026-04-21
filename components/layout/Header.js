import styled from 'styled-components';
import HeaderLogo from './components/HeaderLogo';
import HeaderNav from './components/HeaderNav';
import HeaderRight from './components/HeaderRight';

const Header = () => {
  return (
    <HeaderWrapper>
      <HeaderLogo />
      <HeaderNav />
      <HeaderRight />
    </HeaderWrapper>
  )
}

const HeaderWrapper = styled.div`
  min-height: 74px;
  width: 100%;
  background-color: ${(props) => props.theme.bgDiv};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
  gap: 16px;
  position: relative;
  z-index: 20;
  flex-wrap: nowrap;
  
  @media (max-width: 1024px) {
    min-height: 82px;
    padding: 12px 16px;
    gap: 10px 12px;
    flex-wrap: wrap;
  }
  
  @media (max-width: 768px) {
    min-height: 78px;
    padding: 10px 12px;
    gap: 8px 10px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 10px;
    min-height: 72px;
    gap: 6px;
  }
`;

export default Header
