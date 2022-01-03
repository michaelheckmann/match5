import React, { useEffect, useState } from "react";
import { emojis } from "../../utilities/constants";
import Loading from "../Loading";

const getEmoji = (name) => {
  let s = 0;
  Array(name.length)
    .fill()
    .forEach((_, i) => {
      s += name.charCodeAt(i);
    });
  return emojis[s % emojis.length];
};

export default function GameEnd({ players, userName, roomName, roomRefId }) {
  const [points, setPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(async () => {
    setIsLoading(true);
    const res = await fetch("api/game/getPointSummary", {
      body: JSON.stringify({
        roomRefId: roomRefId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const json = await res.json();

    let pointsLoaded = [];

    json.data.forEach((pointSummary) => {
      const i = pointsLoaded.findIndex((p) => p[0] === pointSummary[0]);
      if (i === -1) pointsLoaded.push(pointSummary);
      else pointsLoaded[i][1] += pointSummary[1];
    });

    let p = pointsLoaded.sort((a, b) => {
      if (a[1] === b[1]) return 0;
      else return a[1] > b[1] ? -1 : 1;
    });

    setPoints(p);
    setIsLoading(false);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full pt-24 pb-14">
      <Loading isLoading={isLoading} />
      {!isLoading && points.length > 0 && (
        <div className="flex flex-col justify-start items-start p-4 mx-5 min-h-[400px] w-full max-w-[700px] text-gray-700 bg-slate-100 border border-slate-300 rounded-lg shadow-lg">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="mb-2 font-extrabold tracking-wider uppercase text-fuchsia-600">
              Sieger
            </div>
            <div className="flex flex-col items-center justify-center p-5 border rounded-lg shadow-md border-fuchsia-600 shadow-fuchsia-600/10">
              {<div className="text-2xl">{getEmoji(points[0][0])}</div>}
              <div className="font-bold">{points[0][0]}</div>
              <div className="leading-tight">{points[0][1]} Punkte</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
