import React from "react";
import { useEffect, useState, useRef } from "react";
import {
  categoryIcons,
  combinations,
  colorNumberMap,
} from "../../utilities/constants";
import Loading from "../Loading";
import makeRequest from "../../utilities/makeRequest";

const catColorMap = {
  0: "bg-red-200 text-red-500 shadow-red-200 border-red-500",
  1: "bg-blue-200 text-blue-500 shadow-blue-200 border-blue-500",
  2: "bg-slate-200 text-slate-600 shadow-slate-200 border-slate-500",
  3: "bg-amber-200 text-amber-600 shadow-amber-200 border-amber-500",
  4: "bg-purple-200 text-purple-500 shadow-purple-200 border-purple-500",
};

export default function Action({
  players,
  userName,
  roomName,
  roomRefId,
  round,
  categories,
  isHost,
}) {
  const [intervalCounter, setIntervalCounter] = useState(300);
  const [inputs, setInputs] = useState(Array(10).fill(""));
  const [isLoading, setIsLoading] = useState(false);

  const nineLeftTriggered = useRef(false);
  const oneLeftTriggered = useRef(false);
  const interval = useRef(null);

  //   Countdown
  useEffect(() => {
    interval.current = setInterval(() => {
      setIntervalCounter((c) => c - 1);
    }, 1000);

    return () => {
      clearInterval(interval.current);
    };
  }, []);

  useEffect(() => {
    // Countdown has finished
    if (intervalCounter === 0) {
      setIsLoading(true);
      clearInterval(interval.current);
      handleCounterFinished();
    }
  }, [intervalCounter]);

  async function handleCounterFinished() {
    await makeRequest("game/createInputSet", {
      roomName: roomName,
      inputs: inputs,
      userName: userName,
      round: round,
      roomRefId: roomRefId,
    });

    if (isHost) {
      await makeRequest("game/setGameState", {
        roomName: roomName,
        state: round === "roundOne" ? "roundOnePollStart" : "roundTwoPollStart",
        userName: userName,
        roomRefId: roomRefId,
      });
    }

    setIsLoading(false);
  }

  // Change to input field
  async function handleChange(e, i) {
    let prevInputs = inputs.slice();
    prevInputs[i] = e.target.value;
    setInputs(prevInputs);

    // Event notification
    if (
      prevInputs.filter((i) => i === "").length === 9 &&
      !nineLeftTriggered.current
    ) {
      nineLeftTriggered.current = true;
      await makeRequest("triggerInputNot", {
        roomName: roomName,
        message: "nineLeft",
        userName: userName,
        round: round,
      });
    } else if (
      prevInputs.filter((i) => i === "").length === 1 &&
      !oneLeftTriggered.current
    ) {
      oneLeftTriggered.current = true;
      await makeRequest("triggerInputNot", {
        roomName: roomName,
        message: "oneLeft",
        userName: userName,
        round: round,
      });
    }
  }

  return (
    <div className="flex flex-col items-center justify-start mt-[104px] w-full h-full">
      <div className="grid w-full grid-cols-3 px-3">
        {/* Countdown Widget */}
        <div className="flex items-start justify-start flex-grow">
          <div
            className={
              (intervalCounter <= 10 && intervalCounter % 2 !== 0
                ? "border-red-300 text-red-500 bg-red-200"
                : "") +
              (intervalCounter <= 10 && intervalCounter % 2 === 0
                ? "border-red-400 text-red-600 bg-red-300"
                : "") +
              " px-4 py-3 font-mono text-2xl font-bold text-gray-500 bg-gray-200 border border-gray-300 rounded-lg shadow-sm"
            }
          >
            {((intervalCounter / 60) | 0).toString().padStart(2, "0")}:
            {(intervalCounter % 60).toString().padStart(2, "0")}
          </div>
        </div>

        {/* Header Line Categories */}
        <div className="flex flex-wrap justify-center max-w-lg gap-5">
          {categories.map((c, i) => {
            return (
              <div
                key={i}
                className={
                  catColorMap[i] +
                  " rounded shadow-sm border text-center px-2 flex gap-1 items-center"
                }
              >
                {categoryIcons[c]} {c}
              </div>
            );
          })}
        </div>

        {/* Space for center alignment */}
        <div className="flex-grow"></div>
      </div>

      <Loading isLoading={isLoading} />

      {/* Input fields */}
      {!isLoading && (
        <div className="flex flex-wrap justify-center w-full max-w-4xl gap-10 px-4 pb-20 mt-14">
          {combinations.map((c, i) => {
            return (
              <div className="flex flex-[0_0_40%] min-w-[300px] gap-2" key={i}>
                <div
                  className={`w-8 h-8 rounded shrink-0 bg-${c[0]}-200 border border-${c[0]}-500 flex justify-center items-center text-${c[0]}-500`}
                >
                  {categoryIcons[categories[colorNumberMap[c[0]]]]}
                </div>
                <div
                  className={`w-8 h-8 rounded shrink-0 bg-${c[1]}-200 border border-${c[1]}-500 flex justify-center items-center text-${c[1]}-500`}
                >
                  {categoryIcons[categories[colorNumberMap[c[1]]]]}
                </div>
                <input
                  type="text"
                  autoCorrect="false"
                  autoComplete="false"
                  value={inputs[i]}
                  disabled={intervalCounter <= 0}
                  onChange={(e) => handleChange(e, i)}
                  className="block w-full h-8 pl-2 pr-2 text-gray-700 border border-gray-300 rounded-md focus:ring-fuchsia-400 focus:border-fuchsia-300 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>
            );
          })}
          {/* For Tailwind JIT */}
          <div className="hidden text-slate-500 text-amber-500"></div>
        </div>
      )}
    </div>
  );
}
