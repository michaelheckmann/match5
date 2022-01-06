import React from "react";
import makeRequest from "../../utilities/makeRequest";

export default function Lobby({
  players,
  userName,
  roomName,
  roomRefId,
  isHost,
}) {
  async function startGame() {
    await makeRequest("game/setGameState", {
      roomName: roomName,
      state: "roundOneStart",
      userName: userName,
      roomRefId: roomRefId,
    });
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <button
        disabled={players.length < 2}
        className="px-5 py-2 mt-6 font-bold text-white rounded bg-fuchsia-400 hover:bg-fuchsia-600 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={startGame}
      >
        Spiel starten
      </button>
    </div>
  );
}
