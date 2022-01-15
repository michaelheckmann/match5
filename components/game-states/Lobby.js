import { motion } from "framer-motion";

import makeRequest from "../../utilities/makeRequest";

export default function Lobby({ players, userName, roomName, roomRefId }) {
  async function startGame() {
    await makeRequest("game/setGameState", {
      roomName: roomName,
      state: "roundOneStart",
      userName: userName,
      roomRefId: roomRefId,
    });
  }

  return (
    <div className="flex flex-col items-center justify-center flex-auto w-full h-full">
      <motion.button
        whileHover={{
          scale: 1.05,
          rotate: [0, -3, 3, -3, 3, 0],
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", bounce: 0.25 }}
        disabled={players.length < 2}
        className="px-5 py-2 font-bold text-white rounded bg-fuchsia-400 hover:bg-fuchsia-600 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={startGame}
      >
        Spiel starten
      </motion.button>

      {players.length < 2 && (
        <div className="max-w-[380px] italic text-center mt-5 sm:text-sm text-xs text-slate-400">
          Es müssen mindestens zwei Spieler in diesem Raum sein, um das Spiel
          zustarten
        </div>
      )}
    </div>
  );
}
