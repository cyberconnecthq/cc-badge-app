import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import ProfileNFTABI from "../abi/ProfileNFT.json";

const DEMO_CHAIN_ID = 5; // Goerli Test Network
const DEMO_PROFILE_NFT_CONTRACT = "0x9CeA22A644B9172736dE345fE55b74c0908348E5";
const DEMO_OPERATOR_PROFILE_NFT = "0x0000000000000000000000000000000000000000";

interface IMetadata {
    name: string;
    bio: string;
    handle: string;
    version: string;
}

function CreateProfileNFTBtn({
    provider,
    setProfileID,
    setHandle,
    disabled
}: {
    provider: Web3Provider | null;
    setProfileID: (profileID: number) => void;
    setHandle: (handle: string) => void;
    disabled: boolean;
}) {
    const handleOnClick = async () => {
        try {
            // Check for the provider
            if (!provider) {
                throw Error("No provier detected.");
            }

            // Check for the chain id
            const network = await provider.getNetwork();
            const chainId = network.chainId;

            if (chainId !== DEMO_CHAIN_ID) {
                throw Error("Wrong chain.");
            }

            // Connect with MetaMask wallet
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const address = await signer.getAddress();

            // Collect user's input
            const handle = prompt("Handle:") || "";
            const avatar =
                prompt("Avatar URL:") ||
                "https://gateway.pinata.cloud/ipfs/QmNcqSpCvhiyHocUaVf7qB8qwEGerSpnELeAi567YEraYm";
            const name = prompt("Name:") || "Demo name";
            const bio = prompt("Bio:") || "Demo bio";

            // Check for handle
            if (!handle) {
                throw Error("No input handle.");
            }

            // Construct metadata schema
            const metadata: IMetadata = {
                name: name,
                bio: bio,
                handle: handle,
                version: "1.0.0"
            };

            // Construct metadata as string
            const metadataStr = `data:application/json;base64,${Buffer.from(
                JSON.stringify(metadata),
                "binary"
            ).toString("base64")}`;

            // Call the createProfile function
            const contract = new ethers.Contract(
                DEMO_PROFILE_NFT_CONTRACT,
                ProfileNFTABI,
                signer
            );

            const tx = await contract.createProfile(
                // CreateProfileParams
                {
                    to: address,
                    handle: handle,
                    avatar: avatar,
                    metadata: metadataStr,
                    operator: DEMO_OPERATOR_PROFILE_NFT
                },
                // preData
                0x0,
                // postData
                0x0
            );
            await tx.wait();
            console.log("~~ Tx hash ~~");
            console.log(tx.hash);

            // Call the getProfileIdByHandle function
            const profileID = await contract.getProfileIdByHandle(handle);

            console.log("~~ Profile ID ~~");
            console.log(Number(profileID));

            // Update the state for profileID and handle
            setProfileID(Number(profileID));
            setHandle(handle);

            alert(`Successfully created the profile!`);
        } catch (error) {
            alert(error);
            console.error(error);
        }
    };

    return (
        <button onClick={handleOnClick} disabled={disabled}>
            Create Profile NFT
        </button>
    );
}

export default CreateProfileNFTBtn;
