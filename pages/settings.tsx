import { useContext } from "react";
import type { NextPage } from "next";
import { AuthContext } from "../context/auth";
import { ModalContext } from "../context/modal";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import AccountCard from "../components/Cards/AccountCard";
import AccountPlaceholder from "../components/Placeholders/AccountPlaceholder";
import { IAccountCard } from "../types";

const SettingsPage: NextPage = () => {
    const { address, accessToken, primayProfileID, isCreatingProfile, profiles } = useContext(AuthContext);
    const { handleModal } = useContext(ModalContext);

    return (
        <div className="container">
            <Navbar />
            <div className="wrapper">
                <div className="wrapper-content">
                    <h1>Settings</h1>
                    <hr></hr>
                    {
                        !(accessToken && address && primayProfileID)
                            ? <div>You need to <strong>Sign in</strong> and <strong>Sign up</strong> to view details about your account.</div>
                            : (<div>
                                <h2>Account</h2>
                                <p>The list of all accounts associated to the wallet address.</p>
                                <div className="accounts">
                                    {
                                        profiles.length > 0 &&
                                        profiles.map((account: IAccountCard, index: number) => (
                                            <AccountCard
                                                key={index}
                                                profileID={account.profileID}
                                                handle={account.handle}
                                                avatar={account.avatar}
                                                metadata={account.metadata}
                                                isPrimary={account.isPrimary}
                                            />
                                        ))
                                    }
                                    {
                                        isCreatingProfile &&
                                        <AccountPlaceholder />
                                    }
                                </div>
                            </div>)
                    }
                </div>
                <div className="wrapper-details">
                    <Panel />
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
