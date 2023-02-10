import React, { useEffect, useState } from "react";
import Image from "next/image";
import CollectBtnWithGasless from "../Buttons/CollectBtnWithGasless";
import CollectBtnWithGas from "../Buttons/CollectBtnWithGas";
import { IBadgeCard } from "../../types";
import { parseURL } from "../../helpers/functions";
import { BsCalendar2Event } from "react-icons/bs";
import { GoLocation } from "react-icons/go";
import { BsFillMicFill } from "react-icons/bs";
import Loader from "../Loader";

export const BadgeCard = ({
	essenceID,
	tokenURI,
	createdBy,
	isCollectedByMe,
	isIndexed,
}: IBadgeCard) => {
	const { profileID, metadata } = createdBy;
	const [name, setName] = useState("");
	const [data, setData] = useState({
		image: "",
		image_data: "",
		attributes: [],
	});
	const [src, setSrc] = useState(data.image ? data.image : data.image_data);

	useEffect(() => {
		if (!tokenURI) return;
		(async () => {
			setData({
				image: "",
				image_data: "",
				attributes: [],
			});
			try {
				const res = await fetch(parseURL(tokenURI));
				if (res.status === 200) {
					const data = await res.json();
					setData(data);
				}
			} catch (error) {
				console.error(error);
			}
		})();
	}, [tokenURI]);

	useEffect(() => {
		if (!metadata) return;
		(async () => {
			setName("");
			try {
				const res = await fetch(parseURL(metadata));
				if (res.status === 200) {
					const data = await res.json();
					setName(data?.name);
				}
			} catch (error) {
				console.error(error);
			}
		})();
	}, [metadata]);

	return (
		<>
			{data?.attributes.length > 0 && (
				<div className="badge-card">
					<div className="badge-card-img center">
						<Image
							src={src}
							alt="badge"
							width={400}
							height={400}
							onError={() => setSrc("/assets/essence-placeholder.svg")}
							placeholder="blur"
							blurDataURL="/assets/essence-placeholder.svg"
						/>
					</div>
					<div>
						<div className="badge-card-title">
							{data.attributes[0]["value"]}
						</div>
						<div className="badge-card-detail">
							<div>
								<BsFillMicFill />
							</div>
							<div>{name}</div>
						</div>
						<div className="badge-card-detail">
							<div>
								<GoLocation />
							</div>
							<div>{data.attributes[2]["value"]}</div>
						</div>
						<div className="badge-card-detail">
							<div>
								<BsCalendar2Event />
							</div>
							<div>
								{data.attributes[1]["value"] &&
									new Date(
										Number(data.attributes[1]["value"])
									).toLocaleDateString()}
							</div>
						</div>
					</div>
					<div className="badge-collect">
						{isIndexed ? (
							<div className="badge-collect-btn-group">
								{isCollectedByMe ? (
									<CollectBtnWithGasless
										profileID={profileID}
										essenceID={essenceID}
										isCollectedByMe={isCollectedByMe}
									/>
								) : (
									<>
										<CollectBtnWithGasless
											profileID={profileID}
											essenceID={essenceID}
											isCollectedByMe={isCollectedByMe}
										/>
										<CollectBtnWithGas
											profileID={profileID}
											essenceID={essenceID}
											isCollectedByMe={isCollectedByMe}
										/>
									</>
								)}
							</div>
						) : (
							<Loader />
						)}
					</div>
				</div>
			)}
		</>
	);
};
