const Channels = require("pusher");

const {
  PUSHER_APP_ID: appId,
  PUSHER_KEY: key,
  PUSHER_SECRET: secret,
  PUSHER_CLUSTER: cluster,
} = process.env;

const channels = new Channels({
  appId,
  key,
  secret,
  cluster,
});

function strToNr(string) {
  let out = "";
  for (let i = 0; i < string.length; i++) {
    out += string.charCodeAt(i).toString();
  }
  return out;
}

export default async function handler(req, res) {
  try {
    const socketId = req.body.socket_id;
    const channelName = req.body.channel_name;
    const presenceData = {
      user_id: `${req.body.socket_id}.${strToNr(req.cookies.userName)}`,
      user_info: { name: req.cookies.userName },
    };
    const response = channels.authenticate(socketId, channelName, presenceData);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
