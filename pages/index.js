import styled from 'styled-components';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PaidIcon from '@mui/icons-material/Paid';
import EventIcon from '@mui/icons-material/Event';
import Image from 'next/image';
import { ethers } from 'ethers';
import CampaignFactory from '../artifacts/contracts/Campaign.sol/CampaignFactory.json'
import { useState, useEffect } from 'react';
import Link from 'next/link'

export default function Index({AllData, HealthData, EducationData,AnimalData}) {
  const [filter, setFilter] = useState(AllData);

  // Client-only date renderer to avoid hydration mismatch
  function DateText({ timestamp }) {
    const [date, setDate] = useState('');
    useEffect(() => {
      setDate(new Date(timestamp * 1000).toLocaleString());
    }, [timestamp]);
    return <Text>{date}</Text>;
  }
  return (
    <HomeWrapper>

      {/* Filter Section */}
      <FilterWrapper>
        <FilterAltIcon style={{fontSize:40}} />
        <Category onClick={() => setFilter(AllData)}>All</Category>
        <Category onClick={() => setFilter(HealthData)}>Health</Category>
        <Category onClick={() => setFilter(EducationData)}>Education</Category>
        <Category onClick={() => setFilter(AnimalData)}>Animal</Category>
      </FilterWrapper>

      {/* Cards Container */}
      <CardsWrapper>

      {/* Card */}
      {filter.map((e) => {
        return (
          <Card key={e.title}>
          <CardImg>
            <Image 
              alt="Crowdfunding dapp"
              layout='fill' 
              src={"https://crowdfunding.infura-ipfs.io/ipfs/" + e.image} 
            />
          </CardImg>
          <Title>
            {e.title}
          </Title>
          <CardData>
            <Text>Owner<AccountBoxIcon /></Text> 
            <Text>{e.owner.slice(0,6)}...{e.owner.slice(39)}</Text>
          </CardData>
          <CardData>
            <Text>Amount<PaidIcon /></Text> 
            <Text>{e.amount} Matic</Text>
          </CardData>
          <CardData>
            <Text><EventIcon /></Text>
            <DateText timestamp={e.timeStamp} />
          </CardData>
          <Link passHref href={'/' + e.address}><Button>
            Go to Campaign
          </Button></Link>
        </Card>
        )
      })}
        {/* Card */}

      </CardsWrapper>
    </HomeWrapper>
  )
}



export async function getStaticProps() {
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
  
  if (!rpcUrl) {
    console.error('NEXT_PUBLIC_RPC_URL is not defined');
    return {
      props: {
        AllData: [],
        HealthData: [],
        EducationData: [],
        AnimalData: []
      },
      revalidate: 10
    };
  }

  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_ADDRESS,
    CampaignFactory.abi,
    provider
  );

  // Get the latest block number and query recent blocks only
  const latestBlock = await provider.getBlockNumber();
  const fromBlock = Math.max(0, latestBlock - 10000); // Last ~10000 blocks

  const getAllCampaigns = contract.filters.campaignCreated();
  const AllCampaigns = await contract.queryFilter(getAllCampaigns, fromBlock, latestBlock);
  const AllData = AllCampaigns.map((e) => {
    return {
      title: e.args.title,
      image: e.args.imgURI,
      owner: e.args.owner,
      timeStamp: parseInt(e.args.timestamp),
      amount: ethers.utils.formatEther(e.args.requiredAmount),
      address: e.args.campaignAddress
    }
  });

  const getHealthCampaigns = contract.filters.campaignCreated(null,null,null,null,null,null,'Health');
  const HealthCampaigns = await contract.queryFilter(getHealthCampaigns, fromBlock, latestBlock);
  const HealthData = HealthCampaigns.map((e) => {
    return {
      title: e.args.title,
      image: e.args.imgURI,
      owner: e.args.owner,
      timeStamp: parseInt(e.args.timestamp),
      amount: ethers.utils.formatEther(e.args.requiredAmount),
      address: e.args.campaignAddress
    }
  });

  const getEducationCampaigns = contract.filters.campaignCreated(null,null,null,null,null,null,'Education');
  const EducationCampaigns = await contract.queryFilter(getEducationCampaigns, fromBlock, latestBlock);
  const EducationData = EducationCampaigns.map((e) => {
    return {
      title: e.args.title,
      image: e.args.imgURI,
      owner: e.args.owner,
      timeStamp: parseInt(e.args.timestamp),
      amount: ethers.utils.formatEther(e.args.requiredAmount),
      address: e.args.campaignAddress
    }
  });

  const getAnimalCampaigns = contract.filters.campaignCreated(null,null,null,null,null,null,'Animal');
  const AnimalCampaigns = await contract.queryFilter(getAnimalCampaigns, fromBlock, latestBlock);
  const AnimalData = AnimalCampaigns.map((e) => {
    return {
      title: e.args.title,
      image: e.args.imgURI,
      owner: e.args.owner,
      timeStamp: parseInt(e.args.timestamp),
      amount: ethers.utils.formatEther(e.args.requiredAmount),
      address: e.args.campaignAddress
    }
  });

  return {
    props: {
      AllData,
      HealthData,
      EducationData,
      AnimalData
    },
    revalidate: 10
  }
  } catch (error) {
    console.error('Error fetching campaigns:', error.message);
    return {
      props: {
        AllData: [],
        HealthData: [],
        EducationData: [],
        AnimalData: []
      },
      revalidate: 10
    };
  }
}






const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px 10px;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 15px 8px;
  }
  
  @media (max-width: 480px) {
    padding: 10px 6px;
  }
`

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 85%;
  max-width: 1200px;
  margin-top: 15px;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  
  @media (max-width: 1200px) {
    width: 95%;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    gap: 8px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    gap: 6px;
  }
`

const Category = styled.div`
  padding: 12px 20px;
  background-color: ${(props) => props.theme.bgDiv};
  border-radius: 10px;
  font-family: 'Poppins';
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 44px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  user-select: none;
  border: 2px solid transparent;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    background: linear-gradient(135deg, #00b712 0%, #5aff15 100%);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 183, 18, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 1024px) {
    padding: 10px 16px;
    font-size: 12px;
  }
  
  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 11px;
    min-height: 40px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 10px;
    min-height: 36px;
  }
`

const CardsWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 85%;
  max-width: 1400px;
  margin-top: 25px;
  gap: 25px;
  
  @media (max-width: 1200px) {
    width: 95%;
    gap: 20px;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    gap: 15px;
    padding: 0 8px;
    box-sizing: border-box;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    gap: 10px;
    padding: 0 6px;
    box-sizing: border-box;
  }
`

const Card = styled.div`
  flex: 0 1 calc(33.333% - 17px);
  min-width: 250px;
  margin-top: 0;
  background-color: ${(props) => props.theme.bgDiv};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid rgba(0, 183, 18, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;

  &:hover{
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 183, 18, 0.15);
    border-color: rgba(0, 183, 18, 0.3);
  }
  
  @media (max-width: 1200px) {
    flex: 0 1 calc(50% - 13px);
  }
  
  @media (max-width: 768px) {
    flex: 0 1 100%;
    max-width: 100%;
    min-width: unset;
  }
`
const CardImg = styled.div`
  position: relative;
  height: 120px;
  width: 100%;
`
const Title = styled.h2`
  font-family: 'Roboto';
  font-size: 16px;
  margin: 0;
  background-color: ${(props) => props.theme.bgSubDiv};
  padding: 12px;
  cursor: pointer;
  font-weight: 700;
  word-break: break-word;
  border-bottom: 2px solid rgba(0, 183, 18, 0.2);
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px;
  }
  
  @media (max-width: 480px) {
    font-size: 13px;
    padding: 8px;
  }
`
const CardData = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0;
  background-color: ${(props) => props.theme.bgSubDiv};
  padding: 8px;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
  gap: 8px;
  
  @media (max-width: 480px) {
    padding: 6px;
  }
  `
const Text = styled.p`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  font-family: 'Roboto';
  font-size: 13px;
  font-weight: 600;
  gap: 4px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 11px;
  }
  
  svg {
    min-width: 16px;
  }
`
const Button = styled.button`
  padding: 12px;
  text-align: center;
  width: 100%;
  background: linear-gradient(135deg, #00b712 0%, #5aff15 100%);
  border: none;
  cursor: pointer;
  font-family: 'Roboto';
  text-transform: uppercase;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 183, 18, 0.2);
  letter-spacing: 0.5px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 183, 18, 0.35);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 10px;
  }
  
  @media (max-width: 480px) {
    font-size: 11px;
    padding: 10px;
  }
` 