import { useState, useEffect } from "react";

import Image from "next/image";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";

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
import Reaction from "../../components/Reaction";

import { getRoom } from "../api/room/getRoom";
import getEmoji from "../../utilities/emoji";
import makeRequest from "../../utilities/request";

const displayTitle = (gameState, t) => {
  let round = 0;
  if (gameState.includes("roundOne")) round = 1;
  else if (gameState.includes("roundTwo")) round = 2;

  let title = "";
  if (gameState.includes("lobby")) title = t`lobby`;
  else if (gameState.includes("gameEnd")) title = t`game-summary`;
  else if (gameState.includes("ActionStart")) title = t`find-words`;
  else if (gameState.includes("PollStart")) title = t`rate-answers`;
  else if (gameState.includes("Start")) title = t`draw-categories`;

  return [round, title];
};

export const contextClass = {
  success: "text-green-400 bg-green-100 border-green-500",
  error: "text-red-400 bg-red-100 border-red-500",
  info: "text-gray-400 bg-gray-100 border-red-500",
  default: "text-slate-500 bg-slate-100 border-slate-500",
  warning:
    "text-gray-400 bg-transparent border-transparent p-0 shadow-none hover:opacity-70 transition",
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
  categorySetProp,
}) {
  const { t } = useTranslation("room");

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
  const [pollSubmittedCtr, setPollSubmittedCtr] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    if (userNameProp === hostNameProp) setIsHost(true);

    // Conig the Pusher channels
    let channels = new Pusher("e873b2def22638cce881", {
      cluster: "eu",
      authEndpoint: "/api/auth/pusherAuth",
    });

    let channel = channels.subscribe(`presence-${roomNameProp}`);

    channel.bind("playerJoined", (newPlayer) => {
      setPlayers((o) => (o.includes(newPlayer) ? o : [...o, newPlayer]));

      if (newPlayer === userNameProp) return;
      showToast(t(`not.info.player-joined`, { p: newPlayer }), "default", 5000);
    });

    channel.bind("playerLeft", (removedPlayer) => {
      setPlayers((o) => o.filter((p) => p !== removedPlayer));
      showToast(
        t(`not.info.player-left`, { p: removedPlayer }),
        "default",
        5000
      );
    });

    channel.bind("gameStateChanged", (newGameStateData) => {
      setGameState(newGameStateData.state);
      switch (newGameStateData.state) {
        case "roundOneStart":
          if (newGameStateData.userName === userNameProp) return;
          return showToast(
            t(`not.info.game-started`, { p: newGameStateData.userName }),
            "default",
            4000
          );
        case "roundTwoStart":
          return showToast(t`not.info.round-two-started`, "default", 4000);
        default:
          return;
      }
    });

    channel.bind("hostChanged", ({ host }) => {
      if (host === userNameProp) {
        setIsHost(true);
        return showToast(t`not.info.player-is-host`, "default", 4000);
      } else {
        setIsHost(false);
        return showToast(
          t(`not.info.host-changed`, { p: host }),
          "default",
          4000
        );
      }
    });

    channel.bind("categoriesSet", (categoriesSetData) => {
      switch (categoriesSetData.round) {
        case "roundOne":
          setRoundOneCategories(categoriesSetData.categories);
          if (categoriesSetData.userName === userNameProp) return;
          if (categoriesSetData.categories.length === 0) return;

          return showToast(
            t(`not.info.host-changed`, { p: categoriesSetData.userName }),
            "default",
            3000
          );
        case "roundTwo":
          setRoundTwoCategories(categoriesSetData.categories);
          if (categoriesSetData.userName === userNameProp) return;
          if (categoriesSetData.categories.length === 0) return;

          return showToast(
            t(`not.info.host-changed`, { p: categoriesSetData.userName }),
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
            t(`not.info.nine-left`, { p: triggerInputData.userName }),
            "success",
            3000
          );
        case "oneLeft":
          return showToast(
            t(`not.info.one-left`, { p: triggerInputData.userName }),
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
            t(`not.info.max-points-awarded`, { p: triggerSelectData.userName }),
            "success",
            3000
          );
        default:
          return;
      }
    });

    channel.bind("receiveGIF", (gifData) => {
      const Msg = () => (
        <div className="flex flex-col">
          <div className="flex items-center justify-center gap-1 mb-1 text-center">
            {gifData.userName}{" "}
            <div className="pt-[3px]">
              <Image
                src={getEmoji(gifData.userName, roomRefIdProp)}
                width={18}
                height={18}
                alt=""
              />
            </div>
          </div>
          <div className="flex items-center justify-center p-3 bg-gray-200 rounded-lg">
            <Image
              src={gifData.gif.url}
              alt={gifData.gif.description}
              width={200}
              height={150}
              objectFit="contain"
              className="rounded-lg"
            />
          </div>
        </div>
      );
      showToast(Msg, "gif", 5000);
    });

    channel.bind("pollSubmitted", (userName) => {
      setPollSubmittedCtr((c) => c + 1);
      if (userName === userNameProp) {
        showToast(t`not.info.poll-submitted`, "success", 3000);
      }
    });

    channel.bind("pageChanged", (pageChangedData) => {
      setPollPage(pageChangedData.pollPage);
    });

    channel.bind("pusher:member_removed", async (member) => {
      // isHost state not yet available
      if (userNameProp === hostNameProp) {
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
      const json = await makeRequest(
        "room/getRoom",
        { roomName: roomNameProp },
        true
      );
      if (json.data[0].data.players.every((p) => p !== userNameProp)) {
        await makeRequest("room/joinRoom", {
          roomRefId: roomRefIdProp,
          userName: userNameProp,
          roomName: roomNameProp,
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

  useEffect(() => {
    if (pollSubmittedCtr < players.length) return;
    setPollSubmittedCtr(0);

    if (isHost) changePageNumber();
  }, [pollSubmittedCtr]);

  async function changePageNumber() {
    setIsLoading(true);
    await makeRequest("game/setPageNumber", {
      pollPage: pollPage + 1,
      userName: userNameProp,
      roomName: roomNameProp,
      roomRefId: roomRefIdProp,
    });
    setIsLoading(false);
  }

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
        <title>{t(`title`, { room: roomNameProp })}</title>
        <meta
          name="description"
          content={t(`description`, { room: roomNameProp })}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <div className="grid w-full grid-cols-2 p-4 sm:grid-cols-3">
        <div className="flex flex-col text-sm sm:text-base">
          <div className="flex gap-1">
            <span className="font-bold">{t`room`}:</span> {roomNameProp}
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold">{t`host`}:</span>
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
          {displayTitle(gameState, t)[0] > 0 && (
            <div className="flex gap-1">
              <span className="font-bold">{t`round`}:</span>
              {displayTitle(gameState, t)[0]}
            </div>
          )}
        </div>
        <div className="order-last col-span-2 mt-4 text-lg font-bold text-center sm:text-xl place-self-center sm:order-none sm:col-span-1 sm:mt-0">
          {displayTitle(gameState, t)[1]}
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
              t={t}
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
              categorySet={categorySetProp}
              t={t}
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
              t={t}
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
              t={t}
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
              categorySet={categorySetProp}
              t={t}
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
              t={t}
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
              t={t}
            />
          )}

          {gameState === "gameEnd" && (
            <GameEnd
              players={players}
              userName={userNameProp}
              roomName={roomNameProp}
              roomRefId={roomRefIdProp}
              isHost={isHost}
              t={t}
            />
          )}

          {!gameState.includes("Action") && (
            <Reaction
              userName={userNameProp}
              roomName={roomNameProp}
              roomRefId={roomRefIdProp}
              t={t}
            />
          )}
        </div>
      )}

      <ToastContainer
        toastClassName={({ type }) =>
          contextClass[type || "default"] +
          " relative flex justify-between p-1 rounded-lg overflow-hidden border shadow-lg mt-3 sm:mb-0 mb-4 sm:mx-0 mx-4"
        }
        bodyClassName={({ type }) =>
          type === "warning"
            ? "p-0"
            : "p-3" + " flex text-sm font-semibold block w-full"
        }
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
      {/* JIT */}
      <div className="max-w-[200px] hidden shadow-none hover:opacity-70"></div>
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
      categorySetProp: room.categorySet,
    },
  };
}
