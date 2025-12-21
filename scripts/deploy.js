const hre = require("hardhat");

async function main() {
  const CampaignFactory = await hre.ethers.getContractFactory("CampaignFactory");
  const campaignFactory = await CampaignFactory.deploy();

  // ✅ ethers v5: wait for deployment
  await campaignFactory.deployed();

  // ✅ ethers v5: use .address instead of getAddress()
  console.log("CampaignFactory deployed to:", campaignFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
