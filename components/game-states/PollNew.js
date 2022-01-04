import React, { useEffect, useState } from "react";
import {
  categoryIcons,
  combinations,
  colorNumberMap,
} from "../../utilities/constants";
import Loading from "../Loading";
import getEmoji from "../../utilities/getEmoji";
import Image from "next/image";

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
  const [pageNumber, setPageNumber] = useState(pollPage);
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //   Get the inputs from the players
  useEffect(async () => {
    setIsLoading(true);

    const res = await fetch("api/game/getInputSets", {
      body: JSON.stringify({
        roomRefId: roomRefId,
        round: round,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const json = await res.json();

    // Transform into array of objects
    // Each object is one round
    // The keys of the objects are the player names
    // The values are the inputs of the players
    let transformedInputSets = Array.from({ length: 10 }, Object);
    json.data.forEach((r) => {
      transformedInputSets.forEach((is, i) => {
        is[r.data.userName] = r.data.inputs[i];
      });
    });

    console.log(json);
    console.log(transformedInputSets);
    setIsLoading(false);
  }, []);

  // Keep pollPage Number and pageNumber in Sync
  useEffect(() => setPageNumber(pollPage), [pollPage]);

  // Handle round summary
  useEffect(() => {
    if (pageNumber !== 10) return;
    setShowResultScreen(true);
  }, [pageNumber]);

  async function nextPage() {
    setIsLoading(true);
    let nextPageNumber = pageNumber + 1;
    setPageNumber(nextPageNumber);
    return;
    await fetch("api/game/submitPoll", {
      body: JSON.stringify({
        pollPage: nextPageNumber,
        userName: userName,
        pollResults: pollResults,
        inputSetsIds: inputSetsIds,
        roomName: roomName,
        roomRefId: roomRefId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    setIsLoading(false);
  }

  async function prevPage() {
    setIsLoading(true);
    let nextPageNumber = pageNumber - 1;
    setPageNumber(nextPageNumber);
    return;
    await fetch("api/game/submitPoll", {
      body: JSON.stringify({
        pollPage: nextPageNumber,
        userName: userName,
        pollResults: pollResults,
        inputSetsIds: inputSetsIds,
        roomName: roomName,
        roomRefId: roomRefId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    setIsLoading(false);
  }

  async function handleSelectChange(e, player, i) {
    return;
    setPollResults((p) => {
      let obj = JSON.parse(JSON.stringify(p));
      let array = obj[player].slice();
      array[i] = parseInt(e.target.value);
      obj[player] = array;
      return obj;
    });
  }

  async function newRound() {
    setIsLoading(true);
    await fetch("api/game/setPointSummary", {
      body: JSON.stringify({
        round: round,
        userName: userName,
        roomName: roomName,
        inputSetsIds: inputSetsIds,
        pointSummarys: pointSummarys,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    await fetch("api/game/setGameState", {
      body: JSON.stringify({
        roomName: roomName,
        state: round === "roundOne" ? "roundTwoStart" : "gameEnd",
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
    <div className="flex items-start justify-start pt-[104px] w-full h-full">
      {isLoading && (
        <div className="flex items-start justify-center w-full h-full mt-10">
          <div className="flex justify-center items-center p-4 mx-5 min-h-[400px] w-full max-w-[700px] text-gray-700 bg-slate-100 border border-slate-300 rounded-lg shadow-lg">
            <Loading isLoading={isLoading} />
          </div>
        </div>
      )}
      {!isLoading && (
        <div className="flex items-start justify-center w-full h-full mt-10">
          {!showResultScreen &&
            inputSets.map((inputSet, i) => {
              if (i !== pageNumber) return null;
              return (
                <div
                  key={inputSet}
                  className="flex flex-col justify-start items-start p-4 mx-5 min-h-[400px] w-full max-w-[700px] text-gray-700 bg-slate-100 border border-slate-300 rounded-lg shadow-lg"
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
                        className="flex items-center justify-between w-full mb-5"
                        key={player}
                      >
                        <div className="flex items-center justify-start w-48 gap-1 mr-4 font-semibold break-all">
                          {player}
                          <div className="">
                            <Image
                              src={getEmoji(player, roomRefId)}
                              width={18}
                              height={18}
                            />
                          </div>
                        </div>
                        <div className="flex w-full">{inputSet[player]}</div>
                        <div className="text-base text-gray-700 rounded bg-slate-200 ">
                          <select
                            className="px-2 py-1 text-sm bg-transparent rounded-sm active:ring-transparent active:ring-1 active:ring-offset-4 active:ring-offset-fuchsia-400 active:outline-none"
                            // value={pollResults[player][i]}
                            onChange={(e) => handleSelectChange(e, player, i)}
                          >
                            <option value="4">Höchst kreativ</option>
                            <option value="3">Echt gut</option>
                            <option value="2">Nicht schlecht</option>
                            <option value="1">So la la</option>
                            <option value="0">Nicht ausgefüllt</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex items-end justify-end w-full h-full gap-5 mt-auto">
                    {pageNumber !== 0 && (
                      <button
                        disabled={!isHost}
                        onClick={prevPage}
                        className="px-5 py-2 mt-20 font-bold border rounded text-fuchsia-400 border-fuchsia-400 hover:border-fuchsia-600 disabled:bg-slate-200 disabled:border-slate-400 disabled:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Zurück
                      </button>
                    )}
                    <button
                      disabled={!isHost}
                      onClick={nextPage}
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
            <div className="flex flex-col justify-start items-start p-4 mx-5 min-h-[400px] w-full max-w-[600px] text-gray-700 bg-slate-100 border border-slate-300 rounded-lg shadow-lg">
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
              {pointSummarys.map((pointSummary, rank) => {
                return (
                  <div
                    key={pointSummary[0]}
                    className="flex justify-between w-full mb-5"
                  >
                    <div className="flex items-center justify-start gap-1 font-bold">
                      <div className="">
                        {rank + 1}. {pointSummary[0]}{" "}
                      </div>{" "}
                      <div className="pt-[3px]">
                        <Image
                          src={getEmoji(pointSummary[0], roomRefId)}
                          width={18}
                          height={18}
                        />
                      </div>
                    </div>

                    {/* Point summary round one */}
                    {round !== "roundOne" && (
                      <div className="font-mono font-semibold text-fuchsia-300">
                        {roundOnePointSummarys[pointSummary[0]]} Punkte
                      </div>
                    )}

                    {/* Current point summary */}
                    <div className="font-mono font-semibold text-fuchsia-500">
                      {pointSummary[1]} Punkte
                    </div>
                  </div>
                );
              })}
              <div className="flex items-end justify-end w-full h-full mt-auto">
                <button
                  disabled={!isHost}
                  className="px-5 py-2 mt-6 font-bold text-white rounded bg-fuchsia-400 hover:bg-fuchsia-600 disabled:bg-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
