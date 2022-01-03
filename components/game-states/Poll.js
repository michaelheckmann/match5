import React, { useEffect, useState } from "react";
import {
  categoryIcons,
  combinations,
  emojis,
  colorNumberMap,
} from "../../utilities/constants";
import Loading from "../Loading";

const getEmoji = (name) => {
  let s = 0;
  Array(name.length)
    .fill()
    .forEach((_, i) => {
      s += name.charCodeAt(i);
    });
  return name + " " + emojis[s % emojis.length];
};

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
}) {
  const [inputSets, setInputSets] = useState([]);
  const [inputSetsIds, setInputSetsIds] = useState({});
  const [pollResults, setPollResults] = useState({});
  const [pointSummarys, setPointSummarys] = useState([]);
  const [roundOnePointSummarys, setRoundOnePointSummarys] = useState({});
  const [pageNumber, setPageNumber] = useState(0);
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
      // By default all answers have 2 points, or
      // 0 points if no answer is submitted
      let tentativePollResults = Array(10).fill(2);
      transformedInputSets.forEach((is, i) => {
        is[r.data.userName] = r.data.inputs[i];
        if (!r.data.inputs[i]) tentativePollResults[i] = 0;

        // IF there are already results for this qustion
        // Use them instead
        if (r.data.pollResults[i])
          tentativePollResults[i] = r.data.pollResults[i];
      });

      setPollResults((p) => ({
        ...p,
        [r.data.userName]: tentativePollResults,
      }));

      // Needed for the API calls
      setInputSetsIds((p) => ({
        ...p,
        [r.data.userName]: r.ref["@ref"].id,
      }));
    });
    setInputSets(transformedInputSets);

    // Fetch the results of the previous round to display everything in the table
    if (round !== "roundOne") {
      const resRoundOne = await fetch("api/game/getInputSets", {
        body: JSON.stringify({
          roomRefId: roomRefId,
          round: "roundOne",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const jsonRoundOne = await resRoundOne.json();
      let pollResultsRoundOne = {};
      jsonRoundOne.data.forEach((r) => {
        pollResultsRoundOne[r.data.userName] = r.data.pointSummary;
      });
      setRoundOnePointSummarys(pollResultsRoundOne);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (channel) {
      channel.bind("triggerSelectNot", (triggerSelectData) => {
        if (triggerSelectData.userName === userName) return;
        handleSelectChange(
          { target: { value: triggerSelectData.value } },
          triggerSelectData.player,
          triggerSelectData.index,
          false
        );
      });

      channel.bind("pollSubmitted", (pollSubmittedData) => {
        if (pollSubmittedData.pageNumber !== pageNumber)
          setPageNumber(pollSubmittedData.pageNumber);
      });
    }
  }, [channel]);

  // Handle round summary
  useEffect(() => {
    if (pageNumber !== 10) return;
    setShowResultScreen(true);

    let calculatedPointSummary = [];
    for (const [player, pollResult] of Object.entries(pollResults)) {
      calculatedPointSummary.push([
        player,
        pollResult.reduce((a, b) => a + b, 0),
      ]);
    }
    setPointSummarys(() =>
      calculatedPointSummary.sort((a, b) => {
        if (a[1] === b[1]) return 0;
        else return a[1] > b[1] ? -1 : 1;
      })
    );
  }, [pageNumber]);

  async function nextPage() {
    setIsLoading(true);
    let nextPageNumber = pageNumber + 1;
    setPageNumber(nextPageNumber);

    await fetch("api/game/submitPoll", {
      body: JSON.stringify({
        pageNumber: nextPageNumber,
        userName: userName,
        pollResults: pollResults,
        inputSetsIds: inputSetsIds,
        roomName: roomName,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    setIsLoading(false);
  }

  async function handleSelectChange(e, player, i, apiCall = true) {
    setPollResults((p) => {
      let obj = JSON.parse(JSON.stringify(p));
      let array = obj[player].slice();
      array[i] = parseInt(e.target.value);
      obj[player] = array;
      return obj;
    });
    if (!apiCall) return;
    await fetch("api/triggerSelectNot", {
      body: JSON.stringify({
        round: round,
        userName: userName,
        value: e.target.value,
        player: player,
        index: i,
        roomName: roomName,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
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
    <div className="flex items-center justify-center w-full h-full">
      <Loading isLoading={isLoading} />
      {!isLoading && (
        <div className="flex items-center justify-center w-full h-full pt-24 pb-14">
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
                        <div className="w-48 mr-4 font-semibold break-all">
                          {getEmoji(player)}
                        </div>
                        <div className="flex w-full">{inputSet[player]}</div>
                        <div className="text-base text-gray-700 rounded bg-slate-200 ">
                          <select
                            className="px-2 py-1 text-sm bg-transparent rounded-sm active:ring-transparent active:ring-1 active:ring-offset-4 active:ring-offset-fuchsia-400 active:outline-none"
                            value={pollResults[player][i]}
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
                  <div className="flex items-end justify-end w-full h-full mt-auto">
                    <button
                      onClick={nextPage}
                      className="px-5 py-2 mt-6 font-bold text-white rounded bg-fuchsia-400 hover:bg-fuchsia-600 disabled:bg-slate-400 disabled:cursor-not-allowed"
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
                  <div className="font-mono font-semibold text-fuchsia-500">
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
                    <div className="font-bold">
                      {rank + 1}. {getEmoji(pointSummary[0])}
                    </div>

                    {/* Point summary round one */}
                    {round !== "roundOne" && (
                      <div className="font-mono font-semibold text-fuchsia-500">
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
                  className="px-5 py-2 mt-6 font-bold text-white rounded bg-fuchsia-400 hover:bg-fuchsia-600 disabled:bg-slate-400 disabled:cursor-not-allowed"
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
