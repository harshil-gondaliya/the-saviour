import styled from "styled-components";
import Image from "next/image";
import {ethers} from 'ethers';
import CampaignFactory from '../artifacts/contracts/Campaign.sol/CampaignFactory.json'
import Campaign from '../artifacts/contracts/Campaign.sol/Campaign.json'
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';

// Client-only date renderer to avoid hydration mismatch
function DateText({ timestamp }) {
  const [date, setDate] = useState('');
  useEffect(() => {
    setDate(new Date(timestamp * 1000).toLocaleString());
  }, [timestamp]);
  return <DonationData>{date}</DonationData>;
}


export default function Detail({Data, DonationsData}) {
  const [mydonations, setMydonations] = useState([]);
  const [story, setStory] = useState('');
  const [amount, setAmount] = useState();
  const [change, setChange] = useState(false);

  useEffect(() => {
    const Request = async () => {
      try {
        let storyData;
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
        Data.address,
        Campaign.abi,
        provider
      );

      // Await the fetch and text conversion
      const res = await fetch('https://crowdfunding.infura-ipfs.io/ipfs/' + Data.storyUrl);
      storyData = await res.text();

      // Get the latest block number and query recent blocks only
      const latestBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, latestBlock - 10000); // Last ~10000 blocks

      const MyDonations = contract.filters.donated(Address);
      const MyAllDonations = await contract.queryFilter(MyDonations, fromBlock, latestBlock);

      setMydonations(MyAllDonations.map((e) => {
        return {
          donar: e.args.donar,
          amount: ethers.utils.formatEther(e.args.amount),
          timestamp : parseInt(e.args.timestamp)
        }
      }));

      setStory(storyData);
      } catch (error) {
        console.error('Error loading campaign details:', error);
      }
    }

    Request();
  }, [change, Data.address, Data.storyUrl])


  const DonateFunds = async () => {
    try {
      // Check if already connected, otherwise request connection
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length === 0) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();

      // Prevent owner from donating to their own campaign. Prompt to switch account.
      if (signerAddress.toLowerCase() === Data.owner.toLowerCase()) {
        toast.warn('You are the owner of this campaign. Please switch to a different account to donate.');
        return;
      }

      const contract = new ethers.Contract(Data.address, Campaign.abi, signer);
      const transaction = await contract.donate({value: ethers.utils.parseEther(amount)});
      await transaction.wait();

      setChange(true);
      setAmount('');

    } catch (error) {
      console.log(error);
      toast.error('Donation failed: ' + (error?.message || error));
    }

  }

  return (
    <DetailWrapper>
      <LeftContainer>
        <ImageSection>
          <Image
            alt="crowdfunding dapp"
            layout="fill"
            src={
              "https://crowdfunding.infura-ipfs.io/ipfs/" + Data.image
            }
          />
        </ImageSection>
        <Text>
          {story}
        </Text>
      </LeftContainer>
      <RightContainer>
        <Title>{Data.title}</Title>
        <DonateSection>
          <Input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="Enter Amount To Donate" />
          <Donate onClick={DonateFunds}>Donate</Donate>
          <SmallButton onClick={async () => {
            try {
              await window.ethereum.request({ method: 'eth_requestAccounts' });
              const prov = new ethers.providers.Web3Provider(window.ethereum);
              const s = prov.getSigner();
              const addr = await s.getAddress();
              toast.info('Connected account: ' + addr);
            } catch (err) {
              console.error(err);
              toast.error('Failed to switch/connect account');
            }
          }}>Switch Account</SmallButton>
        </DonateSection>
        <FundsData>
          <Funds>
            <FundText>Required Amount</FundText>
            <FundText>{Data.requiredAmount} Matic</FundText>
          </Funds>
          <Funds>
            <FundText>Received Amount</FundText>
            <FundText>{Data.receivedAmount} Matic</FundText>
          </Funds>
        </FundsData>
        <Donated>
          <LiveDonation>
            <DonationTitle>Recent Donation</DonationTitle>
              {DonationsData.map((e) => {
              return (
                <Donation key={e.timestamp}>
                <DonationData>{e.donar.slice(0,6)}...{e.donar.slice(39)}</DonationData>
                <DonationData>{e.amount} Matic</DonationData>
                <DateText timestamp={e.timestamp} />
              </Donation>
              )
            })
            }
          </LiveDonation>
          <MyDonation>
            <DonationTitle>My Past Donation</DonationTitle>
            {mydonations.map((e) => {
              return (
                <Donation key={e.timestamp}>
                <DonationData>{e.donar.slice(0,6)}...{e.donar.slice(39)}</DonationData>
                <DonationData>{e.amount} Matic</DonationData>
                <DateText timestamp={e.timestamp} />
              </Donation>
              )
            })
            }
          </MyDonation>
        </Donated>
      </RightContainer>
    </DetailWrapper>
  );
}


export async function getStaticPaths() {
  try {
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
    const contractAddress = process.env.NEXT_PUBLIC_ADDRESS;
    
    if (!rpcUrl || !contractAddress) {
      console.error('RPC URL or Contract Address not configured');
      return {
        paths: [],
        fallback: "blocking"
      };
    }

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(
      contractAddress,
      CampaignFactory.abi,
      provider
    );

    // Get the latest block number and query recent blocks only
    const latestBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, latestBlock - 10000); // Last ~10000 blocks

    const getAllCampaigns = contract.filters.campaignCreated();
    const AllCampaigns = await contract.queryFilter(getAllCampaigns, fromBlock, latestBlock);

    return {
      paths: AllCampaigns.map((e) => ({
          params: {
            address: e.args.campaignAddress.toString(),
          }
      })),
      fallback: "blocking"
    };
  } catch (error) {
    console.error('Error in getStaticPaths:', error.message);
    return {
      paths: [],
      fallback: "blocking"
    };
  }
}

export async function getStaticProps(context) {
  // Prevent treating favicon.ico or other files as addresses
  const address = context.params.address;
  if (!address || address.includes('.') || !ethers.utils.isAddress(address)) {
    return {
      notFound: true,
    };
  }

  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
  if (!rpcUrl) {
    console.error('RPC URL not configured');
    return {
      notFound: true,
    };
  }

  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(
      context.params.address,
      Campaign.abi,
      provider
    );

  const title = await contract.title();
  const requiredAmount = await contract.requiredAmount();
  const image = await contract.image();
  const storyUrl = await contract.story();
  const owner = await contract.owner();
  const receivedAmount = await contract.receivedAmount();

  // Get the latest block number and query recent blocks only
  const latestBlock = await provider.getBlockNumber();
  const fromBlock = Math.max(0, latestBlock - 10000); // Last ~10000 blocks

  const Donations = contract.filters.donated();
  const AllDonations = await contract.queryFilter(Donations, fromBlock, latestBlock);


  const Data = {
      address: context.params.address,
      title, 
      requiredAmount: ethers.utils.formatEther(requiredAmount), 
      image, 
      receivedAmount: ethers.utils.formatEther(receivedAmount), 
      storyUrl, 
      owner,
  }

  const DonationsData =  AllDonations.map((e) => {
    return {
      donar: e.args.donar,
      amount: ethers.utils.formatEther(e.args.amount),
      timestamp : parseInt(e.args.timestamp)
  }});

  return {
    props: {
      Data,
      DonationsData
    },
    revalidate: 10
  }
  } catch (error) {
    console.error('Error in getStaticProps for campaign:', error.message);
    return {
      notFound: true,
    };
  }
}




const DetailWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  width: 98%;
`;
const LeftContainer = styled.div`
  width: 45%;
`;
const RightContainer = styled.div`
  width: 50%;
`;
const ImageSection = styled.div`
  width: 100%;
  position: relative;
  height: 350px;
`;
const Text = styled.p`
  font-family: "Roboto";
  font-size: large;
  color: ${(props) => props.theme.color};
  text-align: justify;
`;
const Title = styled.h1`
  padding: 0;
  margin: 0;
  font-family: "Poppins";
  font-size: x-large;
  color: ${(props) => props.theme.color};
`;
const DonateSection = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;
const Input = styled.input`
  padding: 8px 15px;
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: large;
  width: 40%;
  height: 40px;
`;
const Donate = styled.button`
  display: flex;
  justify-content: center;
  width: 40%;
  padding: 15px;
  color: white;
  background-color: #00b712;
  background-image: linear-gradient(180deg, #00b712 0%, #5aff15 80%);
  border: none;
  cursor: pointer;
  font-weight: bold;
  border-radius: 8px;
  font-size: large;
`;
const FundsData = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;
const Funds = styled.div`
  width: 45%;
  background-color: ${(props) => props.theme.bgDiv};
  padding: 8px;
  border-radius: 8px;
  text-align: center;
`;
const FundText = styled.p`
  margin: 2px;
  padding: 0;
  font-family: "Poppins";
  font-size: normal;
`;
const Donated = styled.div`
  height: 280px;
  margin-top: 15px;
  background-color: ${(props) => props.theme.bgDiv};
`;
const LiveDonation = styled.div`
  height: 65%;
  overflow-y: auto;
`;
const MyDonation = styled.div`
  height: 35%;
  overflow-y: auto;
`;
const DonationTitle = styled.div`
  font-family: "Roboto";
  font-size: x-small;
  text-transform: uppercase;
  padding: 4px;
  text-align: center;
  background-color: #4cd137;
`;
const Donation = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  background-color: ${(props) => props.theme.bgSubDiv};
  padding: 4px 8px;
`;
const DonationData = styled.p`
  color: ${(props) => props.theme.color};
  font-family: "Roboto";
  font-size: large;
  margin: 0;
  padding: 0;
`;
const SmallButton = styled.button`
  margin-left: 8px;
  padding: 8px 12px;
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  border: 1px solid ${(props) => props.theme.bgSubDiv};
  border-radius: 8px;
  cursor: pointer;
`;