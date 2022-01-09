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

export default async function handler(req, res) {
  try {
    const response = await channels.trigger(
      req.body.roomName,
      "triggerSelectNot",
      {
        message: req.body.message,
        userName: req.body.userName,
        addresseeName: req.body.addresseeName,
      }
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).send(error);
  }
}
