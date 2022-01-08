import Head from "next/head";
import Router from "next/router";
import Cookies from "universal-cookie";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import React from "react";
import { animalNames } from "../utilities/constants";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "../utilities/toast";
import Loading from "../components/Loading";
import makeRequest from "../utilities/makeRequest";

Modal.setAppElement("#modal-root");

const CloseButton = ({ closeToast }) => (
  <div onClick={closeToast} className="pr-1 text-red-500">
    ✕
  </div>
);

export default function Home({ isAuthenticated }) {
  // First check if the user has entered the correct password
  useEffect(() => {
    if (!isAuthenticated) Router.push("/login");
  }, []);

  const [playerName, setPlayerName] = useState("");
  const [joinRoomName, setJoinRoomName] = useState("");
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [joinModalIsOpen, setJoinModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    if (e.target.name === "playerName") setPlayerName(e.target.value);
    if (e.target.name === "joinRoomName") setJoinRoomName(e.target.value);
  }

  async function createRoom(e) {
    e.preventDefault();
    setIsLoading(true);

    // No player name
    if (!playerName) {
      setIsLoading(false);
      return showToast(
        "Gebe einen Spielernamen ein, um den Raum zu erstellen",
        "error"
      );
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
      return showToast(
        "Kein Raum verfügbar. Probiere es später erneut",
        "error"
      );
    }

    // Create room
    await makeRequest("room/createRoom", {
      roomName: roomName,
      playerName: playerName,
      host: playerName,
    });

    // Save player name to cookies
    const cookies = new Cookies();
    cookies.set("userName", playerName, {
      path: "/",
    });

    // Reroute to room
    Router.push(`/${roomName}`).then(() => {
      setIsLoading(false);
    });
  }

  async function joinRoom(e) {
    e.preventDefault();
    setIsLoading(true);

    // No player name
    if (!playerName) {
      setIsLoading(false);
      return showToast(
        "Gebe einen Spielernamen ein, um dem Raum beizutreten",
        "error"
      );
    }
    // No room name
    if (!joinRoomName) {
      setIsLoading(false);
      return showToast(
        "Gebe den Namen des Raum ein, dem du beitreten möchtest",
        "error"
      );
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
      return showToast("Kein Raum mit diesem Namen gefunden", "error");
    }

    // Player name is already in
    if (json.data[0].data.players.some((p) => p === playerName)) {
      setIsLoading(false);
      return showToast(
        "Es existiert schon ein Spieler mit dem Namen in diesem Raum. Wähle einen anderen Namen",
        "error"
      );
    }

    // Save player name to cookies
    const cookies = new Cookies();
    cookies.set("userName", playerName, {
      path: "/",
    });

    // Reroute to room
    Router.push(`/${joinRoomName}`).then(() => {
      setIsLoading(false);
    });
  }

  return (
    <div>
      <Head>
        <title>Match5: Lobby</title>
        <meta name="description" content="Spiellobby" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative flex items-center justify-center w-screen h-screen text-gray-700 bg-gray-100 overflow-x-hidden">
        <div className="w-full">
          <h1 className="absolute top-28 sm:top-32 left-1/2 -ml-[200px] w-[400px] font-bold text-2xl sm:text-3xl text-center text-fuchsia-600 z-10">
            Match 5: Lobby
          </h1>
          <svg
            className="absolute z-0 rotate-90 -top-12 sm:top-0 left-1/2 -ml-[200px] w-[400px] stroke-fuchsia-500 fill-transparent scale-75 sm:scale-100"
            xmlns="http://www.w3.org/2000/svg"
            width="450"
            height="450"
            viewBox="0 0 600 600"
          >
            <g transform="translate(230,320)">
              <path
                d="M108.7,-102.8C139.7,-47.8,163,-2.6,157.3,41.4C151.6,85.4,117,128.3,71.9,150.5C26.8,172.7,-28.9,174.2,-85.4,155.4C-141.9,136.6,-199.1,97.6,-217.2,42.6C-235.3,-12.3,-214.2,-83.2,-171.5,-140.9C-128.7,-198.7,-64.4,-243.3,-12.8,-233.2C38.8,-223,77.7,-157.9,108.7,-102.8Z"
                fill=""
              />
            </g>
          </svg>
          <svg
            className="absolute z-0 rotate-90 -translate-x-3 -top-12 sm:top-0 left-1/2 -ml-[200px] w-[400px] stroke-pink-400 fill-transparent scale-75 sm:scale-100"
            xmlns="http://www.w3.org/2000/svg"
            width="450"
            height="450"
            viewBox="0 0 600 600"
          >
            <g transform="translate(230,320)">
              <path
                d="M108.7,-102.8C139.7,-47.8,163,-2.6,157.3,41.4C151.6,85.4,117,128.3,71.9,150.5C26.8,172.7,-28.9,174.2,-85.4,155.4C-141.9,136.6,-199.1,97.6,-217.2,42.6C-235.3,-12.3,-214.2,-83.2,-171.5,-140.9C-128.7,-198.7,-64.4,-243.3,-12.8,-233.2C38.8,-223,77.7,-157.9,108.7,-102.8Z"
                fill=""
              />
            </g>
          </svg>

          <Loading isLoading={isLoading} />

          {!isLoading && (
            <div className="flex flex-col items-center justify-center gap-10 px-4 mt-10 sm:flex-row sm:mt-0">
              <button
                onClick={() => setCreateModalIsOpen(true)}
                className="z-10 px-8 py-5 font-bold transition bg-white rounded-lg shadow sm:p-4 sm:hover:scale-105 sm:hover:-rotate-3 sm:hover:text-fuchsia-500"
              >
                Raum erstellen
              </button>
              <button
                onClick={() => setJoinModalIsOpen(true)}
                className="z-10 px-8 py-5 font-bold transition bg-white rounded-lg shadow sm:p-4 sm:hover:scale-105 sm:hover:rotate-3 sm:hover:text-fuchsia-500"
              >
                Raum beitreten
              </button>
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
            <div className="block mb-4 text-lg font-bold">Raum erstellen</div>
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
          <div className="mt-8">
            <Loading isLoading={isLoading} />
          </div>
          {!isLoading && (
            <>
              {" "}
              <form onSubmit={createRoom}>
                <p className="mb-3">Wie ist dein Name?</p>
                <input
                  type="text"
                  value={playerName}
                  onChange={handleChange}
                  autoFocus={true}
                  autoComplete="off"
                  className="block w-full h-10 pr-12 border border-gray-300 rounded-md focus:ring-fuchsia-400 focus:border-fuchsia-300 focus:ring-2 focus:ring-offset-2 focus:outline-none pl-7 sm:text-sm"
                  name="playerName"
                />
                <button
                  type="submit"
                  className="float-right px-5 py-2 mt-6 font-bold text-white rounded bg-fuchsia-400 hover:bg-fuchsia-600"
                >
                  Erstellen
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
            <div className="block mb-4 text-lg font-bold">Raum beitreten</div>
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
          <div className="mt-8">
            <Loading isLoading={isLoading} />
          </div>
          {!isLoading && (
            <>
              {" "}
              <form onSubmit={joinRoom}>
                <p className="mb-3">Wie ist dein Name?</p>
                <input
                  type="text"
                  value={playerName}
                  onChange={handleChange}
                  autoFocus={true}
                  name="playerName"
                  autoComplete="off"
                  className="block w-full h-10 pr-12 mb-8 border border-gray-300 rounded-md focus:ring-fuchsia-400 focus:border-fuchsia-300 focus:ring-2 focus:ring-offset-2 focus:outline-none pl-7 sm:text-sm"
                />
                <p className="mb-3">Wie ist der Raum Name?</p>
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
                  className="float-right px-5 py-2 mt-6 font-bold text-white rounded bg-fuchsia-400 hover:bg-fuchsia-600"
                >
                  Beitreten
                </button>
              </form>
            </>
          )}
        </Modal>
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
