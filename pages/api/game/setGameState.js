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
      "gameStateChanged",
      { state: req.body.state, userName: req.body.userName },
      () => {
        res.status(200).end("sent event successfully");
      }
    );
  } catch (e) {
    console.log(e);
    res.status(405);
  }

  const { client, q } = require("../../../utilities/db");
  const faunaQuery = client.query(
    q.Update(q.Ref(q.Collection("rooms"), req.body.roomRefId), {
      data: {
        gameState: req.body.state,
      },
    })
  );

  faunaQuery
    .then((response) => {
      res.status(200);
      return res.json(response);
    })
    .catch((error) => {
      res.status(500);
      return res.send(error);
    });
}
