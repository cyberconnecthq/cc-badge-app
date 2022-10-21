import { useContext } from "react";
import { AuthContext } from "../../context/auth";
import SigninBtn from "../../components/Buttons/SigninBtn";
import ConnectBtn from "../../components/Buttons/ConnectBtn";
import SignupBtn from "../../components/Buttons/SignupBtn";

const Panel = () => {
    const { provider, address, accessToken, profileID } = useContext(AuthContext);
    return (
        <div className="panel">
            {
                (provider && address) ?
                    <div>
                        {!accessToken && <SigninBtn />}
                        {!profileID && <SignupBtn />}
                    </div>
                    : <ConnectBtn />

            }
        </div>
    );
};

export default Panel;
