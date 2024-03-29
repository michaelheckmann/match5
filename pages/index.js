// import { motion } from "framer-motion";
// import Script from "next/script";

import { useState } from "react";

import Image from "next/image";
import Head from "next/head";
import Router from "next/router";
import useTranslation from "next-translate/useTranslation";

import Cookies from "universal-cookie";

import Modal from "react-modal";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast, CloseButton } from "../utilities/toast";

import Loading from "../components/Loading";

import { animalNames } from "../utilities/constants";
import makeRequest from "../utilities/request";
import LanguageSelector from "../components/LanguageSelector";

import sceneMobile from "../public/scene-mobile.jpg";
import sceneDesktop from "../public/scene-desktop.jpg";

// Anchor the modal, element set in _app.js
Modal.setAppElement("#modal-root");

export default function Home({ isMobile }) {
  const { t } = useTranslation("home");

  const [playerName, setPlayerName] = useState("");
  const [joinRoomName, setJoinRoomName] = useState("");
  const [categorySet, setCategorySet] = useState(0);
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [joinModalIsOpen, setJoinModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    if (e.target.name === "playerName") setPlayerName(e.target.value);
    if (e.target.name === "joinRoomName") setJoinRoomName(e.target.value);
    if (e.target.name === "categorySet") setCategorySet(e.target.value);
  }

  async function createRoom(e) {
    e.preventDefault();
    setIsLoading(true);

    // No player name
    if (!playerName) {
      setIsLoading(false);
      return showToast(t`common:not.error.missing-player-name`, "error");
    }

    let roomName;
    let maxTries = 20;
    let c = 0;

    while (!roomName && c != maxTries) {
      // Create a random animal name
      const animal =
        animalNames[Math.floor(Math.random() * animalNames.length)];

      // Check if room exists
      const json = await makeRequest(
        "room/getRoom",
        { roomName: animal },
        true
      );
      // No room found
      if (json.data.length === 0) {
        roomName = animal;
        break;
      }

      const createdDate = json.data[0].ts / 1000;
      const now = Date.now();

      // If room has been created more than 24 hours ago, delete it
      if (now - createdDate > 86400000) {
        await makeRequest("room/deleteRoom", {
          roomRefId: json.data[0].ref["@ref"].id,
        });

        roomName = animal;
        break;
      }

      c++;
    }
    // No room available
    if (c === maxTries) {
      setIsLoading(false);
      return showToast(t`common:not.error.no-room-available`, "error");
    }

    // Create room
    await makeRequest("room/createRoom", {
      roomName: roomName,
      playerName: playerName,
      host: playerName,
      categorySet: categorySet,
    });

    // Save player name to cookies
    const cookies = new Cookies();
    cookies.set("userName", playerName, {
      path: "/",
    });

    // Reroute to room
    Router.push(`/room/${roomName.toLowerCase()}`).finally(() => {
      setIsLoading(false);
    });
  }

  async function joinRoom(e) {
    e.preventDefault();
    setIsLoading(true);

    // No player name
    if (!playerName) {
      setIsLoading(false);
      return showToast(t`common:not.error.missing-player-name`, "error");
    }
    // No room name
    if (!joinRoomName) {
      setIsLoading(false);
      return showToast(t`common:not.error.missing-room-name`, "error");
    }
    const json = await makeRequest(
      "room/getRoom",
      {
        roomName: joinRoomName,
      },
      true
    );

    // No room found
    if (json.data.length === 0) {
      setIsLoading(false);
      return showToast(t`common:not.error.room-not-found`, "error");
    }

    // Player name is already in
    if (json.data[0].data.players.some((p) => p === playerName)) {
      setIsLoading(false);
      return showToast(t`common:not.error.player-already-in`, "error");
    }

    // Save player name to cookies
    const cookies = new Cookies();
    cookies.set("userName", playerName, {
      path: "/",
    });

    // Reroute to room
    Router.push(`/room/${joinRoomName.toLowerCase()}`).finally(() => {
      setIsLoading(false);
    });
  }

  return (
    <div>
      <Head>
        <title>{t`title`}</title>
        <meta name="description" content={t`description`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="absolute inset-0 bg-gray-100">
        {/*   {!isMobile && (
          <>
            <Script strategy="lazyOnload" type="module">
              {`import {Application} from '/runtime.js'; const app = new Application(); app.load('/scene.json');`}
            </Script>
            <canvas
              id="canvas3d"
              className="absolute inset-0 z-[9] w-full h-full"
            ></canvas>
          </>
        )} */}
        <div className="absolute inset-0 z-[8] w-full h-full">
          <div className="absolute w-full h-full -top-16">
            {isMobile ? (
              <Image
                alt="Match 5 Scene"
                src={sceneMobile}
                layout="fill"
                objectFit="cover"
                placeholder="blur"
                priority
              />
            ) : (
              <Image
                alt="Match 5 Scene"
                src={sceneDesktop}
                layout="fill"
                objectFit="cover"
                placeholder="blur"
                priority
              />
            )}
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-center w-screen overflow-x-hidden text-gray-700 h-screen-custom">
          <div className="w-full">
            {/* <h1 className="absolute top-40 sm:top-32 left-1/2 -ml-[200px] w-[400px] font-bold text-3xl sm:text-3xl text-center text-fuchsia-600 z-10">
              {t`title`}
            </h1> */}
            {/* <motion.div
              animate={{ rotate: 360, opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: 1, duration: 20, ease: "linear" }}
              className="absolute z-0 -translate-x-3 -top-12 sm:top-0 left-1/2 -ml-[150px] w-[300px] scale-75 sm:scale-100 bg-transparent"
            >
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path
                  className="fill-transparent stroke-fuchsia-400"
                  d="M44.6,-22.3C55,-7.9,58.5,14,49.9,32C41.4,50.1,20.7,64.3,-4.1,66.6C-28.8,69,-57.6,59.4,-68.5,40C-79.5,20.7,-72.5,-8.6,-58.1,-25.4C-43.7,-42.1,-21.8,-46.4,-2.4,-45.1C17.1,-43.7,34.3,-36.7,44.6,-22.3Z"
                  transform="translate(100 90)"
                />
              </svg>
            </motion.div>
            <motion.div
              animate={{ rotate: -360, opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: 1, duration: 20, ease: "linear" }}
              className="absolute z-0 -translate-x-3 -top-12 sm:top-0 left-1/2 -ml-[150px] w-[300px] scale-75 sm:scale-100 bg-transparent"
            >
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path
                  className=" fill-transparent stroke-pink-400"
                  d="M53.7,-61.5C68.3,-51.7,78,-33.6,79.9,-15.3C81.7,3.1,75.7,21.6,65.1,35.5C54.6,49.4,39.7,58.6,23,65.7C6.4,72.9,-11.9,77.9,-30.1,74.7C-48.2,71.5,-66.3,60.1,-72.3,44.4C-78.2,28.6,-72.1,8.5,-65.6,-8.6C-59,-25.6,-52,-39.6,-41,-50C-30,-60.4,-15,-67.2,2.3,-69.9C19.5,-72.6,39.1,-71.2,53.7,-61.5Z"
                  transform="translate(100 90)"
                />
              </svg>
            </motion.div> */}
            <Loading isLoading={isLoading} />
            {!isLoading && (
              <div className="flex flex-col items-center justify-center gap-10 px-4 mt-10 sm:flex-row sm:mt-0">
                <button
                  onClick={() => setCreateModalIsOpen(true)}
                  className="z-10 px-8 py-5 font-bold transition bg-white rounded-lg shadow sm:p-4 sm:hover:scale-105 sm:hover:-rotate-3 sm:hover:text-fuchsia-500"
                >
                  {t`create-room`}
                </button>
                <button
                  onClick={() => setJoinModalIsOpen(true)}
                  className="z-10 px-8 py-5 font-bold transition bg-white rounded-lg shadow sm:p-4 sm:hover:scale-105 sm:hover:rotate-3 sm:hover:text-fuchsia-500"
                >
                  {t`join-room`}
                </button>
              </div>
            )}

            {!isLoading && (
              <div className="absolute flex items-center justify-center w-full bottom-5">
                <LanguageSelector />
              </div>
            )}
          </div>
          <Modal
            isOpen={createModalIsOpen}
            onRequestClose={() => {
              setCreateModalIsOpen(false);
              setIsLoading(false);
            }}
            className="absolute transition min-h-[200px] z-50 w-11/12 p-5 overflow-y-auto text-gray-700 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg top-1/2 left-1/2 md:max-w-md"
            overlayClassName="bg-gray-500/10 fixed inset-0 z-40"
          >
            <div className="flex items-start justify-between w-full ">
              <div className="block mb-4 text-lg font-bold">{t`create-room`}</div>
              <button
                onClick={() => {
                  setCreateModalIsOpen(false);
                  setIsLoading(false);
                }}
                className="transition hover:rotate-180"
              >
                ✕
              </button>
            </div>
            {isLoading && (
              <div className="mt-8">
                <Loading isLoading={isLoading} />
              </div>
            )}
            {!isLoading && (
              <>
                {" "}
                <form onSubmit={createRoom}>
                  <p className="mb-3">{t`name-question`}</p>
                  <input
                    type="text"
                    value={playerName}
                    onChange={handleChange}
                    autoFocus={true}
                    autoComplete="off"
                    className="block w-full h-10 pr-12 border border-gray-300 rounded-md focus:ring-fuchsia-400 focus:border-fuchsia-300 focus:ring-2 focus:ring-offset-2 focus:outline-none pl-7 sm:text-sm"
                    name="playerName"
                  />
                  <p className="mt-4 mb-3">{t`set-question`}</p>
                  <select
                    name="categorySet"
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md select-triangle active:ring-transparent active:ring-1 active:ring-offset-4 active:ring-offset-fuchsia-400 active:outline-none sm:text-sm disabled:cursor-not-allowed"
                    onChange={handleChange}
                  >
                    <option value="0">{t`set-option-standard`}</option>
                    <option value="1">{t`set-option-english`}</option>
                  </select>
                  <button
                    type="submit"
                    className="float-right px-5 py-2 mt-6 font-bold text-white transition rounded bg-fuchsia-400 hover:bg-fuchsia-600 sm:hover:scale-105 sm:hover:rotate-3"
                  >
                    {t`create`}
                  </button>
                </form>
              </>
            )}
          </Modal>
          <Modal
            isOpen={joinModalIsOpen}
            onRequestClose={() => {
              setJoinModalIsOpen(false);
              setIsLoading(false);
            }}
            className="absolute transition min-h-[200px] z-50 w-11/12 p-5 overflow-y-auto text-gray-700 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg top-1/2 left-1/2 md:max-w-md"
            overlayClassName="bg-gray-500/10 fixed inset-0 z-40"
          >
            <div className="flex items-start justify-between w-full ">
              <div className="block mb-4 text-lg font-bold">{t`join-room`}</div>
              <button
                onClick={() => {
                  setJoinModalIsOpen(false);
                  setIsLoading(false);
                }}
                className="transition hover:rotate-180"
              >
                ✕
              </button>
            </div>
            {isLoading && (
              <div className="mt-8">
                <Loading isLoading={isLoading} />
              </div>
            )}
            {!isLoading && (
              <>
                {" "}
                <form onSubmit={joinRoom}>
                  <p className="mb-3">{t`name-question`}</p>
                  <input
                    type="text"
                    value={playerName}
                    onChange={handleChange}
                    autoFocus={true}
                    name="playerName"
                    autoComplete="off"
                    className="block w-full h-10 pr-12 mb-8 border border-gray-300 rounded-md focus:ring-fuchsia-400 focus:border-fuchsia-300 focus:ring-2 focus:ring-offset-2 focus:outline-none pl-7 sm:text-sm"
                  />
                  <p className="mb-3">{t`room-question`}</p>
                  <input
                    type="text"
                    value={joinRoomName}
                    onChange={handleChange}
                    name="joinRoomName"
                    autoComplete="off"
                    className="block w-full h-10 pr-12 border border-gray-300 rounded-md focus:ring-fuchsia-400 focus:border-fuchsia-300 focus:ring-2 focus:ring-offset-2 focus:outline-none pl-7 sm:text-sm"
                  />
                  <button
                    type="submit"
                    className="float-right px-5 py-2 mt-6 font-bold text-white transition rounded bg-fuchsia-400 hover:bg-fuchsia-600 sm:hover:scale-105 sm:hover:rotate-3"
                  >
                    {t`join`}
                  </button>
                </form>
              </>
            )}
          </Modal>
        </div>
      </div>

      <ToastContainer
        toastClassName={() =>
          "relative flex justify-between p-1 rounded-lg overflow-hidden text-red-400 bg-red-100 border border-red-500 shadow-lg mt-3 sm:mb-0 mb-4 sm:mx-0 mx-4"
        }
        bodyClassName={() => "flex text-sm font-semibold block p-3 w-full"}
        position="bottom-center"
        autoClose={10000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
        closeButton={CloseButton}
      />
    </div>
  );
}
export async function getServerSideProps(context) {
  const isMobile = (
    context.req ? context.req.headers["user-agent"] : navigator.userAgent
  ).match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i);

  // will be passed to the page component as props
  return {
    props: {
      isMobile,
    },
  };
}
