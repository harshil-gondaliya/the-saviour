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
  height: 60px;
  width: 100%;
  background-color: ${(props) => props.theme.bgDiv};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    height: auto;
    min-height: 60px;
    padding: 10px 15px;
    flex-wrap: wrap;
  }
`;

export default Header
