import styled from 'styled-components';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PaidIcon from '@mui/icons-material/Paid';
import EventIcon from '@mui/icons-material/Event';
import { ethers } from 'ethers';
import CampaignFactory from '../artifacts/contracts/Campaign.sol/CampaignFactory.json'
import { useEffect, useState } from 'react';
import Link from 'next/link';

// Client-only date component to avoid hydration errors
function DateText({ timestamp }) {
  const [date, setDate] = useState("");
  useEffect(() => {
    setDate(new Date(timestamp * 1000).toLocaleString());
  }, [timestamp]);
  return <Text>{date}</Text>;
}

export default function Dashboard() {
  const [campaignsData, setCampaignsData] = useState([]);

  useEffect(() => {
    const Request = async () => {
      try {
        const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
        if (!rpcUrl) {
          console.error('RPC URL not configured');
          return;
        }

        // Check if already connected, otherwise request connection
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length === 0) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        }
        const Web3provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = Web3provider.getSigner();
        const Address = await signer.getAddress();

        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_ADDRESS,
        CampaignFactory.abi,
        provider
      );
  
      // Get the latest block number and query recent blocks only
      const latestBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, latestBlock - 10000); // Last ~10000 blocks

      const getAllCampaigns = contract.filters.campaignCreated(null, null, Address);
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
      })  
      setCampaignsData(AllData)
      } catch (error) {
        console.error('Error loading dashboard:', error);
      }
    }
    Request();
  }, [])

  return (
    <HomeWrapper>

      {/* Cards Container */}
      <CardsWrapper>

      {/* Card */}
      {campaignsData.map((e) => {
        return (
          <Card key={e.title}>
            <Title>
              {e.title}
            </Title>
            <CardData>
              <Text>Owner<AccountBoxIcon /></Text> 
              <Text>{e.owner.slice(0,6)}...{e.owner.slice(39)}</Text>
            </CardData>
            <CardData>
              <Text>Amount<PaidIcon /></Text> 
              <Text>{Number(e.amount).toLocaleString(undefined, { maximumFractionDigits: 3 })} Matic</Text>
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
      </CardsWrapper>
    </HomeWrapper>
  )
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
const CardsWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 25px;
  width: 85%;
  max-width: 1400px;
  margin-top: 25px;
  
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
`;
const Card = styled.div`
  flex: 0 1 calc(33.333% - 17px);
  min-width: 240px;
  margin-top: 0;
  background-color: ${(props) => props.theme.bgDiv};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  border: 1px solid rgba(0, 183, 18, 0.1);

  &:hover{
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 183, 18, 0.15);
    border-color: rgba(0, 183, 18, 0.3);
  }
  
  @media (max-width: 1200px) {
    flex: 0 1 calc(50% - 13px);
    max-width: 100%;
  }
  
  @media (max-width: 768px) {
    flex: 0 1 100%;
    max-width: 100%;
  }
`;
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
  }
  
  @media (max-width: 480px) {
    font-size: 13px;
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
`;