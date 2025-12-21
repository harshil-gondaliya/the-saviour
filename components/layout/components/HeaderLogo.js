import styled from "styled-components";
import Image from "next/image";

const HeaderLogo = () => {
  return (
    <LogoWrapper>
      <Image 
        src="/logo.svg" 
        alt="The Saviour" 
        width={180} 
        height={60}
        priority
      />
    </LogoWrapper>
  )
}

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export default HeaderLogo
