import { useContext } from "react";
import { AuthContext } from "../../context/auth";
import { ModalContext } from "../../context/modal";
import SigninBtn from "../../components/Buttons/SigninBtn";
import ConnectBtn from "../../components/Buttons/ConnectBtn";

const Panel = () => {
    const { provider, address, accessToken } = useContext(AuthContext);
    const { handleModal } = useContext(ModalContext);

    return (
        <div className="panel">
            {
                (provider && address) ?
                    <div>
                        {!accessToken && <SigninBtn />}
                        <button
                            className="signup-btn"
                            onClick={() => handleModal("signup", "")}
                        >Sign up</button>
                    </div>
                    : <ConnectBtn />
            }
        </div>
    );
};

export default Panel;
