import { useContext } from "react";
import { AuthContext } from "../../context/auth";
import { ModalContext } from "../../context/modal";
import SigninBtn from "../../components/Buttons/SigninBtn";
import PrimaryProfileCard from "../Cards/PrimaryProfileCard";

const Panel = () => {
    const { accessToken, primaryProfile } = useContext(AuthContext);
    const { handleModal } = useContext(ModalContext);

    return (
        <div className="panel">
            <div>
                {
                    primaryProfile &&
                    <PrimaryProfileCard {...primaryProfile} />
                }
                <div>
                    {!accessToken && <SigninBtn />}
                    {
                        !primaryProfile?.profileID &&
                        <button
                            className="signup-btn"
                            onClick={() => handleModal("signup", "")}
                        >Sign up</button>
                    }
                </div>
            </div>
        </div>
    );
};

export default Panel;
