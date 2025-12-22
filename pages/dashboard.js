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
`
const CardsWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 32px;
  width: 90%;
  margin-top: 25px;
`;
const Card = styled.div`
  flex: 1 1 300px;
  max-width: 350px;
  min-width: 260px;
  margin-top: 20px;
  background-color: ${(props) => props.theme.bgDiv};
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  transition: transform 0.3s;

  &:hover{
    transform: translateY(-10px) scale(1.03);
  }
`;
const CardImg = styled.div`
  position: relative;
  height: 120px;
  width: 100%;
`
const Title = styled.h2`
  font-family: 'Roboto';
  font-size: 18px;
  margin: 2px 0px;
  background-color: ${(props) => props.theme.bgSubDiv};
  padding: 5px;
  cursor: pointer;
  font-weight: normal;
`
const CardData = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2px 0px;
  background-color: ${(props) => props.theme.bgSubDiv};
  padding: 5px;
  cursor: pointer;
  `
const Text = styled.p`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  font-family: 'Roboto';
  font-size: 18px;
  font-weight: bold;
`
const Button = styled.button`
  padding: 8px;
  text-align: center;
  width: 100%;
  background-color:#00b712 ;
  background-image:
      linear-gradient(180deg, #00b712 0%, #5aff15 80%); 
  border: none;
  cursor: pointer;
  font-family: 'Roboto';
  text-transform: uppercase;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
`;