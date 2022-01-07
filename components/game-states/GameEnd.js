import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import getEmoji from "../../utilities/getEmoji";
import Image from "next/image";
import { useRouter } from "next/router";
import makeRequest from "../../utilities/makeRequest";

export default function GameEnd({
  players,
  userName,
  roomName,
  roomRefId,
  isHost,
}) {
  const [pollSummary, setPollSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
  }

  return (
    <div className="flex flex-col items-center justify-start w-full h-full pt-24 pb-14">
      <Loading isLoading={isLoading} />
      {!isLoading && pollSummary.length > 0 && (
        <div className="flex flex-col justify-start items-start p-4 mx-5 min-h-[400px] w-full max-w-[700px] text-gray-700 bg-slate-100 border border-slate-300 rounded-lg shadow-lg">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="mb-2 font-extrabold tracking-wider uppercase text-fuchsia-600">
              Sieger
            </div>
            <div className="relative flex flex-col items-center justify-center p-5 border rounded-lg shadow-md border-fuchsia-600 shadow-fuchsia-600/10">
              <div className="absolute rotate-45 -top-4 -right-4">
                <Image src="/emojis/crown.svg" width={40} height={40} alt="" />
              </div>
              <div className="">
                <Image
                  src={getEmoji(pollSummary[0][0], roomRefId)}
                  width={50}
                  height={50}
                  alt=""
                />
              </div>

              <div className="font-bold">{pollSummary[0][0]}</div>
              <div className="font-mono leading-tight text-fuchsia-600">
                {pollSummary[0][1]} Punkte
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
                    <div className="pt-[6px]">
                      <Image
                        src={getEmoji(point[0], roomRefId)}
                        width={18}
                        height={18}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="ml-1 font-mono font-semibold leading-tight tracking-tight text-fuchsia-600">
                    {point[1]} Punkte
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-end justify-end w-full h-full">
            <div className="">
              <button
                className="px-5 py-2 mt-8 font-bold text-white rounded bg-fuchsia-400 hover:bg-fuchsia-600 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => Router.push("/")}
              >
                Zurück zur Lobby
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
