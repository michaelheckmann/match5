import React, { useRef } from "react";
import Cookies from "universal-cookie";
import { useState, useEffect } from "react";
import { getRoom } from "./api/room/getRoom";
import Router from "next/router";
import Pusher from "pusher-js";
import { emojis } from "../utilities/constants";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "../utilities/toast";
import Lobby from "../components/game-states/Lobby";
import Dice from "../components/game-states/Dice";
import Action from "../components/game-states/Action";
import Poll from "../components/game-states/Poll";
import GameEnd from "../components/game-states/GameEnd";
import Head from "next/head";
import Loading from "../components/Loading";

const getEmoji = (name) => {
  let s = 0;
  Array(name.length)
    .fill()
    .forEach((_, i) => {
      s += name.charCodeAt(i);
    });
  return name + " " + emojis[s % emojis.length];
};

const displayTitle = (gameState) => {
  switch (gameState) {
    case "lobby":
      return "Lobby";
    case "roundOneStart":
      return "Runde 1: Ziehe die Kategorien";
    case "roundTwoStart":
      return "Runde 2: Ziehe die Kategorien";
    case "roundOneActionStart":
      return "Runde 1: Finde passende Wörter";
    case "roundTwoActionStart":
      return "Runde 2: Finde passende Wörter";
    case "roundOnePollStart":
      return "Runde 1: Bewerte die Wörter";
    case "roundTwoPollStart":
      return "Runde 2: Bewerte die Wörter";
    case "gameEnd":
      return "Spielzusammenfassung";
    default:
      return "";
  }
};

const CloseButton = ({ closeToast }) => (
  <div onClick={closeToast} className="">
    ✕
  </div>
);

const contextClass = {
  success: "text-green-400 bg-green-100 border-green-500",
  error: "text-red-400 bg-red-100 border-red-500",
  info: "text-gray-400 bg-gray-100 border-red-500",
  warning: "text-yellow-400 bg-yellow-100 border-yellow-500",
  default: "text-slate-500 bg-slate-100 border-slate-500",
  dark: "text-gray-400 bg-gray-100 border-gray-500",
};

export default function Room({
  isAuthenticated,

  roomNameProp,
  userNameProp,
  playerNamesProp,
  hostNameProp,
  roomRefIdProp,
  gameStateProp,
  roundOneCategoriesProp,
  roundTwoCategoriesProp,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState(playerNamesProp);
  const [gameState, setGameState] = useState(gameStateProp);
  const [roundOneCategories, setRoundOneCategories] = useState(
    roundOneCategoriesProp
  );
  const [roundTwoCategories, setRoundTwoCategories] = useState(
    roundTwoCategoriesProp
  );
  const channelRef = useRef(null);

  useEffect(async () => {
    setIsLoading(true);

    // First check if the user has entered the correct password
    if (!isAuthenticated) {
      setIsLoading(false);
      Router.push("/login");
    }
    // Check if the user has a name
    if (!userNameProp) {
      setIsLoading(false);
      Router.push("/");
    }

    // Conig the Pusher channels
    let channels = new Pusher("e873b2def22638cce881", {
      cluster: "eu",
    });

    let channel = channels.subscribe(roomNameProp);
    // To pass on to the poll component
    channelRef.current = channel;

    channel.bind("playerJoined", (newPlayer) => {
      if (newPlayer === userNameProp) return;
      setPlayers((o) => [...o, newPlayer]);
      showToast(`${newPlayer} ist dem Raum beigetreten`, "default", 5000);
    });

    channel.bind("gameStateChanged", (newGameStateData) => {
      setGameState(newGameStateData.state);
      switch (newGameStateData.state) {
        case "roundOneStart":
          if (newGameStateData.userName === userNameProp) return;
          return showToast(
            `${newGameStateData.userName} hat das Spiel gestartet`,
            "default",
            4000
          );
        case "roundTwoStart":
          return showToast(
            `Alle Anschnallen. Es geht in die zweite Runde`,
            "default",
            4000
          );
        default:
          return;
      }
    });

    channel.bind("categoriesSet", (categoriesSetData) => {
      switch (categoriesSetData.round) {
        case "roundOne":
          setRoundOneCategories(categoriesSetData.categories);
          if (categoriesSetData.userName === userNameProp) return;
          return showToast(
            `${categoriesSetData.userName} hat die Kategorien bestimmt`,
            "default",
            3000
          );
        case "roundTwo":
          setRoundTwoCategories(categoriesSetData.categories);
          if (categoriesSetData.userName === userNameProp) return;
          return showToast(
            `${categoriesSetData.userName} hat die Kategorien bestimmt`,
            "default",
            3000
          );
        default:
          return;
      }
    });

    channel.bind("triggerInputNot", (triggerInputData) => {
      if (triggerInputData.userName === userNameProp) return;

      switch (triggerInputData.message) {
        case "nineLeft":
          return showToast(
            `${triggerInputData.userName} hat schon ein Wort gefunden`,
            "success",
            3000
          );
        case "oneLeft":
          return showToast(
            `${triggerInputData.userName} fehlt nur noch ein Wort`,
            "success",
            3000
          );
        default:
          return;
      }
    });

    // Wait until the subscription has succeeded
    channel.bind("pusher:subscription_succeeded", async () => {
      // If the user has not created the room, add him to the players
      // If the player is already in the room, don't add him again
      if (userNameProp !== hostNameProp && !players.includes(userNameProp)) {
        await fetch("api/room/joinRoom", {
          body: JSON.stringify({
            roomRefId: roomRefIdProp,
            userName: userNameProp,
            roomName: roomNameProp,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });
      }
    });
    channel.bind("pusher:subscription_error", (error) => {
      console.error(error);
    });
    setIsLoading(false);

    return () => {
      setIsLoading(false);
      channel.unbind();
      channels.unsubscribe(roomNameProp);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center w-screen h-screen overflow-y-scroll text-gray-700 bg-gray-100">
      <Head>
        <title>Match5: {roomNameProp}</title>
        <meta name="description" content={"Spiel " + roomNameProp} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <div className="z-50 flex items-start justify-between w-full p-4">
        <div className="">
          <span className="font-bold">Raum:</span> {roomNameProp}
        </div>
        <div className="font-bold text-xl absolute top-6 text-center left-1/2 w-[400px] -ml-[200px]">
          {displayTitle(gameState)}
        </div>
        <div className="flex flex-wrap items-start justify-end max-w-md gap-1">
          {players.map((p) => (
            <div
              className="px-3 py-2 text-sm font-medium leading-tight text-gray-500 bg-gray-200 border border-gray-300 rounded-lg shadow-sm grow-0"
              key={p}
            >
              {getEmoji(p)}
            </div>
          ))}
        </div>
      </div>

      <Loading isLoading={isLoading} />

      {/* Main Body */}
      {!isLoading && (
        <div className="absolute inset-0 w-screen h-screen">
          {gameState === "lobby" && (
            <Lobby
              players={players}
              userName={userNameProp}
              roomName={roomNameProp}
              roomRefId={roomRefIdProp}
            />
          )}

          {/* ROUND ONE */}

          {gameState === "roundOneStart" && (
            <Dice
              players={players}
              userName={userNameProp}
              roomName={roomNameProp}
              roomRefId={roomRefIdProp}
              round="roundOne"
              categoriesProp={roundOneCategories}
            />
          )}

          {gameState === "roundOneActionStart" && (
            <Action
              players={players}
              userName={userNameProp}
              roomName={roomNameProp}
              roomRefId={roomRefIdProp}
              round="roundOne"
              categories={roundOneCategories}
            />
          )}

          {gameState === "roundOnePollStart" && (
            <Poll
              players={players}
              userName={userNameProp}
              roomName={roomNameProp}
              roomRefId={roomRefIdProp}
              round="roundOne"
              categories={roundOneCategories}
              channel={channelRef.current}
            />
          )}

          {/* ROUND TWO */}

          {gameState === "roundTwoStart" && (
            <Dice
              players={players}
              userName={userNameProp}
              roomName={roomNameProp}
              roomRefId={roomRefIdProp}
              round="roundTwo"
              categoriesProp={roundTwoCategories}
            />
          )}

          {gameState === "roundTwoActionStart" && (
            <Action
              players={players}
              userName={userNameProp}
              roomName={roomNameProp}
              roomRefId={roomRefIdProp}
              round="roundTwo"
              categories={roundTwoCategories}
            />
          )}

          {gameState === "roundTwoPollStart" && (
            <Poll
              players={players}
              userName={userNameProp}
              roomName={roomNameProp}
              roomRefId={roomRefIdProp}
              round="roundTwo"
              categories={roundTwoCategories}
              channel={channelRef.current}
            />
          )}

          {gameState === "gameEnd" && (
            <GameEnd
              players={players}
              userName={userNameProp}
              roomName={roomNameProp}
              roomRefId={roomRefIdProp}
            />
          )}
        </div>
      )}

      <ToastContainer
        toastClassName={({ type }) =>
          contextClass[type || "default"] +
          " relative flex justify-between p-1 rounded-lg overflow-hidden border shadow-lg mt-3"
        }
        bodyClassName={() => "flex text-sm font-semibold block p-3 w-full"}
        position="bottom-center"
        autoClose={10000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        closeButton={CloseButton}
      />
    </div>
  );
}

export async function getServerSideProps(context) {
  // Check if room exists
  const res = await getRoom(context.params.roomId);
  if (!res) return { redirect: { destination: "/" } };

  const rooms = res.data;
  if (rooms.length === 0) return { redirect: { destination: "/" } };

  const cookies = new Cookies(context.req.headers.cookie);
  const userName = cookies.get("userName");

  if (!userName) return { redirect: { destination: "/" } };

  const room = rooms[0].data;
  const refId = rooms[0].ref.id;
  return {
    props: {
      roomNameProp: room.name,
      roomRefIdProp: refId,
      playerNamesProp: room.players,
      hostNameProp: room.host,
      userNameProp: userName,
      gameStateProp: room.gameState,
      roundOneCategoriesProp: room.roundOneCategories,
      roundTwoCategoriesProp: room.roundTwoCategories,
    }, // will be passed to the page component as props
  };
}
