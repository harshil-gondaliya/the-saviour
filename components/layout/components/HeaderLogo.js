import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

const HeaderLogo = () => {
  return (
    <Link href="/" passHref>
      <LogoWrapper>
        <Image 
          src="/logo.svg" 
          alt="The Saviour" 
          width={180} 
          height={60}
          priority
          style={{ objectFit: 'contain' }}
        />
      </LogoWrapper>
    </Link>
  )
}

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  
  @media (max-width: 768px) {
    img {
      width: 140px !important;
      height: 48px !important;
    }
  }
  
  @media (max-width: 480px) {
    img {
      width: 120px !important;
      height: 40px !important;
    }
  }
`;

export default HeaderLogo
