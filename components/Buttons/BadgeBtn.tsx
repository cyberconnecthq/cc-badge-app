import { useContext } from "react";
import { useMutation } from "@apollo/client";
import { pinJSONToIPFS, getEssenceSVGData } from "../../helpers/functions";
import { CREATE_REGISTER_ESSENCE_TYPED_DATA, RELAY } from "../../graphql";
import { IEssenceMetadata, Version } from "../../types";
import { AuthContext } from "../../context/auth";
import { v4 as uuidv4 } from "uuid";
import { IoMdRibbon } from "react-icons/io";

function BadgeBtn() {
    const { provider, address, accessToken, profileID, handle, checkNetwork } = useContext(AuthContext);
    const [createRegisterEssenceTypedData] = useMutation(CREATE_REGISTER_ESSENCE_TYPED_DATA);
    const [relay] = useMutation(RELAY);

    const handleOnClick = async () => {
        try {
            /* Check if the user connected with wallet */
            if (!(provider && address)) {
                throw Error("Connect with MetaMask.");
            }

            /* Check if the has signed in */
            if (!accessToken) {
                throw Error("Youn need to Sign in.");
            }

            /* Check if the has signed up */
            if (!profileID) {
                throw Error("Youn need to Sign up.");
            }

            /* Check if the network is the correct one */
            await checkNetwork(provider);

            /* Function to render the svg data for the NFT */
            /* (default if the user doesn't pass a image url) */
            const svg_data = getEssenceSVGData();

            /* Collect user input for NFT image */
            const nftImageURL = prompt("NFT image URL:");
            const title = prompt("Event name:") || "Twitter Space AMA";
            const venue = prompt("Venue:") || "twitter";

            /* Construct the metadata object for the Essence NFT */
            const metadata: IEssenceMetadata = {
                metadata_id: uuidv4(),
                version: Version.V1,
                app_id: "cyberconnect",
                lang: "en",
                issue_date: new Date().toISOString(),
                content: "",
                media: [],
                tags: [],
                image: nftImageURL ? nftImageURL : "",
                image_data: !nftImageURL ? svg_data : "",
                name: `@${handle}'s event`,
                description: `@${handle}'s event on CyberConnect Event app`,
                animation_url: "",
                external_url: "",
                attributes: [
                    {
                        display_type: "string",
                        trait_type: "title",
                        value: title,
                    },
                    {
                        display_type: "date",
                        trait_type: "date",
                        value: Date.now(),
                    },
                    {
                        display_type: "string",
                        trait_type: "venue",
                        value: venue,
                    },
                ],
            };

            /* Upload metadata to IPFS */
            const ipfsHash = await pinJSONToIPFS(metadata);

            /* Get the signer from the provider */
            const signer = provider.getSigner();

            /* Get the network from the provider */
            const network = await provider.getNetwork();

            /* Get the chain id from the network */
            const chainID = network.chainId;

            /* Create typed data in a readable format */
            const typedDataResult = await createRegisterEssenceTypedData({
                variables: {
                    input: {
                        options: {
                            /* The chain id on which the Essence NFT will be minted on */
                            chainID: chainID
                        },
                        /* The profile id under which the Essence is registered */
                        profileID: profileID,
                        /* Name of the Essence */
                        name: "Badge",
                        /* Symbol of the Essence */
                        symbol: "SBT",
                        /* URL for the json object containing data about content and the Essence NFT */
                        tokenURI: `https://cyberconnect.mypinata.cloud/ipfs/${ipfsHash}`,
                        /* Middleware that allows users to collect the Essence NFT for free */
                        middleware: {
                            collectFree: true,
                        },
                        /* Set if the Essence should be transferable or not */
                        /* SBTs are non-transferable */
                        transferable: false
                    }
                }
            });
            const typedData =
                typedDataResult.data?.createRegisterEssenceTypedData?.typedData;
            const message = typedData.data;
            const typedDataID = typedData.id;

            /* Get the signature for the message signed with the wallet */
            const fromAddress = await signer.getAddress();
            const params = [fromAddress, message];
            const method = "eth_signTypedData_v4";
            const signature = await signer.provider.send(method, params);

            /* Call the relay to broadcast the transaction */
            const relayResult = await relay({
                variables: {
                    input: {
                        typedDataID: typedDataID,
                        signature: signature
                    }
                }
            });
            const txHash = relayResult.data?.relay?.relayTransaction?.txHash;

            /* Log the transaction hash */
            console.log("~~ Tx hash ~~");
            console.log(txHash);

            /* Display success message */
            alert("Successfully created the badge!");
        } catch (error) {
            /* Display error message */
            alert(error.message);
        }
    };

    return (
        <button
            className="badge-btn center"
            type="submit"
            onClick={handleOnClick}
        >
            <IoMdRibbon />
        </button>
    );
}

export default BadgeBtn;