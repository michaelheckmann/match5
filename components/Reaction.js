import React, { useState } from "react";
import Image from "next/image";
import makeRequest from "../utilities/request";

export default function Reaction() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [gifURL, setGifURL] = useState("");
  const [gifs, setGifs] = useState([]);

  async function submitForm(e) {
    e.preventDefault();
    console.log(input);

    const res = await makeRequest(
      "notification/fetchGIF",
      { query: input },
      true
    );
    console.log(res);
  }

  return (
    <div className="p-4 bg-white w-100 h-100">
      {isOpen && (
        <div className="">
          <button onClick={() => setIsOpen(true)}>Open</button>
        </div>
      )}
      {!isOpen && (
        <div>
          {gifURL && <Image src={gifURL} width={100} height={100} />}
          <form onSubmit={submitForm}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
          <button onClick={() => setIsOpen(false)}>Shuffle</button>
          <button onClick={() => setIsOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
