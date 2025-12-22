const { ethers } = require('ethers');
const CampaignFactory = require('./artifacts/contracts/Campaign.sol/CampaignFactory.json');
require('dotenv').config({ path: '.env.local' });

async function main() {
    console.log('🔍 Verifying Contract Setup...\n');
    
    // Check environment variables
    console.log('📋 Environment Variables:');
    console.log('RPC URL:', process.env.NEXT_PUBLIC_RPC_URL);
    console.log('Contract Address:', process.env.NEXT_PUBLIC_ADDRESS);
    console.log('');

    // Connect to provider
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL
    );

    try {
        // Check network
        const network = await provider.getNetwork();
        console.log('🌐 Network Info:');
        console.log('Network Name:', network.name);
        console.log('Chain ID:', network.chainId);
        console.log('');

        // Check block number
        const blockNumber = await provider.getBlockNumber();
        console.log('📦 Current Block Number:', blockNumber);
        console.log('');

        // Check contract
        const contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_ADDRESS,
            CampaignFactory.abi,
            provider
        );

        console.log('📜 Contract Info:');
        console.log('Contract Address:', contract.address);

        // Try to get deployed campaigns count
        try {
            const code = await provider.getCode(contract.address);
            if (code === '0x') {
                console.log('❌ ERROR: No contract found at this address!');
                console.log('   You need to deploy your contract first.');
                return;
            }
            console.log('✅ Contract exists at address');
            console.log('');

            // Query for campaigns in the last 10000 blocks
            console.log('🔎 Searching for campaigns in last 10000 blocks...');
            const fromBlock = Math.max(0, blockNumber - 10000);
            const getAllCampaigns = contract.filters.campaignCreated();
            const campaigns = await contract.queryFilter(getAllCampaigns, fromBlock, blockNumber);
            
            console.log(`✅ Found ${campaigns.length} campaign(s)`);
            console.log('');

            if (campaigns.length > 0) {
                console.log('📊 Campaign Details:');
                campaigns.forEach((campaign, index) => {
                    console.log(`\nCampaign ${index + 1}:`);
                    console.log('  Title:', campaign.args.title);
                    console.log('  Address:', campaign.args.campaignAddress);
                    console.log('  Owner:', campaign.args.owner);
                    console.log('  Amount:', ethers.utils.formatEther(campaign.args.requiredAmount), 'ETH');
                    console.log('  Category:', campaign.args.category);
                });
            } else {
                console.log('ℹ️  No campaigns found. Create your first campaign!');
            }
            console.log('');
            console.log('✅ Contract verification complete!');

        } catch (error) {
            console.log('❌ Error querying contract:', error.message);
        }

    } catch (error) {
        console.log('❌ Connection Error:', error.message);
        console.log('');
        console.log('Possible issues:');
        console.log('1. Invalid RPC URL');
        console.log('2. Network connectivity issues');
        console.log('3. Infura API key issues');
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
