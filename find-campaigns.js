const { ethers } = require('ethers');
const CampaignFactory = require('./artifacts/contracts/Campaign.sol/CampaignFactory.json');
require('dotenv').config({ path: '.env.local' });

async function main() {
    console.log('🔍 Finding contract deployment block...\n');
    
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL
    );

    const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_ADDRESS,
        CampaignFactory.abi,
        provider
    );

    const currentBlock = await provider.getBlockNumber();
    console.log('Current Block:', currentBlock);
    
    // Try different block ranges to find campaigns
    const ranges = [
        { name: 'Last 10,000 blocks', from: Math.max(0, currentBlock - 10000) },
        { name: 'Last 50,000 blocks', from: Math.max(0, currentBlock - 50000) },
        { name: 'Last 100,000 blocks', from: Math.max(0, currentBlock - 100000) },
        { name: 'From block 0', from: 0 }
    ];

    for (const range of ranges) {
        try {
            console.log(`\nSearching ${range.name} (from ${range.from} to ${currentBlock})...`);
            const getAllCampaigns = contract.filters.campaignCreated();
            const campaigns = await contract.queryFilter(getAllCampaigns, range.from, currentBlock);
            
            if (campaigns.length > 0) {
                console.log(`✅ Found ${campaigns.length} campaign(s)!`);
                console.log('\nFirst campaign:');
                console.log('  Block:', campaigns[0].blockNumber);
                console.log('  Title:', campaigns[0].args.title);
                console.log('  Address:', campaigns[0].args.campaignAddress);
                console.log('  Category:', campaigns[0].args.category);
                
                console.log('\n💡 Recommendation: Update your block range to:', Math.max(0, campaigns[0].blockNumber - 1000));
                break;
            } else {
                console.log('No campaigns found');
            }
        } catch (error) {
            console.log(`Error with range: ${error.message}`);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
