import { useState, ChangeEvent } from "react";
import { IBadgeInput } from "../../types";
import BadgeBtn from "../Buttons/BadgeBtn";

const BadgeForm = () => {
    const [badgeInput, setBadgeInput] = useState<IBadgeInput>({
        nftImageURL: "",
        title: "",
        venue: "twitter",
        date: Number(Date.now()),
    });

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setBadgeInput({
            ...badgeInput,
            [name]: name === "date" ? new Date(value).getTime() : value
        });
    };

    return (
        <div className="form badge-form">
            <h2>Create badge</h2>
            <div>
                <label>NFT image url</label>
                <input
                    name="nftImageURL"
                    value={badgeInput.nftImageURL}
                    onChange={handleOnChange}
                    placeholder="https://"
                ></input>
            </div>
            <div>
                <label>Event name</label>
                <input
                    name="title"
                    value={badgeInput.title}
                    onChange={handleOnChange}
                ></input>
            </div>
            <div>
                <label>Event date</label>
                <input
                    name="date"
                    value={badgeInput.date}
                    onChange={handleOnChange}
                    type="date"
                ></input>
            </div>
            <div className="form-badge-venue">
                <div>Event venue</div>
                <div>
                    <label>Twitter
                        <input type="radio" name="venue" value="twitter" defaultChecked onChange={handleOnChange} />
                    </label>
                    <label>Discord
                        <input type="radio" name="venue" value="discord" onChange={handleOnChange} />
                    </label>
                </div>
            </div>
            <div className="form-note"><strong>Note:</strong> For empty fields we will randomly generate values.</div>
            <BadgeBtn {...badgeInput} />
        </div>
    );
};

export default BadgeForm;
