import React from "react";
import Cookies from "universal-cookie";
import { useEffect } from "react";
import { getRoom } from "./api/getRoom";
import Router from "next/router";

export default function Room({
  roomName,
  userName,
  playerNames,
  hostName,
  roomRefId,
  isAuthenticated,
}) {
  useEffect(async () => {
    // First check if the user has entered the correct password
    if (!isAuthenticated) Router.push("/login");
    // Check if the user has a name
    if (!userName) Router.push("/");

    // If the user has not created the room, add him to the players
    if (userName !== hostName) {
      await fetch("api/joinRoom", {
        body: JSON.stringify({ roomRefId: roomRefId, userName: userName }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
    }
  }, []);

  return (
    <div>
      <div>Hello {roomName}</div>
      <pre>{playerNames}</pre>
    </div>
  );
}

export async function getServerSideProps(context) {
  // Check if room exists
  const res = await getRoom(context.params.roomId);
  if (!res) return { redirect: { destination: "/" } };

  const rooms = res.data;
  if (rooms.length === 0) return { redirect: { destination: "/" } };

  const cookies = new Cookies(context.req.headers.cookie);
  const userName = cookies.get("userName");

  if (!userName) return { redirect: { destination: "/" } };

  const room = rooms[0].data;
  const refId = rooms[0].ref.id;
  return {
    props: {
      roomName: room.name,
      roomRefId: refId,
      playerNames: room.players,
      hostName: room.host,
      userName: userName,
    }, // will be passed to the page component as props
  };
}
