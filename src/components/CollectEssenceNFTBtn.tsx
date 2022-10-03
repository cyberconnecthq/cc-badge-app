import { Web3Provider } from "@ethersproject/providers";
import { useMutation } from "@apollo/client";
import { CREATE_COLLECT_ESSENCE_TYPED_DATA, RELAY } from "../graphql";

const DEMO_CHAIN_ID = 5; // Goerli Test Network
const DEMO_NAMESPACE = "CyberConnect";

function CollectEssenceNFTBtn({
    provider,
    profileID,
    essenceID,
    disabled
}: {
    provider: Web3Provider | null;
    profileID: number;
    essenceID: number;
    disabled: boolean;
}) {
    const [createCollectEssenceTypedData] = useMutation(
        CREATE_COLLECT_ESSENCE_TYPED_DATA
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

            const signer = provider.getSigner();
            const address = await signer.getAddress();

            // Create typed data
            const typedDataResult = await createCollectEssenceTypedData({
                variables: {
                    input: {
                        options: {
                            namespaceName: DEMO_NAMESPACE,
                            chainID: chainID
                        },
                        collector: address,
                        profileID: profileID,
                        essenceID: essenceID
                    }
                }
            });

            const typedData =
                typedDataResult.data?.createCollectEssenceTypedData?.typedData;
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

            alert(`Successfully collected the SBT!`);
        } catch (error) {
            alert(error);
            console.error(error);
        }
    };

    return (
        <button onClick={handleOnClick} disabled={disabled}>
            Collect Essence NFT
        </button>
    );
}

export default CollectEssenceNFTBtn;
