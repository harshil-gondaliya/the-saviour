'use client';


import styled from "styled-components";
import { ethers } from "ethers";
import { useState, useEffect } from "react";

const networks = {
  localhost: {
    chainId: `0x${Number(31337).toString(16)}`,
    chainName: "Hardhat Localhost",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["http://127.0.0.1:8545/"],
    blockExplorerUrls: [],
  },
  sepolia: {
    chainId: `0x${Number(11155111).toString(16)}`,
    chainName: "Sepolia Testnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL || "https://sepolia.infura.io/v3/YOUR_API_KEY"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },
};

const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7";

const Wallet = () => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check if wallet is already connected on page load
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const Address = await signer.getAddress();
            setAddress(Address);
            const Balance = ethers.utils.formatEther(await provider.getBalance(Address));
            setBalance(Balance);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async () => {
    if (typeof window === 'undefined') return;
    
    if (!window.ethereum) {
      alert("Please install MetaMask to connect your wallet!");
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setIsConnecting(true);
    try {
      // Request wallet_requestPermissions to force MetaMask to show account selector
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      
      // Then get the selected account
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
      if (currentChainId?.toLowerCase() !== SEPOLIA_CHAIN_ID_HEX) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
          });
        } catch (switchError) {
          if (switchError?.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [{ ...networks.sepolia }],
            });
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
            });
          } else {
            console.error("Error switching network:", switchError);
            alert("Please switch to Sepolia network manually in MetaMask");
            return;
          }
        }
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

      const signer = provider.getSigner();
      const Address = await signer.getAddress();
      setAddress(Address);

      const Balance = ethers.utils.formatEther(await provider.getBalance(Address));
      setBalance(Balance);
    } catch (error) {
      console.error("Wallet connection failed:", error);
      if (error.code === 4001) {
        alert('Connection rejected. Please try again.');
      } else {
        alert('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <ConnectWalletWrapper onClick={connectWallet}>
      {balance === "" ? <Balance></Balance> : <Balance>{balance.slice(0, 6)} ETH</Balance>}
      {address === "" ? (
        <Address>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</Address>
      ) : (
        <Address>{address.slice(0, 6)}...{address.slice(-4)}</Address>
      )}
    </ConnectWalletWrapper>
  );
};

const ConnectWalletWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.bgDiv};
  padding: 8px 12px;
  height: 100%;
  gap: 8px;
  color: ${(props) => props.theme.color};
  border-radius: 10px;
  font-family: "Roboto";
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-height: 44px;
  
  &:hover {
    opacity: 0.8;
    transform: scale(1.02);
  }
  
  @media (max-width: 1024px) {
    padding: 6px 10px;
    font-size: 11px;
    gap: 6px;
  }
  
  @media (max-width: 768px) {
    font-size: 10px;
    padding: 5px 8px;
    gap: 4px;
  }
  
  @media (max-width: 480px) {
    font-size: 9px;
    padding: 4px 6px;
    gap: 3px;
  }
`;

const Balance = styled.h2`
  font-family: "Roboto";
  font-weight: 600;
  font-size: 12px;
  margin: 0;
  color: inherit;
  
  @media (max-width: 1024px) {
    font-size: 11px;
  }
  
  @media (max-width: 768px) {
    font-size: 10px;
  }
  
  @media (max-width: 480px) {
    font-size: 9px;
  }
`;

const Address = styled.h2`
  font-family: "Roboto";
  font-weight: 600;
  font-size: 12px;
  margin: 0;
  color: inherit;
  
  @media (max-width: 1024px) {
    font-size: 11px;
  }
  
  @media (max-width: 768px) {
    font-size: 10px;
  }
  
  @media (max-width: 480px) {
    font-size: 9px;
  }
`;

export default Wallet;