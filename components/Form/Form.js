import styled from 'styled-components';
import FormLeftWrapper from './Components/FormLeftWrapper';
import FormRightWrapper from './Components/FormRightWrapper';
import { createContext, useState } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import CampaignFactory from '../../artifacts/contracts/Campaign.sol/CampaignFactory.json';

const FormState = createContext();

const Form = () => {
    const [form, setForm] = useState({
        campaignTitle: "",
        story: "",
        requiredAmount: "",
        category: "Education",
    });

    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState("");

    const FormHandler = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };



    const startCampaign = async (e) => {
        e.preventDefault();

        if (!window.ethereum) {
            toast.error("Please install MetaMask!");
            return;
        }

        const contractAddress = process.env.NEXT_PUBLIC_ADDRESS;
        if (!contractAddress) {
            toast.error("Contract address is not configured. Check your .env.local file.");
            return;
        }

        // Check if already connected, otherwise request connection
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length === 0) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        if (form.campaignTitle === "") {
            toast.warn("Title Field Is Empty");
            return;
        }
        if (form.story === "") {
            toast.warn("Story Field Is Empty");
            return;
        }
        if (form.requiredAmount === "") {
            toast.warn("Required Amount Field Is Empty");
            return;
        }

        setLoading(true);

        try {
            const contract = new ethers.Contract(
                contractAddress,
                CampaignFactory.abi,
                signer
            );

            const CampaignAmount = ethers.utils.parseEther(form.requiredAmount);

            const tx = await contract.createCampaign(
                form.campaignTitle,
                CampaignAmount,
                "", // No image
                form.category,
                form.story // Pass story text directly
            );

            // wait for the transaction to be mined
            const receipt = await tx.wait();

            // Extract campaign address from event
            const event = receipt.events.find(e => e.event === 'campaignCreated');
            if (!event) {
                toast.error("No campaignCreated event found. Transaction may have failed.");
                setLoading(false);
                return;
            }
            const newCampaignAddress = event.args.campaignAddress;

            setAddress(newCampaignAddress);
            toast.success("Campaign Created Successfully!");

        } catch (err) {
            console.error(err);
            toast.error("Transaction Failed: " + (err?.reason || err?.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    return (
    <FormState.Provider value={{ form, setForm, FormHandler, startCampaign }}>
            <FormWrapper>
                <FormMain>
                    {loading ? (
                        address === "" ? (
                            <Spinner>
                                <TailSpin height={60} />
                            </Spinner>
                        ) : (
                            <SuccessWrapper>
                                <h1>Campaign Started Successfully!</h1>
                                <h1>{address}</h1>
                                <Button onClick={() => window.open(`/campaign/${address}`, "_blank")}>
                                    Go To Campaign
                                </Button>
                            </SuccessWrapper>
                        )
                    ) : (
                        <FormInputsWrapper>
                            <FormLeftWrapper />
                            <FormRightWrapper />
                        </FormInputsWrapper>
                    )}
                </FormMain>
            </FormWrapper>
        </FormState.Provider>
    );
};

const FormWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
    padding: 40px 20px;
    box-sizing: border-box;
    background: linear-gradient(135deg, rgba(0, 183, 18, 0.05) 0%, rgba(90, 255, 21, 0.03) 100%);
    
    @media (max-width: 768px) {
        padding: 30px 16px;
        min-height: auto;
    }
    
    @media (max-width: 480px) {
        padding: 20px 12px;
    }
`;

const FormMain = styled.div`
    width: 85%;
    max-width: 1100px;
    background: ${(props) => props.theme.bgDiv};
    border-radius: 16px;
    padding: 50px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 183, 18, 0.1);
    
    @media (max-width: 1200px) {
        width: 90%;
        padding: 40px;
    }
    
    @media (max-width: 1024px) {
        width: 95%;
        padding: 35px;
    }
    
    @media (max-width: 768px) {
        width: 100%;
        padding: 25px;
    }
    
    @media (max-width: 480px) {
        width: 100%;
        padding: 20px;
        border-radius: 12px;
    }
`;

const FormInputsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
    margin-top: 0;
    width: 100%;
    
    @media (max-width: 1024px) {
        gap: 30px;
    }
    
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 0;
        margin-top: 0;
    }
    
    @media (max-width: 480px) {
        gap: 0;
        margin-top: 0;
    }
`;

const Spinner = styled.div`
    width: 100%;
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
`;

const SuccessWrapper = styled.div`
    width: 100%;
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 211, 238, 0.05) 100%);
    border-radius: 16px;
    justify-content: center;
    padding: 40px 20px;
    gap: 30px;
    
    h1 {
        color: #10b981;
        font-size: 2rem;
        margin: 0;
        text-align: center;
    }
    
    @media (max-width: 768px) {
        min-height: 50vh;
        padding: 30px 20px;
        
        h1 {
            font-size: 1.5rem;
        }
    }
    
    @media (max-width: 480px) {
        min-height: auto;
        padding: 25px 15px;
        
        h1 {
            font-size: 1.2rem;
        }
    }
`;

const Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30%;
    padding: 15px;
    color: white;
    background-color: #00b712;
    background-image: linear-gradient(180deg, #00b712 0%, #5aff15 80%);
    border: none;
    margin-top: 30px;
    cursor: pointer;
    font-weight: bold;
    border-radius: 8px;
    transition: all 0.3s ease;
    min-height: 44px;
    font-size: 1rem;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 183, 18, 0.3);
    }
    
    &:active {
        transform: translateY(0);
    }
    
    @media (max-width: 1024px) {
        width: 35%;
        padding: 12px;
        font-size: 0.95rem;
    }
    
    @media (max-width: 768px) {
        width: 50%;
        padding: 12px;
        font-size: 0.9rem;
        margin-top: 20px;
    }
    
    @media (max-width: 480px) {
        width: 100%;
        padding: 12px;
        font-size: 0.85rem;
        margin-top: 15px;
    }
`;

export default Form;
export { FormState };
