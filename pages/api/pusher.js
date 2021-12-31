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

module.exports = (req, res) => {
  const data = req.body;
  try {
    channels.trigger("chat", "message", data, () => {
      res.status(200).end("sent event successfully");
      resolve();
    });
  } catch (error) {
    res.send(error);
    res.status(405).end();
    resolve();
  }
};
