import styled from "styled-components";
import Link from "next/link";

const HeaderLogo = () => {
  return (
    <LogoWrapper href="/">The Saviour</LogoWrapper>
  )
}

const LogoWrapper = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  flex-grow: 0;
  font-family: 'Poppins';
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-size: 1.2rem;
  color: ${(props) => props.theme.color};
  padding: 10px 14px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(0, 183, 18, 0.14), rgba(90, 255, 21, 0.12));
  border: 1px solid rgba(0, 183, 18, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  pointer-events: auto;
  position: relative;
  z-index: 4;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0, 183, 18, 0.2);
  }
  
  @media (max-width: 1024px) {
    font-size: 1.1rem;
    padding: 9px 12px;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    letter-spacing: 0.8px;
    padding: 8px 10px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
    font-size: 0.95rem;
    letter-spacing: 0.6px;
  }
`;

export default HeaderLogo
