const { task } = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env.local" });



/** @type import('hardhat/config').HardhatUserConfig */


task("accounts","Prints the list of accounts", async (taskArgs,hre) => {
  const accounts = await hre.ethers.getSigners();
  
  for (const account of accounts) {
    console.log(account.address);
  }
})

module.exports = {
  solidity: "0.8.28",
   paths: {
    sources: "./contracts",   // default contracts folder
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    hardhat: {
      chainId: 31337, 
    },
    localhost: {
      url: "http://127.0.0.1:8545", 
    },
    sepolia: {
      url: process.env.NEXT_PUBLIC_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/ykbRVuuhIgdpFX4keONLC",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
};
