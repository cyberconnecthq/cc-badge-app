import { useContext } from "react";
import { pinJSONToIPFS, getEssenceSVGData } from "../../helpers/functions";
import { IBadgeInput, IEssenceMetadata } from "../../types";
import { randCompanyName } from "@ngneat/falso";
import { AuthContext } from "../../context/auth";
import { ModalContext } from "../../context/modal";
import { v4 as uuidv4 } from "uuid";
import { ethers } from "ethers";
import ProfileNFTABI from "../../abi/ProfileNFT.json";
import { PROFILE_NFT_CONTRACT } from "../../helpers/constants";

function BadgeBtn({ nftImageURL, title, venue, date }: IBadgeInput) {
	const {
		accessToken,
		indexingBadges,
		primaryProfile,
		setIndexingBadges,
		checkNetwork,
		connectWallet,
	} = useContext(AuthContext);
	const { handleModal } = useContext(ModalContext);

	const handleOnClick = async () => {
		try {
			/* Check if the user logged in */
			if (!accessToken) {
				throw Error("You need to Sign in.");
			}

			/* Check if the has signed up */
			if (!primaryProfile?.profileID) {
				throw Error("Youn need to mint a profile.");
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
				app_id: "cyberconnect-bnbt",
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

			const contract = new ethers.Contract(
				PROFILE_NFT_CONTRACT,
				ProfileNFTABI,
				signer
			);

			const tx = await contract.registerEssence(
				{
					profileId: primaryProfile?.profileID,
					name: "gas-post",
					symbol: "gp",
					essenceTokenURI: `https://cyberconnect.mypinata.cloud/ipfs/${ipfsHash}`,
					essenceMw: "0x0000000000000000000000000000000000000000",
					transferable: true,
					deployAtRegister: true,
				},
				0x0
			);

			console.log("gas tx", tx);

			/* Close Badge Modal */
			handleModal(null, "");

			/* Set the indexingBadges in the state variables */
			setIndexingBadges([
				...indexingBadges,
				{
					createdBy: {
						metadata: primaryProfile?.metadata,
						profileID: primaryProfile?.profileID,
					},
					essenceID: 0, // Value will be updated once it's indexed
					tokenURI: `https://cyberconnect.mypinata.cloud/ipfs/${ipfsHash}`,
					isIndexed: false,
					isCollectedByMe: false,
				},
			]);

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
		<button className="badge-btn center" type="submit" onClick={handleOnClick}>
			Badge (Gas mode)
		</button>
	);
}

export default BadgeBtn;
