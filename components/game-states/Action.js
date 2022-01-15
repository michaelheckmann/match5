import { useEffect, useState, useRef, useCallback } from "react";

import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash.debounce";

import Loading from "../Loading";

import {
  categoryIcons,
  combinations,
  colorNumberMap,
  catColorMap,
} from "../../utilities/constants";
import makeRequest from "../../utilities/request";

export default function Action({
  players,
  userName,
  roomName,
  roomRefId,
  round,
  categories,
  isHost,
}) {
  const [intervalCounter, setIntervalCounter] = useState(
    process.env.NODE_ENV === "development" ? 30 : 300
  );
  const [inputs, setInputs] = useState(Array(10).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [timerIsVisible, setTimerIsVisible] = useState(false);

  const nineLeftTriggered = useRef(false);
  const oneLeftTriggered = useRef(false);
  const interval = useRef(null);
  const timerRef = useRef(null);

  const callbackFunc = (entries) => {
    const [entry] = entries;
    setTimerIsVisible(entry.isIntersecting);
  };

  //   Countdown
  useEffect(() => {
    interval.current = setInterval(() => {
      setIntervalCounter((c) => c - 1);
    }, 1000);

    fetchInputSet();

    return () => {
      clearInterval(interval.current);
      debounceInput.cancel();
    };
  }, []);

  async function fetchInputSet() {
    const json = await makeRequest(
      "game/getInputSet",
      {
        roomRefId: roomRefId,
        round: round,
        userName: userName,
      },
      true
    );
    if (json.data.length === 0) return;

    setInputs(json.data[0].data.inputs);
  }

  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunc, {
      roots: null,
      rootMargin: "0px",
      threshold: 0.5,
    });
    if (timerRef.current) observer.observe(timerRef.current);
    return () => {
      if (timerRef.current) observer.unobserve(timerRef.current);
    };
  }, [timerRef]);

  useEffect(() => {
    // Countdown has finished
    if (intervalCounter === 0) {
      setIsLoading(true);
      clearInterval(interval.current);
      handleCounterFinished();
      setIsLoading(false);
    }
  }, [intervalCounter]);

  async function handleCounterFinished() {
    await makeRequest("game/setInputSet", {
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
      await makeRequest("notification/triggerInputNot", {
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
      await makeRequest("notification/triggerInputNot", {
        roomName: roomName,
        message: "oneLeft",
        userName: userName,
        round: round,
      });
    }
  }

  const debounceInput = useCallback(
    debounce(async (debouncedInputs) => {
      await makeRequest("game/setInputSet", {
        roomName: roomName,
        inputs: debouncedInputs,
        userName: userName,
        round: round,
        roomRefId: roomRefId,
      });
    }, 2000),
    []
  );

  useEffect(() => debounceInput(inputs), [inputs]);

  return (
    <div className="flex flex-col items-center justify-start flex-auto w-full h-full">
      <AnimatePresence>
        {!timerIsVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className={
              (intervalCounter <= 10 && intervalCounter % 2 !== 0
                ? "border-red-300 text-red-500 bg-red-200 shadow-red-200"
                : "") +
              (intervalCounter <= 10 && intervalCounter % 2 === 0
                ? "border-red-400 text-red-600 bg-red-300 shadow-red-300"
                : "") +
              (intervalCounter === 60 || intervalCounter === 150
                ? "border-red-400 text-red-600 bg-red-300 shadow-red-300"
                : "") +
              " px-3 py-2 font-mono transition text-xl font-bold text-gray-500 bg-gray-200 border border-gray-300 rounded-lg shadow-lg sticky top-4"
            }
          >
            {((intervalCounter / 60) | 0).toString().padStart(2, "0")}:
            {(intervalCounter % 60).toString().padStart(2, "0")}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-0 place-items-center">
        {/* Countdown Widget */}
        <div className="flex items-start justify-center flex-grow place-self-start sm:place-self-center sm:justify-start">
          <div
            ref={timerRef}
            className={
              (intervalCounter <= 10 && intervalCounter % 2 !== 0
                ? "border-red-300 text-red-500 bg-red-200 shadow-red-200"
                : "") +
              (intervalCounter <= 10 && intervalCounter % 2 === 0
                ? "border-red-400 text-red-600 bg-red-300 shadow-red-300"
                : "") +
              (intervalCounter === 60 || intervalCounter === 150
                ? "border-red-400 text-red-600 bg-red-300 shadow-red-300"
                : "") +
              " px-4 py-3 font-mono transition text-2xl font-bold text-gray-500 bg-gray-200 border border-gray-300 rounded-lg shadow-sm"
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

      <div
        className={
          (isLoading ? "" : "hidden ") +
          "flex items-center justify-center flex-auto w-full h-full"
        }
      >
        <Loading isLoading={isLoading} />
      </div>

      {/* Input fields */}
      {!isLoading && (
        <motion.div
          variants={{
            hidden: {
              opacity: 0,
            },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          initial="hidden"
          animate="show"
          className="flex flex-wrap justify-center w-full max-w-4xl gap-10 px-4 mt-14"
        >
          {combinations.map((c, i) => {
            return (
              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.7 },
                  show: { opacity: 1, scale: 1 },
                }}
                className="flex flex-[0_0_40%] min-w-[300px] gap-2"
                key={i}
              >
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
              </motion.div>
            );
          })}
          {/* For Tailwind JIT */}
          <div className="hidden text-slate-500 text-amber-500"></div>
        </motion.div>
      )}

      {/* V SPACER */}
      {!isLoading && <div className="w-full h-20 md:hidden"></div>}
    </div>
  );
}
