import { useContext } from "react";
import { useMutation } from "@apollo/client";
import { pinJSONToIPFS, getEssenceSVGData } from "../../helpers/functions";
import { CREATE_REGISTER_ESSENCE_TYPED_DATA, RELAY } from "../../graphql";
import { IBadgeInput, IEssenceMetadata } from "../../types";
import { randCompanyName } from "@ngneat/falso";
import { AuthContext } from "../../context/auth";
import { ModalContext } from "../../context/modal";
import { v4 as uuidv4 } from "uuid";

function BadgeBtn({ nftImageURL, title, venue, date }: IBadgeInput) {
    const {
        accessToken,
        indexingBadges,
        primaryProfile,
        setIndexingBadges,
        checkNetwork,
        connectWallet
    } = useContext(AuthContext);
    const { handleModal } = useContext(ModalContext);
    const [createRegisterEssenceTypedData] = useMutation(CREATE_REGISTER_ESSENCE_TYPED_DATA);
    const [relay] = useMutation(RELAY);

    const handleOnClick = async () => {
        try {
            /* Check if the user logged in */
            if (!(accessToken)) {
                throw Error("You need to Sign in.");
            }

            /* Check if the has signed up */
            if (!primaryProfile?.profileID) {
                throw Error("Youn need to Sign up.");
            }

            /* Connect wallet and get provider */
            const provider = await connectWallet();

            /* Check if the network is the correct one */
            await checkNetwork(provider);

            /* Function to render the svg data for the NFT */
            /* (default if the user doesn't pass a image url) */
            const svg_data = getEssenceSVGData();

            /* Construct the metadata object for the Essence NFT */
            const metadata: IEssenceMetadata = {
                metadata_id: uuidv4(),
                version: "1.0.0",
                app_id: "cyberconnect",
                lang: "en",
                issue_date: new Date().toISOString(),
                content: "",
                media: [],
                tags: [],
                image: nftImageURL ? nftImageURL : "",
                image_data: !nftImageURL ? svg_data : "",
                name: `@${primaryProfile.handle}'s event`,
                description: `@${primaryProfile.handle}'s event on CyberConnect Event app`,
                animation_url: "",
                external_url: "",
                attributes: [
                    {
                        display_type: "string",
                        trait_type: "title",
                        value: title || `${randCompanyName()} event`,
                    },
                    {
                        display_type: "date",
                        trait_type: "date",
                        value: date,
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
                        profileID: primaryProfile.profileID,
                        /* Name of the Essence */
                        name: "Event SBT",
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

            /* Close Badge Modal */
            handleModal(null, "");

            /* Set the indexingBadges in the state variables */
            setIndexingBadges([...indexingBadges, {
                createdBy: {
                    metadata: primaryProfile?.metadata,
                    profileID: primaryProfile?.profileID,
                },
                essenceID: 0, // Value will be updated once it's indexed
                tokenURI: `https://cyberconnect.mypinata.cloud/ipfs/${ipfsHash}`,
                isIndexed: false,
                isCollectedByMe: false,
            }]);

            /* Log the transaction hash */
            console.log("~~ Tx hash ~~");
            console.log(txHash);

            /* Display success message */
            handleModal("success", "Badge was created!");
        } catch (error) {
            /* Set the indexingBadges in the state variables */
            setIndexingBadges([...indexingBadges]);

            /* Display error message */
            const message = error.message as string;
            handleModal("error", message);
        }
    };

    return (
        <button
            className="badge-btn center"
            type="submit"
            onClick={handleOnClick}
        >
            Badge
        </button>
    );
}

export default BadgeBtn;
