import { useState, useEffect } from "react";

import Image from "next/image";
import Head from "next/head";

import Cookies from "universal-cookie";
import Pusher from "pusher-js";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { showToast, CloseButton } from "../../utilities/toast";

import { CgArrowsExchangeAlt } from "react-icons/cg";

import Lobby from "../../components/game-states/Lobby";
import Dice from "../../components/game-states/Dice";
import Action from "../../components/game-states/Action";
import Poll from "../../components/game-states/Poll";
import GameEnd from "../../components/game-states/GameEnd";
import Loading from "../../components/Loading";

import { getRoom } from "../api/room/getRoom";
import getEmoji from "../../utilities/getEmoji";
import makeRequest from "../../utilities/makeRequest";

const displayTitle = (gameState) => {
  let round = 0;
  if (gameState.includes("roundOne")) round = 1;
  else if (gameState.includes("roundTwo")) round = 2;

  let title = "";
  if (gameState.includes("lobby")) title = "Lobby";
  else if (gameState.includes("gameEnd")) title = "Spielzusammenfassung";
  else if (gameState.includes("ActionStart")) title = "Finde passende Wörter";
  else if (gameState.includes("PollStart")) title = "Bewerte die Antworten";
  else if (gameState.includes("Start")) title = "Ziehe fünf Kategorien";

  return [round, title];
};

const contextClass = {
  success: "text-green-400 bg-green-100 border-green-500",
  error: "text-red-400 bg-red-100 border-red-500",
  info: "text-gray-400 bg-gray-100 border-red-500",
  warning: "text-yellow-400 bg-yellow-100 border-yellow-500",
  default: "text-slate-500 bg-slate-100 border-slate-500",
  dark: "text-gray-400 bg-gray-100 border-gray-500",
};

export default function Room({
  roomNameProp,
  userNameProp,
  playerNamesProp,
  hostNameProp,
  roomRefIdProp,
  gameStateProp,
  roundOneCategoriesProp,
  roundTwoCategoriesProp,
  pollPageProp,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isHost, setIsHost] = useState(false);

  const [players, setPlayers] = useState(playerNamesProp);
  const [gameState, setGameState] = useState(gameStateProp);
  const [roundOneCategories, setRoundOneCategories] = useState(
    roundOneCategoriesProp
  );
  const [roundTwoCategories, setRoundTwoCategories] = useState(
    roundTwoCategoriesProp
  );
  const [pollPage, setPollPage] = useState(pollPageProp);

  useEffect(() => {
    setIsLoading(true);
    if (userNameProp === hostNameProp) setIsHost(true);

    // Conig the Pusher channels
    let channels = new Pusher("e873b2def22638cce881", {
      cluster: "eu",
      authEndpoint: "/api/pusherAuth",
    });

    let channel = channels.subscribe(`presence-${roomNameProp}`);

    channel.bind("playerJoined", (newPlayer) => {
      setPlayers((o) => [...o, newPlayer]);
      if (newPlayer === userNameProp) return;
      showToast(`${newPlayer} ist dem Raum beigetreten`, "default", 5000);
    });

    channel.bind("playerLeft", (removedPlayer) => {
      setPlayers((o) => o.filter((p) => p !== removedPlayer));
      showToast(`${removedPlayer} hat den Raum verlassen`, "default", 5000);
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

    channel.bind("hostChanged", ({ host }) => {
      if (host === userNameProp) {
        setIsHost(true);
        return showToast(`Du bist nun Spielleiter`, "default", 4000);
      } else {
        setIsHost(false);
        return showToast(`${host} ist nun Spielleiter`, "default", 4000);
      }
    });

    channel.bind("categoriesSet", (categoriesSetData) => {
      switch (categoriesSetData.round) {
        case "roundOne":
          setRoundOneCategories(categoriesSetData.categories);
          if (categoriesSetData.userName === userNameProp) return;
          if (categoriesSetData.categories.length === 0) return;

          return showToast(
            `${categoriesSetData.userName} hat die Kategorien bestimmt`,
            "default",
            3000
          );
        case "roundTwo":
          setRoundTwoCategories(categoriesSetData.categories);
          if (categoriesSetData.userName === userNameProp) return;
          if (categoriesSetData.categories.length === 0) return;

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

    channel.bind("triggerSelectNot", (triggerSelectData) => {
      if (triggerSelectData.addresseeName !== userNameProp) return;

      switch (triggerSelectData.message) {
        case "maxPointsAwarded":
          return showToast(
            `${triggerSelectData.userName} findert dein Wort höchst kreativ`,
            "success",
            3000
          );
        default:
          return;
      }
    });

    channel.bind("pageChanged", (pageChangedData) => {
      setPollPage(pageChangedData.pollPage);
    });

    channel.bind("pusher:member_removed", async (member) => {
      // isHost state not yet available
      if (userNameProp === hostNameProp) {
        console.log(member.id, member.info.name);
        await makeRequest("room/leaveRoom", {
          roomRefId: roomRefIdProp,
          userName: member.info.name,
          roomName: roomNameProp,
        });
      }
    });

    // Wait until the subscription has succeeded
    channel.bind("pusher:subscription_succeeded", async ({ members }) => {
      // If the user has not created the room, add him to the players
      // If the player is already in the room, don't add him again
      console.log("pusher:subscription_succeeded");
      if (playerNamesProp.every((p) => p !== userNameProp)) {
        await makeRequest("room/joinRoom", {
          roomRefId: roomRefIdProp,
          userName: userNameProp,
          roomName: roomNameProp,
        });
      }
    });

    console.log("channel.members", channel.members);

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

  async function changeHost() {
    if (isHost) return;
    await makeRequest("room/setHost", {
      host: userNameProp,
      roomRefId: roomRefIdProp,
      roomName: roomNameProp,
    });
  }

  return (
    <div
      className={
        "relative flex flex-col text-gray-700 bg-gray-100 min-h-screen-custom max-w-6xl w-full"
      }
    >
      <Head>
        <title>Match5: {roomNameProp}</title>
        <meta name="description" content={"Spiel " + roomNameProp} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <div className="grid w-full grid-cols-2 p-4 sm:grid-cols-3">
        <div className="flex flex-col text-sm sm:text-base">
          <div className="flex gap-1">
            <span className="font-bold">Raum:</span> {roomNameProp}
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold">Spielleiter:</span>
            {hostNameProp}{" "}
            <span
              className={
                (isHost
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-fuchsia-400 hover:text-fuchsia-500 cursor-pointer hover:scale-105 hover:rotate-180") +
                " inline-block text-xl font-bold tracking-tighter transition"
              }
              onClick={changeHost}
            >
              <CgArrowsExchangeAlt />
            </span>
          </div>
          {displayTitle(gameState)[0] > 0 && (
            <div className="flex gap-1">
              <span className="font-bold">Runde:</span>
              {displayTitle(gameState)[0]}
            </div>
          )}
        </div>
        <div className="order-last col-span-2 mt-4 text-lg font-bold text-center sm:text-xl place-self-center sm:order-none sm:col-span-1 sm:mt-0">
          {displayTitle(gameState)[1]}
        </div>
        <div className="flex flex-wrap items-start justify-end max-w-md gap-1">
          {players.map((p) => (
            <div
              className="flex items-center justify-center gap-1 px-2 py-1 text-sm font-medium leading-tight text-gray-500 bg-gray-200 border border-gray-300 rounded-lg shadow-sm sm:px-3 sm:py-2 grow-0"
              key={p}
            >
              {p}
              <div className="pt-[3px]">
                <Image
                  src={getEmoji(p, roomRefIdProp)}
                  width={18}
                  height={18}
                  alt=""
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Loading isLoading={isLoading} />

      {/* Main Body */}
      {!isLoading && (
        <div className="flex flex-col flex-auto w-full h-full p-4">
          {gameState === "lobby" && (
            <Lobby
              players={players}
              userName={userNameProp}
              roomName={roomNameProp}
              roomRefId={roomRefIdProp}
              isHost={isHost}
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
              isHost={isHost}
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
              isHost={isHost}
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
              pollPage={pollPage}
              isHost={isHost}
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
              isHost={isHost}
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
              isHost={isHost}
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
              pollPage={pollPage}
              isHost={isHost}
            />
          )}

          {gameState === "gameEnd" && (
            <GameEnd
              players={players}
              userName={userNameProp}
              roomName={roomNameProp}
              roomRefId={roomRefIdProp}
              isHost={isHost}
            />
          )}
        </div>
      )}

      <ToastContainer
        toastClassName={({ type }) =>
          contextClass[type || "default"] +
          " relative flex justify-between p-1 rounded-lg overflow-hidden border shadow-lg mt-3 sm:mb-0 mb-4 sm:mx-0 mx-4"
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

// By default room name in URL is lowercase
// Room name in DB and Frontend is capital case
function capFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export async function getServerSideProps(context) {
  // Get the room data
  const resRoom = await getRoom(capFirstLetter(context.params.roomId));

  // Check if room exists
  if (!resRoom) return { redirect: { destination: "/", permanent: false } };

  const rooms = resRoom.data;
  if (rooms.length === 0)
    return { redirect: { destination: "/", permanent: false } };

  const cookies = new Cookies(context.req.headers.cookie);
  const userName = cookies.get("userName");
  const room = rooms[0].data;
  const refId = rooms[0].ref.id;

  // will be passed to the page component as props
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
      pollPageProp: room.pollPage,
    },
  };
}
