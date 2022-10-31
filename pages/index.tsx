import { useContext } from "react";
import type { NextPage } from "next";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import { AuthContext } from "../context/auth";
import { BadgeCard } from "../components/Cards/BadgeCard";
import { IBadgeCard } from "../types";
import BadgePlaceholder from "../components/Placeholders/BadgePlaceholder";

const Home: NextPage = () => {
  const { address, accessToken, primayProfileID, isCreatingBadge, badges } = useContext(AuthContext);
  const featuredBadges = [
    {
      essenceID: 4,
      tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmS4vgKoaHvYyUpNNYso1mMf5hweBHfkM2pDDWy4SsDTc1",
      createdBy: {
        profileID: 15,
        metadata: "QmRiyArHF4abhXo4pdKVQj3fVg6jLvcnH4DitVijuTaoyq"
      }
    },
    {
      essenceID: 13,
      tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmQiiAsGHZaCRvLcYy7CjuP1aX3Qee8FMh5YHxG1HXwSDY",
      createdBy: {
        profileID: 44,
        metadata: "QmUoU9be1DGKUiVwEjvbw9dMRrRNK4TX7A57YL4NBe4hQa"
      }
    },
    {
      essenceID: 15,
      tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmedVZGUJtQwQ17h3VF2TqnuWr66sENcUccQGDgYucyWQW",
      createdBy: {
        profileID: 44,
        metadata: "QmUoU9be1DGKUiVwEjvbw9dMRrRNK4TX7A57YL4NBe4hQa"
      }
    },
  ];

  return (
    <div className="container">
      <Navbar />
      <div className="wrapper">
        <div className="wrapper-content">
          <h1>Badges</h1>
          <hr></hr>
          <div className="badges">
            <h2>Featured</h2>
            <br></br>
            <div className="featured-badges">
              {
                featuredBadges.length > 0 &&
                featuredBadges.map((badge: IBadgeCard, index: number) => (
                  <BadgeCard
                    key={index}
                    essenceID={badge.essenceID}
                    tokenURI={badge.tokenURI}
                    createdBy={badge.createdBy}
                  />
                ))
              }
            </div>
            <br></br>
            <br></br>
            <h2>My badges</h2>
            <br></br>
            <div>
              {
                !(accessToken && address && primayProfileID)
                  ? <div>You need to <strong>Sign in</strong> and <strong>Sign up</strong> to view your badges.</div>
                  : (<div className="my-badges">
                    {
                      badges.length === 0
                        ? <div>You do not have any badges yet.</div>
                        : badges.map((badge, index) => (
                          <BadgeCard
                            key={index}
                            essenceID={badge.essenceID}
                            tokenURI={badge.tokenURI}
                            createdBy={badge.createdBy}
                          />
                        ))
                    }
                    {
                      !isCreatingBadge &&
                      <BadgePlaceholder />
                    }
                  </div>)
              }
            </div>
          </div>
        </div>
        <div className="wrapper-details">
          <Panel />
        </div>
      </div>
    </div>
  )
}

export default Home;
