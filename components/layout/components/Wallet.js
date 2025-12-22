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

const Wallet = () => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    // Check if wallet is already connected on page load
    const checkConnection = async () => {
      if (window.ethereum) {
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
    if (!window.ethereum) {
      alert("MetaMask not detected!");
      return;
    }

    try {
      // Request wallet_requestPermissions to force MetaMask to show account selector
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      
      // Then get the selected account
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const network = await provider.getNetwork();
      if (network.chainId !== 11155111) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              ...networks["sepolia"],
            },
          ],
        });
      }

      const signer = provider.getSigner();
      const Address = await signer.getAddress();
      setAddress(Address);

      const Balance = ethers.utils.formatEther(await provider.getBalance(Address));
      setBalance(Balance);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  return (
    <ConnectWalletWrapper onClick={connectWallet}>
      {balance === "" ? <Balance></Balance> : <Balance>{balance.slice(0, 6)} ETH</Balance>}
      {address === "" ? <Address>Connect Wallet</Address> : <Address>{address.slice(0, 6)}...{address.slice(-4)}</Address>}
    </ConnectWalletWrapper>
  );
};

const ConnectWalletWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.bgDiv};
  padding: 5px 9px;
  height: 100%;
  color: ${(props) => props.theme.color};
  border-radius: 10px;
  margin-right: 15px;
  font-family: "Roboto";
  font-weight: bold;
  font-size: small;
  cursor: pointer;
`;

const Address = styled.h2`
  background-color: ${(props) => props.theme.bgSubDiv};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px 0 5px;
  border-radius: 10px;
`;

const Balance = styled.h2`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
`;

export default Wallet;