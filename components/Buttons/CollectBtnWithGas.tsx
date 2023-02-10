import { useContext, useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_COLLECT_ESSENCE_TYPED_DATA, RELAY } from "../../graphql";
import { AuthContext } from "../../context/auth";
import { ModalContext } from "../../context/modal";
import { ethers } from "ethers";
import ProfileNFTABI from "../../abi/ProfileNFT.json";
import { PROFILE_NFT_CONTRACT } from "../../helpers/constants";

function CollectBtnWithGas({
	profileID,
	essenceID,
	isCollectedByMe,
}: {
	profileID: number;
	essenceID: number;
	isCollectedByMe: boolean;
}) {
	const { accessToken, connectWallet, checkNetwork } = useContext(AuthContext);
	const { handleModal } = useContext(ModalContext);
	const [createCollectEssenceTypedData] = useMutation(
		CREATE_COLLECT_ESSENCE_TYPED_DATA
	);
	const [relay] = useMutation(RELAY);
	const [stateCollect, setStateCollect] = useState(false);

	useEffect(() => {
		setStateCollect(isCollectedByMe);
	}, [isCollectedByMe]);

	const handleOnClick = async () => {
		try {
			/* Check if the user logged in */
			if (!accessToken) {
				throw Error("You need to Sign in.");
			}

			/* Connect wallet and get provider */
			const provider = await connectWallet();

			/* Check if the network is the correct one */
			await checkNetwork(provider);

			/* Get the signer from the provider */
			const signer = provider.getSigner();

			/* Get the address from the provider */
			const address = await signer.getAddress();

			const contract = new ethers.Contract(
				PROFILE_NFT_CONTRACT,
				ProfileNFTABI,
				signer
			);

			const tx = await contract.collect(
				{
					collector: address,
					profileId: profileID,
					essenceId: essenceID,
				},
				0x0,
				0x0
			);

			console.log("tx", tx);

			/* Set the state to true */
			setStateCollect(true);

			/* Display success message */
			handleModal("success", "Post was collected!");
		} catch (error) {
			/* Display error message */
			const message = error.message as string;
			handleModal("error", message);
		}
	};

	return (
		<button
			className="collect-btn"
			onClick={handleOnClick}
			disabled={stateCollect}
		>
			{stateCollect ? "Collected" : "Gas Collect"}
		</button>
	);
}

export default CollectBtnWithGas;
