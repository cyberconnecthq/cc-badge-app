import type { NextPage } from "next";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import { EventCard } from "../components/Cards/EventCard";
import { IEventCard } from "../types";

const Home: NextPage = () => {
  const events = [
    {
      handle: "ccprotocol",
      name: "CyberConnect",
      profileID: 15,
      essenceID: 4,
      tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmS4vgKoaHvYyUpNNYso1mMf5hweBHfkM2pDDWy4SsDTc1"
    },
    {
      handle: "snowdot",
      name: "Snowdot",
      profileID: 44,
      essenceID: 13,
      tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmQiiAsGHZaCRvLcYy7CjuP1aX3Qee8FMh5YHxG1HXwSDY"
    },
    {
      handle: "samer",
      name: "Samer",
      profileID: 2,
      essenceID: 11,
      tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmbRbn9BVfLc978pgkAW1CxhVTwiB3xux8T1MnNMZh1pap"
    },
    {
      handle: "snowdot",
      name: "Snowdot",
      profileID: 44,
      essenceID: 14,
      tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmPKHdpKH1qLx1xcvE6fn53xHDbkyjsUBfAe85Y7PTqsnk"
    },
    {
      handle: "snowdot",
      name: "Snowdot",
      profileID: 44,
      essenceID: 15,
      tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmedVZGUJtQwQ17h3VF2TqnuWr66sENcUccQGDgYucyWQW"
    },
  ];

  return (
    <div className="container">
      <Navbar />
      <div className="wrapper">
        <div className="wrapper-content">
          <h1>Events</h1>
          <hr></hr>
          <div className="events">
            {
              events.length > 0 &&
              events.map((post: IEventCard, index: number) => (
                <EventCard
                  key={index}
                  essenceID={post.essenceID}
                  profileID={post.profileID}
                  tokenURI={post.tokenURI}
                  handle={post.handle}
                  name={post.name}
                />
              ))
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
