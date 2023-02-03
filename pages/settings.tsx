import { useContext } from "react";
import type { NextPage } from "next";
import { AuthContext } from "../context/auth";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import AccountCard from "../components/Cards/AccountCard";

const SettingsPage: NextPage = () => {
  const { accessToken, indexingProfiles, profiles } = useContext(AuthContext);

  return (
    <div className="container">
      <Navbar />
      <div className="wrapper">
        <div className="wrapper-content">
          <h1>Settings</h1>
          <hr></hr>
          <h2>Account</h2>
          <br></br>
          {!accessToken ? (
            <div>
              You need to <strong>Sign in</strong> to view details about your
              account.
            </div>
          ) : (
            <div>
              <div className="accounts">
                {profiles.length === 0 &&
                  (indexingProfiles.length > 0 ? (
                    <div>
                      {indexingProfiles.map((account) => (
                        <AccountCard
                          key={`${account.handle}-${account.profileID}`}
                          {...account}
                        />
                      ))}
                    </div>
                  ) : (
                    <div>You do not have a profile yet. </div>
                  ))}
                {profiles.length > 0 && (
                  <>
                    <div>
                      The list of all accounts associated to the connected
                      wallet.
                    </div>
                    <br></br>
                    {profiles.map((account) => (
                      <AccountCard
                        key={`${account.handle}-${account.profileID}`}
                        {...account}
                        isIndexed={true}
                      />
                    ))}
                    {indexingProfiles.length > 0 &&
                      indexingProfiles.map((account) => (
                        <AccountCard
                          key={`${account.handle}-${account.profileID}`}
                          {...account}
                        />
                      ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="wrapper-details">
          <Panel />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
