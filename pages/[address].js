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
      // ✅ Validate input amount
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        toast.error('Please enter a valid donation amount greater than 0');
        return;
      }

      // Check if already connected, otherwise request connection
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length === 0) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      
      // ✅ Validate network is Sepolia (chainId: 11155111)
      if (network.chainId !== 11155111) {
        toast.error(`Wrong network! Please switch to Sepolia (chainId: 11155111). Currently on: ${network.name || network.chainId}`);
        return;
      }

      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();

      // Prevent owner from donating to their own campaign. Prompt to switch account.
      if (signerAddress.toLowerCase() === Data.owner.toLowerCase()) {
        toast.warn('You are the owner of this campaign. Please switch to a different account to donate.');
        return;
      }

      // ✅ Check sufficient balance before sending
      const balance = await provider.getBalance(signerAddress);
      const donationAmount = ethers.utils.parseEther(amount);
      if (balance.lt(donationAmount)) {
        toast.error(`Insufficient balance! You have ${ethers.utils.formatEther(balance)} ETH`);
        return;
      }

      const contract = new ethers.Contract(Data.address, Campaign.abi, signer);
      
      // ✅ Better error handling with detailed logging
      console.log('Sending donation transaction...', {
        contractAddress: Data.address,
        donationAmount: amount,
        signerAddress,
        network: network.name
      });
      
      const transaction = await contract.donate({value: donationAmount});
      toast.info(`Transaction sent: ${transaction.hash}`);
      
      await transaction.wait();
      
      toast.success('Donation successful! 🎉');
      setChange(true);
      setAmount('');

    } catch (error) {
      console.error('Donation error:', error);
      
      // ✅ Detailed error messages
      let errorMsg = 'Donation failed';
      
      if (error?.code === 'INSUFFICIENT_FUNDS') {
        errorMsg = 'Insufficient ETH balance';
      } else if (error?.reason === 'required amount fullfilled') {
        errorMsg = 'Campaign funding goal already reached';
      } else if (error?.reason?.includes('transfer failed')) {
        errorMsg = 'Transfer failed - check contract owner address';
      } else if (error?.message?.includes('user rejected')) {
        errorMsg = 'Transaction rejected by user';
      } else if (error?.message?.includes('network')) {
        errorMsg = 'Network error - check your RPC connection';
      } else {
        errorMsg = error?.reason || error?.message || 'Unknown error occurred';
      }
      
      toast.error(errorMsg);
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
  width: 100%;
  gap: 20px;
  box-sizing: border-box;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    padding: 15px;
    gap: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    gap: 10px;
  }
`;

const LeftContainer = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const RightContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 1024px) {
    width: 100%;
  }
`;
const ImageSection = styled.div`
  width: 100%;
  position: relative;
  height: 350px;
  
  @media (max-width: 768px) {
    height: 250px;
  }
  
  @media (max-width: 480px) {
    height: 200px;
  }
`;

const Text = styled.p`
  font-family: "Roboto";
  font-size: 1rem;
  color: ${(props) => props.theme.color};
  text-align: justify;
  line-height: 1.6;
  word-break: break-word;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const Title = styled.h1`
  padding: 0;
  margin: 0 0 15px 0;
  font-family: "Poppins";
  font-size: 1.8rem;
  color: ${(props) => props.theme.color};
  word-break: break-word;
  
  @media (max-width: 1024px) {
    font-size: 1.6rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;
const DonateSection = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  margin-top: 15px;
  gap: 12px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Input = styled.input`
  padding: 12px 14px;
  background-color: ${(props) => props.theme.bgSubDiv};
  color: ${(props) => props.theme.color};
  border: 2px solid ${(props) => props.theme.bgDiv};
  border-radius: 10px;
  outline: none;
  font-size: 1rem;
  width: 40%;
  min-height: 48px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  box-sizing: border-box;
  
  &:focus {
    border-color: #00b712;
    box-shadow: 0 0 0 3px rgba(0, 183, 18, 0.1);
    background-color: ${(props) => props.theme.bgSubDiv};
  }
  
  &:hover {
    border-color: rgba(0, 183, 18, 0.5);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    font-size: 16px;
    padding: 11px 12px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    font-size: 16px;
  }
`;

const Donate = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40%;
  padding: 14px 24px;
  color: white;
  background: linear-gradient(135deg, #00b712 0%, #5aff15 100%);
  border: none;
  cursor: pointer;
  font-weight: 700;
  border-radius: 10px;
  font-size: 1rem;
  font-family: inherit;
  min-height: 48px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 183, 18, 0.3);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 183, 18, 0.4);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    font-size: 0.95rem;
    padding: 12px 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 11px 16px;
  }
`;

const SmallButton = styled.button`
  padding: 12px 18px;
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  border: 2px solid rgba(0, 183, 18, 0.3);
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 48px;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    border-color: #00b712;
    background: rgba(0, 183, 18, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 183, 18, 0.2);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0 !important;
    margin-top: 8px;
    padding: 11px 16px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 0.8rem;
  }
`;

const FundsData = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  gap: 10px;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Funds = styled.div`
  flex: 1;
  min-width: 150px;
  background-color: ${(props) => props.theme.bgDiv};
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const FundText = styled.p`
  margin: 0;
  padding: 4px 0;
  font-family: "Poppins";
  font-size: 0.95rem;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const Donated = styled.div`
  height: 280px;
  margin-top: 15px;
  background-color: ${(props) => props.theme.bgDiv};
  border-radius: 8px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: auto;
    min-height: 200px;
  }
`;

const LiveDonation = styled.div`
  height: 65%;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    height: auto;
    max-height: 200px;
  }
`;

const MyDonation = styled.div`
  height: 35%;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    height: auto;
    max-height: 150px;
  }
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
  flex-wrap: wrap;
  gap: 4px;
  
  @media (max-width: 480px) {
    font-size: small;
  }
`;

const DonationData = styled.p`
  color: ${(props) => props.theme.color};
  font-family: "Roboto";
  font-size: 0.95rem;
  margin: 0;
  padding: 0;
  word-break: break-all;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;