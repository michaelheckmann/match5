import { useEffect, useState, useRef } from "react";

import { motion } from "framer-motion";

import Loading from "../Loading";

import {
  roundOneCategorySets,
  roundTwoCategorySets,
  categoryIcons,
  catColorMap,
} from "../../utilities/constants";
import makeRequest from "../../utilities/request";

export default function Dice({
  players,
  userName,
  roomName,
  roomRefId,
  round,
  categoriesProp,
  isHost,
  categorySet,
  t,
}) {
  const [intervalCounter, setIntervalCounter] = useState([0, 0, 0, 0, 0]);
  const [incrementCounter, setIncrementCounter] = useState(0);
  const [showLabel, setShowLabel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const interval = useRef(null);

  // Stop the counter if the categories were set via pusher
  useEffect(() => {
    if (!categoriesProp || categoriesProp.length === 0) startCounter();
    if (categoriesProp && categoriesProp.length > 0) stopCounter(false);
  }, [categoriesProp]);

  // Prevent memory leak
  useEffect(() => {
    return () => {
      clearInterval(interval.current);
    };
  }, []);

  function startCounter() {
    interval.current = setInterval(() => {
      setIntervalCounter((c) => c.map((_) => Math.floor(Math.random() * 6)));
      setIncrementCounter((c) => c + 0.2);
    }, 200);
    setShowLabel(false);
  }

  async function stopCounter(makeAPIRequest = true) {
    clearInterval(interval.current);
    setIncrementCounter(0);
    setShowLabel(true);

    if (!makeAPIRequest) return;
    const newCategories = intervalCounter.map((c, i) => {
      if (round === "roundOne") {
        return roundOneCategorySets[categorySet][i][c];
      } else if (round === "roundTwo") {
        return roundTwoCategorySets[categorySet][i][c];
      }
    });

    await makeRequest("game/setCategories", {
      round: round,
      categories: newCategories,
      userName: userName,
      roomRefId: roomRefId,
      roomName: roomName,
    });
  }

  async function startRound() {
    setIsLoading(true);

    await makeRequest("game/setGameState", {
      roomName: roomName,
      state:
        round === "roundOne" ? "roundOneActionStart" : "roundTwoActionStart",
      userName: userName,
      roomRefId: roomRefId,
    });

    setIsLoading(false);
  }

  useEffect(() => {}, [incrementCounter]);

  async function rollDice() {
    await makeRequest("game/setCategories", {
      round: round,
      categories: [],
      userName: userName,
      roomRefId: roomRefId,
      roomName: roomName,
    });
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full flex-auto sm:pb-[100px]">
      <Loading isLoading={isLoading} />
      {!isLoading && (
        <div className="flex flex-wrap justify-center w-full sm:mt-20 gap-14">
          {/* Round One Dice Roll */}
          {round === "roundOne" &&
            roundOneCategorySets[categorySet].map((category, i) => {
              return (
                <div
                  className="flex flex-col items-center justify-center"
                  key={category}
                >
                  {/* Only show the label after the dice was stopped */}
                  {showLabel && (
                    <motion.div
                      animate={{
                        y: [20, 0],
                        scale: [0.9, 1],
                        opacity: [0, 1],
                      }}
                    >
                      {/* Category Names */}
                      <div
                        className={
                          catColorMap[i] + " mb-4 rounded text-center px-2"
                        }
                      >
                        {/* Show either the random values or the values from Pusher */}
                        {categoriesProp.length === 0
                          ? category[intervalCounter[i]]
                          : categoriesProp[i]}
                      </div>
                    </motion.div>
                  )}

                  {/* Category Icons */}
                  <div
                    className={
                      catColorMap[i] +
                      (Math.floor(incrementCounter) % 2 ? " " : " -") +
                      "rotate-" +
                      (incrementCounter > 0 ? "6" : "0") +
                      " flex items-center transition-all ease-in-out duration-300 text-4xl justify-center w-24 h-24 font-bold rounded shadow-md shrink-0"
                    }
                  >
                    {/* Show either the random values or the values from Pusher */}
                    {
                      categoryIcons[
                        categoriesProp.length === 0
                          ? category[intervalCounter[i]]
                          : categoriesProp[i]
                      ]
                    }
                  </div>
                </div>
              );
            })}

          {/* Round Two Dice Roll */}
          {round === "roundTwo" &&
            roundTwoCategorySets[categorySet].map((category, i) => {
              return (
                <div
                  className="flex flex-col items-center justify-center"
                  key={category}
                >
                  {/* Only show the label after the dice was stopped */}
                  {showLabel && (
                    <motion.div
                      animate={{
                        y: [20, 0],
                        scale: [0.9, 1],
                        opacity: [0, 1],
                      }}
                    >
                      {/* Category Names */}
                      <div
                        className={
                          catColorMap[i] + " mb-4 rounded text-center px-2"
                        }
                      >
                        {categoriesProp.length === 0
                          ? category[intervalCounter[i]]
                          : categoriesProp[i]}
                      </div>
                    </motion.div>
                  )}

                  {/* Category Icons */}
                  <div
                    className={
                      catColorMap[i] +
                      (Math.floor(incrementCounter) % 2 ? " " : " -") +
                      "rotate-" +
                      (incrementCounter > 0 ? "6" : "0") +
                      " flex items-center transition-all ease-in-out duration-300 text-3xl justify-center w-24 h-24 font-bold rounded shadow-md shrink-0"
                    }
                  >
                    {/* Show either the random values or the values from Pusher */}
                    {
                      categoryIcons[
                        categoriesProp.length === 0
                          ? category[intervalCounter[i]]
                          : categoriesProp[i]
                      ]
                    }
                  </div>
                </div>
              );
            })}
          {/* FOR TAILWIND JIT */}
          <div className="hidden rotate-6 -rotate-6"></div>
        </div>
      )}

      {!isLoading && !showLabel && categoriesProp.length === 0 && (
        <motion.button
          whileHover={{
            scale: 1.03,
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", bounce: 0.5 }}
          onClick={stopCounter}
          disabled={!isHost}
          className="px-5 py-2 mt-20 font-bold text-white rounded bg-fuchsia-400 hover:bg-fuchsia-600 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t`c-dice.stop-dice`}
        </motion.button>
      )}
      {!isLoading && showLabel && (
        <div className="flex flex-col gap-5 mt-20 sm:flex-row">
          <button
            onClick={rollDice}
            disabled={!isHost}
            className="px-6 py-3 font-bold transition border rounded sm:px-5 sm:py-2 text-fuchsia-400 border-fuchsia-400 hover:border-fuchsia-600 disabled:bg-slate-200 disabled:border-slate-400 disabled:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:rotate-0 sm:hover:scale-105 sm:hover:-rotate-3"
          >
            {t`c-dice.reroll-dice`}
          </button>
          <button
            onClick={startRound}
            disabled={!isHost}
            className="order-first px-6 py-3 font-bold text-white transition rounded sm:px-5 sm:py-2 bg-fuchsia-400 hover:bg-fuchsia-600 disabled:bg-slate-400 disabled:opacity-50 disabled:cursor-not-allowed sm:order-none disabled:hover:scale-100 disabled:hover:rotate-0 sm:hover:scale-105 sm:hover:rotate-3"
          >
            {t`c-dice.start-round`}
          </button>
        </div>
      )}
      {!isLoading && !isHost && (
        <div className="max-w-[380px] italic text-center mt-5 sm:text-sm text-xs text-slate-400">
          {t`c-dice.host-info`}
        </div>
      )}
      {/* V SPACER */}
      {!isLoading && <div className="w-full h-20 sm:hidden"></div>}
    </div>
  );
}
