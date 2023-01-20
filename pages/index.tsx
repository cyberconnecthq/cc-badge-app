import { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import { AuthContext } from "../context/auth";
import { BadgeCard } from "../components/Cards/BadgeCard";
import { IBadgeCard } from "../types";
import { useLazyQuery } from "@apollo/client";
import { ESSENCES_BY_FILTER } from "../graphql";
import { FEATURED_BADGES } from "../helpers/constants";

const Home: NextPage = () => {
  const {
    accessToken,
    indexingBadges,
    badges,
    address
  } = useContext(AuthContext);
  const [getEssencesByFilter] = useLazyQuery(ESSENCES_BY_FILTER);
  const [featuredBadges, setFeaturedBadges] = useState<IBadgeCard[]>([]);

  useEffect(() => {
    const getEssences = async () => {
      console.log(`address: ${address}`)
      const { data } = await getEssencesByFilter({
        variables: {
          appID: "cyberconnect",
          address: address
        },
      });
      setFeaturedBadges([...data?.essenceByFilter]);
    };

    if (accessToken) {
      getEssences();
    } else {
      setFeaturedBadges(FEATURED_BADGES);
    }
  }, [accessToken]);


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
                featuredBadges.map(badge => (
                  <BadgeCard
                    key={`${badge.createdBy.profileID}-${badge.essenceID}`}
                    {...badge}
                    isIndexed={true}
                  />
                ))
              }
            </div>
            <br></br>
            <br></br>
            <h2>My badges</h2>
            <br></br>
            {
              !accessToken
                ? <div>You need to <strong>Sign in</strong> to view your badges.</div>
                : (
                  <div className="my-badges">
                    {
                      badges.length === 0 &&
                      (
                        indexingBadges.length > 0
                          ? (<div>
                            {
                              indexingBadges.length > 0 &&
                              indexingBadges.map(badge => (
                                <BadgeCard
                                  key={`${badge.createdBy.profileID}-${badge.essenceID}`}
                                  {...badge}
                                />
                              ))
                            }
                          </div>)
                          : <div>You haven&apos;t created any badges yet.</div>
                      )
                    }
                    {
                      badges.length > 0 &&
                      <div className="my-badges">
                        {
                          badges.map(badge => (
                            <BadgeCard
                              key={`${badge.createdBy.profileID}-${badge.essenceID}`}
                              {...badge}
                              isIndexed={true}
                            />
                          ))
                        }
                        {
                          indexingBadges.length > 0 &&
                          indexingBadges.map(badge => (
                            <BadgeCard
                              key={`${badge.createdBy.profileID}-${badge.essenceID}`}
                              {...badge}
                            />
                          ))
                        }
                      </div>
                    }
                  </div>
                )
            }
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
