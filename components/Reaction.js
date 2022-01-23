import { useState, useEffect, useRef, useCallback } from "react";

import Image from "next/image";

import { motion } from "framer-motion";

import makeRequest from "../utilities/request";
import useClickOutside from "../utilities/useClickOutside";

export default function Reaction({ userName, roomName, roomRefId, t }) {
  const wrapperRef = useRef(null);
  useClickOutside(wrapperRef, closeInput);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [currentGif, setCurrentGif] = useState("");
  const [gifs, setGifs] = useState([]);
  const [currenGifIndex, setCurrenGifIndex] = useState(0);

  async function submitForm(e) {
    e.preventDefault();

    const res = await makeRequest(
      "notification/fetchGIF",
      { query: input },
      true
    );
    const gifs = res.results.map((g) => {
      return { description: g.content_description, url: g.media[0].gif.url };
    });
    setGifs(gifs);
    setCurrenGifIndex(0);
  }

  const handleKeyPress = useCallback(
    (e) => {
      if (e.metaKey && e.key === "k") isOpen ? closeInput() : setIsOpen(true);
    },
    [isOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(
    () => setCurrentGif(gifs[currenGifIndex % 10]),
    [gifs, currenGifIndex]
  );

  function closeInput() {
    setIsOpen(false);
    setGifs([]);
    setCurrenGifIndex(0);
    setInput("");
  }

  function sendGIF() {
    makeRequest("notification/sendGIF", {
      gif: currentGif,
      userName: userName,
      roomName: roomName,
    });
    closeInput();
  }

  return (
    <div
      className={
        (isOpen ? "w-screen pl-20" : "w-auto") +
        " absolute z-50 w-screen sm:w-auto bottom-10 right-10"
      }
      ref={wrapperRef}
    >
      {!isOpen && (
        <div className="rounded-full shadow-lg">
          <motion.div
            whileHover={{
              scale: 1.1,
              rotate: 180,
            }}
            transition={{ type: "spring" }}
            whileTap={{ scale: 0.9, rotate: 0 }}
            onClick={() => setIsOpen(true)}
            className="relative p-4 border-4 border-white rounded-full outline-none cursor-pointer w-14 h-14 bg-fuchsia-500"
          >
            <Image src="/emojis/1F61C.svg" alt="emoji" layout="fill" />
          </motion.div>
        </div>
      )}
      {isOpen && (
        <div>
          <div className="relative p-4 bg-white rounded-lg shadow-lg">
            {currentGif && (
              <div className="flex gap-5 mb-4 sm:mb-2 sm:gap-3">
                <div className="p-2 bg-gray-100 rounded-lg w-full sm:w-[170px] flex justify-center items-center min-">
                  <Image
                    src={currentGif.url}
                    alt={currentGif.description}
                    width={150}
                    height={100}
                    objectFit="contain"
                  />
                </div>
                <div className="flex flex-col items-end justify-end gap-4 ml-2 sm:gap-2">
                  <button
                    onClick={() => setCurrenGifIndex((i) => i + 1)}
                    className="h-6 px-2 text-xs transition border rounded text-fuchsia-400 border-fuchsia-400 hover:border-fuchsia-600 sm:hover:scale-105 sm:hover:-rotate-2 sm:text-sm"
                  >
                    {t`gif.shuffle`}
                  </button>
                  <button
                    onClick={sendGIF}
                    className="h-6 px-2 text-xs font-semibold text-white transition rounded bg-fuchsia-400 hover:bg-fuchsia-600 sm:hover:scale-105 sm:hover:-rotate-2 sm:text-sm"
                  >
                    {t`gif.send`}
                  </button>
                </div>
              </div>
            )}
            <form onSubmit={submitForm}>
              <div className="flex justify-end gap-5 sm:gap-3">
                <input
                  type="text"
                  value={input}
                  placeholder={t`gif.placeholder`}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full sm:w-[170px] h-6 px-2 text-xs border border-gray-300 rounded-md focus:ring-fuchsia-300 focus:border-fuchsia-200 focus:ring-1 focus:ring-offset-1 focus:outline-none sm:text-sm"
                />
                <button
                  type="submit"
                  className={
                    (currentGif ? "" : "mr-2 ") +
                    "h-6 px-2 text-xs font-semibold text-white transition bg-pink-400 rounded hover:bg-pink-600 sm:hover:scale-105 sm:hover:rotate-2 sm:text-sm sm:mr-0"
                  }
                >
                  {t`gif.submit`}
                </button>
              </div>
            </form>
            <button
              onClick={closeInput}
              className="absolute flex items-center justify-center w-8 h-8 text-sm text-gray-600 bg-white border border-gray-200 rounded-full -top-3 sm:text-baseline -right-3"
            >
              <div className="w-[30px] h-[30px] flex items-center justify-center pb-[2.8px] text-[15px] leading-[30px]">
                ✕
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
