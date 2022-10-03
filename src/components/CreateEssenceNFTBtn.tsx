import { Web3Provider } from "@ethersproject/providers";
import { useMutation } from "@apollo/client";
import { CREATE_REGISTER_ESSENCE_TYPED_DATA, RELAY } from "../graphql";

const DEMO_CHAIN_ID = 5; // Goerli Test Network
const DEMO_NAMESPACE = "CyberConnect";
const DEMO_APP_ID = "CyberConnect";
const DEMO_OPERATOR_MW_CONTRACT = "0x0000000000000000000000000000000000000000";

function CreateEssenceNFTBtn({
    provider,
    handle,
    profileID,
    setEssenceID,
    disabled
}: {
    provider: Web3Provider | null;
    handle: string;
    profileID: number;
    setEssenceID: (essenceID: number) => void;
    disabled: boolean;
}) {
    const [createRegisterEssenceTypedData] = useMutation(
        CREATE_REGISTER_ESSENCE_TYPED_DATA
    );
    const [relay] = useMutation(RELAY);

    const handleOnClick = async () => {
        try {
            // Check for the provider
            if (!provider) {
                throw Error("No provier detected.");
            }

            // Check for the chain id
            const network = await provider.getNetwork();
            const chainID = network.chainId;

            if (chainID !== DEMO_CHAIN_ID) {
                throw Error("Wrong chain.");
            }

            // Construct metadata for SBT
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const metadata = {
                // Opensea standard schema
                image:
                    "https://gateway.pinata.cloud/ipfs/QmNcqSpCvhiyHocUaVf7qB8qwEGerSpnELeAi567YEraYm", // string (required, only optional if `animation_url` has value)
                image_data: "",
                description: `SBT of @${handle}`, // string (optional)
                name: `@${handle} SBT`, // string (required)
                attributes: [], // array (required)
                animation_url: "", // string (required, only optional if `image` has value)
                external_url: "", // string (optional)
                background_color: "", // string (optional)
                youtube_url: "", // string (optional)

                // CyberConnect schema
                media: [], // (required, empty array for SBT)
                version: "1.0.0", // string (required)
                appId: DEMO_APP_ID, // string (required)
                locale: "en", // string (optional)
                type: "SBT", // "PUBLICATIONS" | "SBT" (optional, default is `PUBLICATIONS`)
                issued_date: new Date(), // string (required)

                // Specific to SBT
                holder: `@${handle}`, // string (required)
                issuer: address, // string (required)
                venue: "" // string (optional) e.g. Discord, Twitter etc.
            };

            // Construct tokenURI as string
            const tokenURI = `data:application/json;base64,${Buffer.from(
                JSON.stringify(metadata),
                "binary"
            ).toString("base64")}`;

            // Collect input
            const name = prompt("SBT name:") || "Demo SBT";
            const symbol = prompt("SBT symbol:") || "SBT";

            // Create typed data
            const typedDataResult = await createRegisterEssenceTypedData({
                variables: {
                    input: {
                        options: {
                            namespaceName: DEMO_NAMESPACE,
                            chainID: chainID
                        },
                        profileID: profileID,
                        name: name,
                        symbol: symbol,
                        tokenURI: tokenURI,
                        mwContract: DEMO_OPERATOR_MW_CONTRACT,
                        transferable: false // SBTs are non-transferable
                    }
                }
            });

            const typedData =
                typedDataResult.data?.createRegisterEssenceTypedData?.typedData;
            const message = typedData.data;
            const typedDataID = typedData.id;

            // Get signature for typed data
            const fromAddress = address;
            const params = [fromAddress, message];
            const method = "eth_signTypedData_v4";
            const signature = await signer.provider.send(method, params);

            // Relay
            const relayResult = await relay({
                variables: {
                    input: {
                        typedDataID: typedDataID,
                        signature: signature
                    }
                }
            });
            const txHash = relayResult.data?.relay?.relayTransaction?.txHash;

            console.log("~~ Tx hash ~~");
            console.log(txHash);

            // Update state for essenceID
            // First Essence NFT created will start at 1. Second Essence NFT will have the essenceID 2, etc.
            setEssenceID(1);

            alert(`Successfully created the SBT!`);
        } catch (error) {
            alert(error);
            console.error(error);
        }
    };

    return (
        <button onClick={handleOnClick} disabled={disabled}>
            Create Essence NFT
        </button>
    );
}

export default CreateEssenceNFTBtn;
