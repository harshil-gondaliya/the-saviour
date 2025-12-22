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
                            <Address>
                                <h1>Campaign Started Successfully!</h1>
                                <h1>{address}</h1>
                                <Button onClick={() => window.open(`/campaign/${address}`, "_blank")}>
                                    Go To Campaign
                                </Button>
                            </Address>
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
    padding: 0 10px;
`;

const FormMain = styled.div`
    width: 80%;
    
    @media (max-width: 1024px) {
        width: 90%;
    }
    
    @media (max-width: 768px) {
        width: 95%;
    }
`;

const FormInputsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 45px;
    gap: 20px;
    
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 0;
    }
`;

const Spinner = styled.div`
    width: 100%;
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Address = styled.div`
    width: 100%;
    height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${(props) => props.theme.bgSubDiv};
    border-radius: 8px;
    justify-content: center;
`;

const Button = styled.button`
    display: flex;
    justify-content: center;
    width: 30%;
    padding: 15px;
    color: white;
    background-color: #00b712;
    background-image: linear-gradient(180deg, #00b712 0%, #5aff15 80%);
    border: none;
    margin-top: 30px;
    cursor: pointer;
    font-weight: bold;
    font-size: large;
`;

export default Form;
export { FormState };
