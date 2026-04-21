import styled from 'styled-components';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import {App} from '../Layout';
import { useContext } from 'react';
import Wallet from './Wallet';


const HeaderRight = () => {
  const ThemeToggler = useContext(App);

  return (
    <HeaderRightWrapper>
      <Wallet />
      <ThemeToggle onClick={ThemeToggler.changeTheme}>
      {ThemeToggler.theme === 'light' ? <DarkModeIcon /> : <Brightness7Icon />}
      </ThemeToggle>
    </HeaderRightWrapper>
  )
}

const HeaderRightWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  flex-shrink: 0;
  position: relative;
  z-index: 6;
  
  @media (max-width: 1024px) {
    order: 2;
    margin-left: auto;
    justify-self: end;
    gap: 6px;
  }
  
  @media (max-width: 768px) {
    gap: 4px;
  }
  
  @media (max-width: 480px) {
    order: 2;
    width: 100%;
    justify-content: center;
    gap: 3px;
  }
`

const ThemeToggle = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.bgDiv};
  height: 100%;
  border: 1px solid rgba(0, 183, 18, 0.25);
  padding: 6px;
  min-width: 44px;
  width: 44px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${(props) => props.theme.color};
  
  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }
  
  svg {
    font-size: 20px;
  }
  
  @media (max-width: 1024px) {
    width: 40px;
    padding: 5px;
    
    svg {
      font-size: 18px;
    }
  }
  
  @media (max-width: 768px) {
    width: 36px;
    padding: 4px;
    
    svg {
      font-size: 16px;
    }
  }
  
  @media (max-width: 480px) {
    width: 32px;
    padding: 3px;
    
    svg {
      font-size: 14px;
    }
  }
`

export default HeaderRight