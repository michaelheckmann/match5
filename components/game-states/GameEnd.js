import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import Image from "next/image";

import { motion } from "framer-motion";
import Confetti from "react-dom-confetti";

import Loading from "../Loading";

import getEmoji from "../../utilities/emoji";
import makeRequest from "../../utilities/request";

const config = {
  angle: 90,
  spread: "500",
  startVelocity: "40",
  elementCount: "106",
  dragFriction: "0.27",
  duration: "10000",
  stagger: "33",
  width: "10px",
  height: "10px",
  perspective: "671px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
};

export default function GameEnd({
  players,
  userName,
  roomName,
  roomRefId,
  isHost,
  t,
}) {
  const [pollSummary, setPollSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [triggerConfetti, setTriggerConfetti] = useState(false);

  const Router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    fetchPointSummary();
  }, []);

  async function fetchPointSummary() {
    const json = await makeRequest(
      "game/getPointSummary",
      { roomRefId: roomRefId },
      true
    );

    setPollSummary(
      json
        .map((o) => [o.name, o.pointsRoundOne + o.pointsRoundTwo])
        .sort((a, b) => {
          if (a[1] === b[1]) return 0;
          else return a[1] > b[1] ? -1 : 1;
        })
    );
    setIsLoading(false);
    setTimeout(() => triggerConfettiFunction(), 1000);
  }

  function triggerConfettiFunction() {
    if (triggerConfetti) return;
    setTriggerConfetti(true);
    setTimeout(() => {
      setTriggerConfetti(false);
    }, 10000);
  }

  function returnToLobby() {
    setIsLoading(true);
    Router.push("/").then(() => setIsLoading(false));
  }

  return (
    <div className="flex flex-col items-center justify-start sm:pb-[100px] flex-auto w-full h-full sm:justify-center">
      <Loading isLoading={isLoading} />
      {!isLoading && pollSummary.length > 0 && (
        <div className="flex flex-col justify-start items-start p-4 mx-5 min-h-[400px] w-full max-w-[700px] text-gray-700 bg-slate-100 border border-slate-300 rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col items-center justify-center w-full">
            <Confetti active={triggerConfetti} config={config} />
            <div className="mb-2 font-extrabold tracking-wider uppercase text-fuchsia-600">
              {t`c-game-end.winner`}
            </div>
            <div className="flex items-center justify-center p-1 rounded-lg shadow-md from-fuchsia-400 bg-gradient-to-r to-pink-600 shadow-fuchsia-600/10">
              <div className="relative flex flex-col items-center justify-center p-5 bg-white rounded-lg">
                <div className="absolute rotate-45 -top-5 -right-4">
                  <Image
                    src="/emojis/crown.svg"
                    width={40}
                    height={40}
                    alt=""
                  />
                </div>
                <div className="" onClick={triggerConfettiFunction}>
                  <Image
                    src={getEmoji(pollSummary[0][0], roomRefId)}
                    width={50}
                    height={50}
                    alt=""
                  />
                </div>
                <div className="font-bold">{pollSummary[0][0]}</div>
                <div className="font-mono leading-tight text-fuchsia-600">
                  {Math.round(pollSummary[0][1] * 10) / 10}{" "}
                  {Math.round(pollSummary[0][1] * 10) / 10 === 1
                    ? t`c-game-end.point`
                    : t`c-game-end.points`}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-between w-full mt-16 gap-x-14 gap-y-4">
            {pollSummary.map((point, i) => {
              if (i === 0) return;
              return (
                <div
                  className="flex items-center justify-center gap-1"
                  key={point[0]}
                >
                  <div className="flex gap-1">
                    <div className="">
                      {i + 1}. <span>{point[0]}</span>
                    </div>
                    <div className="pt-[4px]">
                      <Image
                        src={getEmoji(point[0], roomRefId)}
                        width={18}
                        height={18}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="ml-1 font-mono font-semibold leading-tight tracking-tight text-fuchsia-600">
                    {Math.round(point[1] * 10) / 10}{" "}
                    {Math.round(point[1] * 10) / 10 === 1
                      ? t`c-game-end.point`
                      : t`c-game-end.points`}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-end justify-end flex-auto w-full h-full">
            <div className="">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  rotate: [0, -3, 3, -3, 3, 0],
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", bounce: 0.25 }}
                className="px-5 py-2 mt-8 font-bold text-white rounded bg-fuchsia-400 hover:bg-fuchsia-600 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={returnToLobby}
              >
                {t`c-game-end.back-to-lobby`}
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
