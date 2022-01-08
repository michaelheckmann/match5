import React, { useEffect, useState } from "react";
import {
  categoryIcons,
  combinations,
  colorNumberMap,
} from "../../utilities/constants";
import Loading from "../Loading";
import getEmoji from "../../utilities/getEmoji";
import Image from "next/image";
import makeRequest from "../../utilities/makeRequest";

const catColorMap = {
  0: "bg-red-200 text-red-500 shadow-red-200 border-red-500",
  1: "bg-blue-200 text-blue-500 shadow-blue-200 border-blue-500",
  2: "bg-slate-200 text-slate-600 shadow-slate-200 border-slate-500",
  3: "bg-amber-200 text-amber-600 shadow-amber-200 border-amber-500",
  4: "bg-purple-200 text-purple-500 shadow-purple-200 border-purple-500",
};

export default function Poll({
  players,
  userName,
  roomName,
  roomRefId,
  round,
  categories,
  channel,
  isHost,
  pollPage,
}) {
  const [inputSets, setInputSets] = useState([]);
  const [polls, setPolls] = useState({});
  const [roundOnePollSummarys, setRoundOnePollSummarys] = useState([]);
  const [roundTwoPollSummarys, setRoundTwoPollSummarys] = useState([]);
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //   Get the inputs from the players
  useEffect(() => fetchData(), []);

  async function fetchData() {
    setIsLoading(true);

    const json = await makeRequest(
      "game/getInputSets",
      { roomRefId: roomRefId, round: round },
      true
    );

    // Transform into array of objects
    // Each object is one round
    // The keys of the objects are the player names
    // The values are the inputs of the players
    let transformedInputSets = Array.from({ length: 10 }, Object);
    let inputSetIds = [];
    let tentativePollResults = {};
    json.data.forEach((r) => {
      let tentativePollResult = Array(10).fill(2);
      transformedInputSets.forEach((is, i) => {
        is[r.data.userName] = r.data.inputs[i];
        if (!r.data.inputs[i]) tentativePollResult[i] = 0;
      });

      inputSetIds.push([r.data.userName, r.ref["@ref"].id]);
      tentativePollResults[r.ref["@ref"].id] = tentativePollResult;
    });

    setInputSets(transformedInputSets);

    const jsonPolls = await makeRequest(
      "game/getPolls",
      {
        inputSetIds: inputSetIds.filter((i) => i[0] !== userName),
        evaluator: userName,
        tentativePollResults: tentativePollResults,
        roomRefId: roomRefId,
        round: round,
      },
      true
    );

    let transformedPolls = {};
    jsonPolls.forEach((p) => {
      transformedPolls[p.data.evaluated] = {
        points: p.data.points,
        id: p.ref["@ref"].id,
      };
    });

    setPolls(transformedPolls);

    setIsLoading(false);
  }

  useEffect(() => handlePageChange(), [pollPage]);

  async function handlePageChange() {
    await makeRequest("game/submitPoll", {
      userName: userName,
      polls: polls,
    });

    if (pollPage !== 10) return;

    const json = await makeRequest(
      "game/getPointSummary",
      { roomRefId: roomRefId },
      true
    );

    setRoundOnePollSummarys(
      json
        .map((o) => [o.name, o.pointsRoundOne])
        .sort((a, b) => {
          if (a[1] === b[1]) return 0;
          else return a[1] > b[1] ? -1 : 1;
        })
    );
    setRoundTwoPollSummarys(
      json
        .map((o) => [o.name, o.pointsRoundTwo])
        .sort((a, b) => {
          if (a[1] === b[1]) return 0;
          else return a[1] > b[1] ? -1 : 1;
        })
    );

    setShowResultScreen(true);
  }

  async function changePageNumber(nextPageNumber) {
    setIsLoading(true);

    await makeRequest("game/submitPoll", {
      userName: userName,
      polls: polls,
    });

    await makeRequest("game/setPageNumber", {
      pollPage: nextPageNumber,
      userName: userName,
      roomName: roomName,
      roomRefId: roomRefId,
    });

    setIsLoading(false);
  }

  async function handleSelectChange(e, player, i) {
    if (player === userName) return;
    setPolls((p) => {
      let obj = JSON.parse(JSON.stringify(p));
      obj[player].points[i] = parseInt(e.target.value);
      return obj;
    });
  }

  async function newRound() {
    await changePageNumber(0);

    setIsLoading(true);
    await makeRequest("game/setGameState", {
      roomName: roomName,
      state: round === "roundOne" ? "roundTwoStart" : "gameEnd",
      userName: userName,
      roomRefId: roomRefId,
    });
    setIsLoading(false);
  }

  return (
    <div className="flex items-start justify-start flex-auto w-full h-full">
      {isLoading && (
        <div className="flex items-center justify-center flex-auto w-full h-full mt-10 sm:mt-0">
          <div className="flex justify-center items-center p-4 flex-auto sm:min-h-[400px] w-full sm:max-w-[700px] text-gray-700 sm:bg-slate-100 sm:border border-slate-300 sm:rounded-lg sm:shadow-lg">
            <Loading isLoading={isLoading} />
          </div>
        </div>
      )}
      {!isLoading && (
        <div className="flex items-start justify-center w-full h-full">
          {!showResultScreen &&
            inputSets.map((inputSet, i) => {
              if (i !== pollPage) return null;
              return (
                <div
                  key={inputSet}
                  className="flex justify-start flex-col sm:justify-center items-center sm:p-4 sm:min-h-[400px] w-full sm:max-w-[700px] text-gray-700 sm:bg-slate-100 sm:border border-slate-300 sm:rounded-lg sm:shadow-lg divide-y divide-slate-400 divide-dashed sm:divide-y-0"
                >
                  <div className="flex items-center justify-center w-full gap-5 mt-2 mb-10">
                    <div
                      className={
                        catColorMap[colorNumberMap[combinations[i][0]]] +
                        " rounded shadow-sm border text-center px-2 flex gap-1 items-center"
                      }
                    >
                      {
                        categoryIcons[
                          categories[colorNumberMap[combinations[i][0]]]
                        ]
                      }{" "}
                      {categories[colorNumberMap[combinations[i][0]]]}
                    </div>
                    <div
                      className={
                        catColorMap[colorNumberMap[combinations[i][1]]] +
                        " rounded shadow-sm border text-center px-2 flex gap-1 items-center"
                      }
                    >
                      {
                        categoryIcons[
                          categories[colorNumberMap[combinations[i][1]]]
                        ]
                      }{" "}
                      {categories[colorNumberMap[combinations[i][1]]]}
                    </div>
                  </div>
                  {Object.keys(inputSet).map((player) => {
                    return (
                      <div
                        className={
                          (player === userName ? "opacity-70 " : "") +
                          "sm:flex sm:items-center sm:justify-between sm:flex-row w-full sm:mb-5 grid grid-cols-2 grid-rows-2 gap-x-3 pt-3 pb-2"
                        }
                        key={player}
                      >
                        <div className="flex items-center justify-start gap-1 text-sm font-semibold break-all sm:w-48 sm:mr-4 sm:text-base">
                          {player}
                          <div className="pt-[6px]">
                            <Image
                              src={getEmoji(player, roomRefId)}
                              width={18}
                              height={18}
                            />
                          </div>
                        </div>
                        <div className="flex order-last w-full text-sm break-all sm:text-base sm:order-none">
                          {inputSet[player]}{" "}
                          {!inputSet[player] && (
                            <span className="text-sm italic tracking-wider text-gray-400">
                              Nicht ausgefüllt
                            </span>
                          )}
                        </div>
                        {player !== userName && (
                          <div className="flex items-center justify-center row-span-2 text-sm text-gray-700 rounded sm:text-base sm:block place-items-center">
                            <select
                              className=" select-triangle px-3 py-2 text-sm bg-slate-200 rounded-sm active:ring-transparent active:ring-1 active:ring-offset-4 active:ring-offset-fuchsia-400 active:outline-none max-h-[40px]"
                              value={polls[player].points[i]}
                              onChange={(e) => handleSelectChange(e, player, i)}
                            >
                              <option value="4">Höchst kreativ</option>
                              <option value="3">Echt gut</option>
                              <option value="2">Nicht schlecht</option>
                              <option value="1">So la la</option>
                              <option value="0">Nicht ausgefüllt</option>
                            </select>
                          </div>
                        )}
                        {player === userName && (
                          <div className="flex items-center justify-center row-span-2 text-sm text-gray-700 rounded sm:text-base sm:block place-items-center">
                            <select
                              className="px-3 py-2 text-sm rounded-sm appearance-none cursor-not-allowed bg-slate-200 active:ring-transparent active:ring-1 active:ring-offset-4 active:ring-offset-fuchsia-400 active:outline-none min-w-[140px]"
                              disabled={true}
                              value="-1"
                            >
                              <option value="0">Nicht ausgefüllt</option>
                              <option value="-1"></option>
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="flex items-end justify-end w-full h-full gap-5 mt-auto">
                    {pollPage !== 0 && (
                      <button
                        disabled={!isHost}
                        onClick={() => changePageNumber(pollPage - 1)}
                        className="px-5 py-2 mt-20 font-bold border rounded text-fuchsia-400 border-fuchsia-400 hover:border-fuchsia-600 disabled:bg-slate-200 disabled:border-slate-400 disabled:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Zurück
                      </button>
                    )}
                    <button
                      disabled={!isHost}
                      onClick={() => changePageNumber(pollPage + 1)}
                      className="px-5 py-2 mt-6 font-bold text-white rounded bg-fuchsia-400 hover:bg-fuchsia-600 disabled:bg-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Weiter
                    </button>
                  </div>
                </div>
              );
            })}

          {/* Show result screen */}
          {showResultScreen && (
            <div className="flex sm:text-base text-sm justify-start flex-col sm:justify-center items-center sm:p-4 sm:min-h-[400px] w-full sm:max-w-[600px] text-gray-700 sm:bg-slate-100 sm:border border-slate-300 sm:rounded-lg sm:shadow-lg">
              {/* Header */}
              <div className="flex justify-between w-full px-2 pb-2 mb-5 border-b-2 border-slate-300">
                <div className="font-bold">Spieler</div>
                {["roundOne", "roundTwo"].includes(round) && (
                  <div
                    className={
                      (round === "roundOne"
                        ? "text-fuchsia-500 "
                        : "text-fuchsia-300 ") + "font-mono font-semibold"
                    }
                  >
                    Runde 1
                  </div>
                )}
                {["roundTwo"].includes(round) && (
                  <div className="font-mono font-semibold text-fuchsia-500">
                    Runde 2
                  </div>
                )}
              </div>

              {/* Table */}
              {roundOnePollSummarys.map((pollSummary, rank) => {
                return (
                  <div
                    key={pollSummary[0]}
                    className="flex justify-between w-full mb-5"
                  >
                    <div className="flex items-center justify-start gap-1 font-bold">
                      <div className="">
                        {rank + 1}. {pollSummary[0]}{" "}
                      </div>{" "}
                      <div className="pt-[4px]">
                        <Image
                          src={getEmoji(pollSummary[0], roomRefId)}
                          width={18}
                          height={18}
                        />
                      </div>
                    </div>
                    {/* Point summary round one */}
                    {["roundOne", "roundTwo"].includes(round) && (
                      <div className="font-mono font-semibold text-fuchsia-300">
                        {pollSummary[1]} Punkte
                      </div>
                    )}

                    {/* Point summary round two */}
                    {["roundTwo"].includes(round) && (
                      <div className="font-mono font-semibold text-fuchsia-300">
                        {
                          roundTwoPollSummarys.find(
                            (p) => p[0] === pollSummary[0]
                          )[1]
                        }{" "}
                        Punkte
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="flex items-end justify-end w-full h-full mt-auto">
                <button
                  disabled={!isHost}
                  className="px-5 py-2 mt-10 font-bold text-white rounded sm:mt-6 bg-fuchsia-400 hover:bg-fuchsia-600 disabled:bg-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={newRound}
                >
                  {round !== "roundTwo" ? "Nächste Runde" : "Abschließen"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
