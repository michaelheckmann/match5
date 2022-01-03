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

export default function handler(req, res) {
  try {
    channels.trigger(
      req.body.roomName,
      "triggerInputNot",
      {
        round: req.body.round,
        message: req.body.message,
        userName: req.body.userName,
      },
      () => {
        res.status(200).end("sent event successfully");
      }
    );
  } catch (e) {
    console.log(e);
    res.status(405);
  }
  return;
}
