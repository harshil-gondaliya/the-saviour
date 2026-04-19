// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;   

contract CampaignFactory {
    address[] public deployedCampaigns;

    event campaignCreated(
        string title,
        uint requiredAmount,
        address indexed owner,
        address campaignAddress,
        string imgURI,
        uint indexed timestamp,
        string indexed category
    );

    function createCampaign(
        string memory campaignTitle, 
        uint requiredCampaignAmount, 
        string memory imgURI, 
        string memory category,
        string memory storyURI) public
    {

        Campaign newCampaign = new Campaign(
            campaignTitle, requiredCampaignAmount, imgURI, storyURI, msg.sender);
        

        deployedCampaigns.push(address(newCampaign));

        emit campaignCreated(
            campaignTitle, 
            requiredCampaignAmount, 
            msg.sender, 
            address(newCampaign),
            imgURI,
            block.timestamp,
            category
        );

    }
}


contract Campaign {
    string public title;
    uint public requiredAmount;
    string public image;
    string public story;
    address payable public owner;
    uint public receivedAmount;

    event donated(address indexed donar, uint indexed amount, uint indexed timestamp);

    constructor(
        string memory campaignTitle, 
        uint requiredCampaignAmount, 
        string memory imgURI,
        string memory storyURI,
        address campaignOwner
    ) {
        title = campaignTitle;
        requiredAmount = requiredCampaignAmount;
        image = imgURI;
        story = storyURI;
        owner = payable(campaignOwner);
    }

    function donate() public payable {
        require(msg.value > 0, "donation amount must be greater than 0");
        require(requiredAmount > receivedAmount, "required amount fullfilled");
        
        (bool success, ) = owner.call{value: msg.value}("");
        require(success, "transfer failed");
        
        receivedAmount += msg.value;
        emit donated(msg.sender, msg.value, block.timestamp);
    }
}