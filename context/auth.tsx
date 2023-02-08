import { ReactNode, createContext, useState, useEffect } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { ExternalProvider } from "@ethersproject/providers";
import { CHAIN_ID } from "../helpers/constants";
import {
	IAuthContext,
	IAccountCard,
	IPrimaryProfileCard,
	IBadgeCard,
} from "../types";
import {
	ACCOUNTS,
	PRIMARY_PROFILE,
	PRIMARY_PROFILE_ESSENCES,
} from "../graphql";
import { useCancellableQuery } from "../hooks/useCancellableQuery";
import { timeout } from "../helpers/functions";

export const AuthContext = createContext<IAuthContext>({
	provider: undefined,
	address: undefined,
	accessToken: undefined,
	primaryProfile: undefined,
	profileCount: 0,
	badgeCount: 0,
	badges: [],
	profiles: [],
	indexingProfiles: [],
	indexingBadges: [],
	setProvider: () => { },
	setAddress: () => { },
	setAccessToken: () => { },
	setPrimaryProfile: () => { },
	setProfileCount: () => { },
	setBadgeCount: () => { },
	setBadges: () => { },
	setProfiles: () => { },
	setIndexingProfiles: () => { },
	setIndexingBadges: () => { },
	checkNetwork: async () => new Promise(() => { }),
	connectWallet: async () => new Promise(() => { }),
});
AuthContext.displayName = "AuthContext";

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
	/* State variable to store the provider */
	const [provider, setProvider] = useState<Web3Provider | undefined>(undefined);

	/* State variable to store the address */
	const [address, setAddress] = useState<string | undefined>(undefined);

	/* State variable to store the primary profile */
	const [primaryProfile, setPrimaryProfile] = useState<
		IPrimaryProfileCard | undefined
	>(undefined);

	/* State variable to store the access token */
	const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

	/* State variable to store the initial number of accounts */
	const [profileCount, setProfileCount] = useState<number>(0);

	/* State variable to store the initial number of badges */
	const [badgeCount, setBadgeCount] = useState<number>(0);

	/* State variable to store indexing profiles */
	const [indexingProfiles, setIndexingProfiles] = useState<IAccountCard[]>([]);

	/* State variable to store indexing badges */
	const [indexingBadges, setIndexingBadges] = useState<IBadgeCard[]>([]);

	/* State variable to store the badges */
	const [badges, setBadges] = useState<any[]>([]);

	/* State variable to store the profiles */
	const [profiles, setProfiles] = useState<any[]>([]);

	useEffect(() => {
		/* Check if the user connected with wallet */
		if (!(provider && address)) return;

		try {
			/* Function to check if the network is the correct one */
			checkNetwork(provider);
		} catch (error) {
			/* Display error message */
			alert(error.message);
		}
	}, [provider, address]);

	useEffect(() => {
		if (!(address && accessToken)) return;
		let query: any;

		const fetch = async () => {
			try {
				/* Fetch primary profile */
				query = useCancellableQuery({
					query: PRIMARY_PROFILE,
					variables: {
						address: address,
					},
				});
				const res = await query;

				/* Get the primary profile */
				const primaryProfile = res?.data?.address?.wallet?.primaryProfile;

				/* Set the primary profile */
				setPrimaryProfile(primaryProfile);
			} catch (error) {
				/* Display error message */
				console.error(error);
			}
		};
		fetch();

		return () => {
			query.cancel();
		};
	}, [address, accessToken]);

	useEffect(() => {
		if (!(address && accessToken)) return;
		let query: any;

		const fetch = async () => {
			try {
				/* Fetch primary profile */
				query = useCancellableQuery({
					query: PRIMARY_PROFILE,
					variables: {
						address: address,
					},
				});
				const res = await query;

				/* Get the primary profile */
				const primaryProfile = res?.data?.address?.wallet?.primaryProfile;

				/* Set the primary profile */
				setPrimaryProfile(primaryProfile);
			} catch (error) {
				/* Display error message */
				console.error(error);
			}
		};
		fetch();

		return () => {
			query.cancel();
		};
	}, [address, accessToken]);

	useEffect(() => {
		if (!(address && accessToken)) return;

		let query: any;
		let timer: number = Date.now() + 1000 * 60 * 10;
		let mount = true;

		const fetch = async () => {
			try {
				/* Fetch primary profile posts */
				query = useCancellableQuery({
					query: PRIMARY_PROFILE_ESSENCES,
					variables: {
						address: address,
					},
				});
				const res = await query;

				/* Get the primary profile */
				const primaryProfile = res?.data?.address?.wallet?.primaryProfile;

				/* Get the posts */
				const edges = primaryProfile?.essences?.edges;
				const nodes = edges?.map((edge: any) => edge?.node) || [];

				/* Get the total count of posts */
				const count = primaryProfile?.essences?.totalCount;

				if (indexingBadges.length === 0) {
					/* Set the initial posts */
					setBadges([...nodes]);

					/* Set the initial number of posts */
					setBadgeCount(count);
				} else {
					if (badgeCount + indexingBadges.length === count) {
						/* Set the posts in the state variable */
						setBadges([...nodes]);

						/* Set the posts count in the state variable */
						setBadgeCount(count);

						/* Reset the indexingPostd in the state variable */
						setIndexingBadges([]);
					} else {
						/* Fetch again after a 2s timeout */
						if (Date.now() < timer) {
							/* Wait 2s before fetching data again */
							console.log("Fetching posts again.");
							await timeout(2000);
							if (mount) fetch();
						} else {
							/* Reset the indexingBadges in the state variable */
							setIndexingBadges([]);
						}
					}
				}
			} catch (error) {
				/* Display error message */
				console.error(error);

				/* Reset the indexingBadges in the state variable */
				setIndexingBadges([]);
			}
		};
		fetch();

		return () => {
			mount = false;
			if (query) {
				query.cancel();
			}
		};
	}, [address, accessToken, indexingBadges, badgeCount]);

	useEffect(() => {
		if (!(address && accessToken)) return;

		let query: any;
		let timer: number = Date.now() + 1000 * 60 * 10;
		let mount = true;

		const fetch = async () => {
			try {
				/* Fetch all profiles */
				query = useCancellableQuery({
					query: ACCOUNTS,
					variables: {
						address: address,
					},
				});
				const res = await query;

				/* Get the profiles */
				const edges = res?.data?.address?.wallet?.profiles?.edges;
				const nodes = edges?.map((edge: any) => edge?.node) || [];

				/* Get the total count of posts */
				const count = nodes.length;

				/* Get primary profile */
				const primaryProfile = nodes?.find((node: any) => node?.isPrimary);

				/* Set the primary profile if exists (might be the first one) */
				if (primaryProfile) setPrimaryProfile(primaryProfile);

				if (indexingProfiles.length === 0) {
					/* Set the profiles */
					setProfiles([...nodes]);

					/* Set the initial number of profiles */
					setProfileCount(count);
				} else {
					if (profileCount + indexingProfiles.length === count) {
						/* Set the posts in the state variable */
						setProfiles([...nodes]);

						/* Set the posts count in the state variable */
						setProfileCount(count);

						/* Reset the indexingProfiles in the state variable */
						setIndexingProfiles([]);
					} else {
						/* Fetch again after a 2s timeout */
						if (Date.now() < timer) {
							/* Wait 2s before fetching data again */
							console.log("Fetching profiles again.");
							await timeout(2000);
							if (mount) fetch();
						} else {
							/* Reset the indexingProfiles in the state variable */
							setIndexingProfiles([]);
						}
					}
				}
			} catch (error) {
				/* Display error message */
				console.error(error);

				/* Reset the indexingProfiles in the state variable */
				setIndexingProfiles([]);
			}
		};
		fetch();

		return () => {
			mount = false;
			if (query) {
				query.cancel();
			}
		};
	}, [address, accessToken, indexingProfiles, profileCount]);

	/* Function to connect with MetaMask wallet */
	const connectWallet = async () => {
		try {
			/* Function to detect most providers injected at window.ethereum */
			const detectedProvider =
				(await detectEthereumProvider()) as ExternalProvider;

			/* Check if the Ethereum provider exists */
			if (!detectedProvider) {
				throw new Error("Please install MetaMask!");
			}

			/* Ethers Web3Provider wraps the standard Web3 provider injected by MetaMask */
			const web3Provider = new ethers.providers.Web3Provider(detectedProvider);

			/* Connect to Ethereum. MetaMask will ask permission to connect user accounts */
			await web3Provider.send("eth_requestAccounts", []);

			/* Get the signer from the provider */
			const signer = web3Provider.getSigner();

			/* Get the address of the connected wallet */
			const address = await signer.getAddress();

			/* Set the providers in the state variables */
			setProvider(web3Provider);

			/* Set the address in the state variable */
			setAddress(address);

			return web3Provider;
		} catch (error) {
			/* Throw the error */
			throw error;
		}
	};

	/* Function to check if the network is the correct one */
	const checkNetwork = async (provider: Web3Provider) => {
		try {
			/* Get the network from the provider */
			const network = await provider.getNetwork();

			/* Check if the network is the correct one */
			if (network.chainId !== CHAIN_ID) {
				/* Switch network if the chain id doesn't correspond to Goerli Testnet Network */
				await provider.send("wallet_switchEthereumChain", [
					{ chainId: "0x" + CHAIN_ID.toString(16) },
				]);

				/* Trigger a page reload */
				window.location.reload();
			}
		} catch (error) {
			/* This error code indicates that the chain has not been added to MetaMask */
			if (error.code === 4902) {
				await provider.send("wallet_addEthereumChain", [
					{
						chainId: "0x" + CHAIN_ID.toString(16),
						rpcUrls: ["https://goerli.infura.io/v3/"],
					},
				]);

				/* Trigger a page reload */
				window.location.reload();
			} else {
				/* Throw the error */
				throw error;
			}
		}
	};

	return (
		<AuthContext.Provider
			value={{
				provider,
				address,
				accessToken,
				primaryProfile,
				profileCount,
				badgeCount,
				badges,
				profiles,
				indexingProfiles,
				indexingBadges,
				setProvider,
				setAddress,
				setAccessToken,
				setPrimaryProfile,
				setProfileCount,
				setBadgeCount,
				setIndexingProfiles,
				setIndexingBadges,
				setBadges,
				setProfiles,
				checkNetwork,
				connectWallet,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
