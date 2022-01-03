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
      "playerJoined",
      req.body.userName,
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
    q.Let(
      {
        ref: q.Ref(q.Collection("rooms"), req.body.roomRefId),
        doc: q.Get(q.Var("ref")),
        array: q.Select(["data", "players"], q.Var("doc")),
      },
      q.Update(q.Var("ref"), {
        data: { players: q.Append([req.body.userName], q.Var("array")) },
      })
    )
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
