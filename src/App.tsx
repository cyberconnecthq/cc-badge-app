import "./styles.css";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { ExternalProvider, Web3Provider } from "@ethersproject/providers";
import { useEffect, useState } from "react";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./apollo";
import LoginBtn from "./components/LoginBtn";
import CreateProfileNFTBtn from "./components/CreateProfileNFTBtn";
import CreateEssenceNFTBtn from "./components/CreateEssenceNFTBtn";
import CollectEssenceNFTBtn from "./components/CollectEssenceNFTBtn";

// 🛠️ This demo is using the CyberConnect Profile smart contract for the Goerli Testnet Network.🛠️
// Refer to the Docs (https://docs.cyberconnect.me/cheatSheet) for the full list of CyberConnect Protocol's smart contract addresses.

export default function App() {
  const [provider, setProvider] = useState<Web3Provider | null>(null);
  const [accessToken, setAccessToken] = useState<string>("");
  const [profileID, setProfileID] = useState<number>(0);
  const [handle, setHandle] = useState<string>("");
  const [essenceID, setEssenceID] = useState<number>(0);

  useEffect(() => {
    (async () => {
      try {
        const detectedProvider = (await detectEthereumProvider()) as ExternalProvider;
        const ethersProvider = new ethers.providers.Web3Provider(
          detectedProvider
        );
        setProvider(ethersProvider);
      } catch (error) {
        alert(error);
        console.error(error);
      }
    })();
  }, []);

  return (
    <ApolloProvider client={apolloClient}>
      <div className="App">
        <div className="container">
          <h1>Build a NFT/SBT platform</h1>
          <LoginBtn
            provider={provider}
            disabled={!Boolean(provider && !accessToken)}
            setAccessToken={setAccessToken}
          />
          <CreateProfileNFTBtn
            provider={provider}
            disabled={!Boolean(provider && accessToken && !profileID)}
            setProfileID={setProfileID}
            setHandle={setHandle}
          />
          <CreateEssenceNFTBtn
            provider={provider}
            profileID={profileID}
            handle={handle}
            setEssenceID={setEssenceID}
            disabled={
              !Boolean(provider && accessToken && profileID && !essenceID)
            }
          />
          <CollectEssenceNFTBtn
            provider={provider}
            profileID={profileID}
            essenceID={essenceID}
            disabled={
              !Boolean(provider && accessToken && profileID && essenceID)
            }
          />
        </div>
      </div>
    </ApolloProvider>
  );
}
