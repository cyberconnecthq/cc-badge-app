import { Web3Provider } from "@ethersproject/providers";
import { useMutation } from "@apollo/client";
import { LOGIN_GET_MESSAGE, LOGIN_VERIFY } from "../graphql";

const DEMO_CHAIN_ID = 5; // Goerli Test Network
const DEMO_DOMAIN = "example.com";

function LoginBtn({
    provider,
    disabled,
    setAccessToken
}: {
    provider: Web3Provider | null;
    disabled: boolean;
    setAccessToken: (accessToken: string) => void;
}) {
    const [loginGetMessage] = useMutation(LOGIN_GET_MESSAGE);
    const [loginVerify] = useMutation(LOGIN_VERIFY);

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

            // Connect with MetaMask wallet
            const signer = provider.getSigner();
            await provider.send("eth_requestAccounts", []);
            const address = await signer.getAddress();

            // Request message from server
            const messageResult = await loginGetMessage({
                variables: {
                    input: {
                        address: address,
                        domain: DEMO_DOMAIN,
                        chainID: DEMO_CHAIN_ID
                    }
                }
            });
            const message = messageResult?.data?.loginGetMessage?.message;

            // Get the user's signature for the message
            const signature = await signer.signMessage(message);

            // Authenticate
            const accessTokenResult = await loginVerify({
                variables: {
                    input: {
                        address: address,
                        domain: DEMO_DOMAIN,
                        chainID: chainID,
                        signature: signature
                    }
                }
            });
            const accessToken = accessTokenResult?.data?.loginVerify?.accessToken;

            console.log("~~ Access Token ~~");
            console.log(accessToken);

            // Save token in local storage
            localStorage.setItem("accessToken", accessToken);

            // Update the state for accessToken
            setAccessToken(accessToken);

            alert(`Successfully logged in!`);
        } catch (error) {
            alert(error);
            console.error(error);
        }
    };

    return (
        <button onClick={handleOnClick} disabled={disabled}>
            Login
        </button>
    );
}

export default LoginBtn;
