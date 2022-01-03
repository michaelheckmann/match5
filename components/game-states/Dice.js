import React from "react";
import { useEffect, useState, useRef } from "react";
import {
  roundOneCategories,
  roundTwoCategories,
  categoryIcons,
} from "../../utilities/constants";
import { motion } from "framer-motion";
import Loading from "../Loading";

const catColorMap = {
  0: "bg-red-200 text-red-500 shadow-red-200",
  1: "bg-blue-200 text-blue-500 shadow-blue-200",
  2: "bg-slate-200 text-slate-600 shadow-slate-200",
  3: "bg-amber-200 text-amber-600 shadow-amber-200",
  4: "bg-purple-200 text-purple-500 shadow-purple-200",
};

export default function Dice({
  players,
  userName,
  roomName,
  roomRefId,
  round,
  categoriesProp,
}) {
  const [intervalCounter, setIntervalCounter] = useState([0, 0, 0, 0, 0]);
  const [incrementCounter, setIncrementCounter] = useState(0);
  const [showLabel, setShowLabel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const interval = useRef(null);

  // Stop the counter if the categories were set via pusher
  useEffect(() => {
    if (categoriesProp && categoriesProp.length > 0 && !showLabel)
      stopCounter(false);
  }, [categoriesProp, showLabel]);

  // Random number generator for the categories
  useEffect(() => {
    interval.current = setInterval(() => {
      setIntervalCounter((c) => c.map((_) => Math.floor(Math.random() * 6)));
      setIncrementCounter((c) => c + 0.2);
    }, 200);
    return () => {
      clearInterval(interval.current);
    };
  }, []);

  async function stopCounter(makeRequest = true) {
    clearInterval(interval.current);
    setIncrementCounter(0);
    setShowLabel(true);

    if (!makeRequest) return;
    const newCategories = intervalCounter.map((c, i) => {
      if (round === "roundOne") {
        return roundOneCategories[i][c];
      } else if (round === "roundTwo") {
        return roundTwoCategories[i][c];
      }
    });

    await fetch("api/game/setCategories", {
      body: JSON.stringify({
        round: round,
        categories: newCategories,
        userName: userName,
        roomRefId: roomRefId,
        roomName: roomName,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  }

  async function startRound() {
    setIsLoading(true);
    await fetch("api/game/setGameState", {
      body: JSON.stringify({
        roomName: roomName,
        state:
          round === "roundOne" ? "roundOneActionStart" : "roundTwoActionStart",
        userName: userName,
        roomRefId: roomRefId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Loading isLoading={isLoading} />
      {!isLoading && (
        <div className="flex flex-wrap justify-center w-full mt-20 gap-14">
          {/* Round One Dice Roll */}
          {round === "roundOne" &&
            roundOneCategories.map((category, i) => {
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
                      (incrementCounter > 0 ? "[6deg]" : "[0deg]") +
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

          {/* Round Two Dice Roll */}
          {round === "roundTwo" &&
            roundTwoCategories.map((category, i) => {
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
                      (incrementCounter > 0 ? "[6deg]" : "[0deg]") +
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
        </div>
      )}

      {!isLoading && !showLabel && categoriesProp.length === 0 && (
        <button
          onClick={stopCounter}
          className="px-5 py-2 mt-20 font-bold text-white rounded bg-fuchsia-400 hover:bg-fuchsia-600 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          Anhalten
        </button>
      )}
      {!isLoading && showLabel && (
        <button
          onClick={startRound}
          className="px-5 py-2 mt-20 font-bold text-white rounded bg-fuchsia-400 hover:bg-fuchsia-600 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          Runde starten
        </button>
      )}
    </div>
  );
}
