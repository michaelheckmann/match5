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
    await channels.trigger(
      `presence-${req.body.roomName}`,
      "playerLeft",
      req.body.userName,
      () => {
        res.status(200).end("sent event successfully");
      }
    );
  } catch (error) {
    console.log(error);
    res.status(405);
  }

  const { client, q } = require("../../../utilities/db");
  const faunaQuery = client.query(
    q.Let(
      {
        ref: q.Ref(q.Collection("rooms"), req.body.roomRefId),
        doc: q.Get(q.Var("ref")),
        array: q.Select(["data", "players"], q.Var("doc")),
        filteredArray: q.Filter(q.Var("array"), (p) =>
          q.Not(q.Equals(p, req.body.userName))
        ),
      },
      q.Update(q.Var("ref"), {
        data: { players: q.Var("filteredArray") },
      })
    )
  );

  try {
    const response = await faunaQuery;
    console.log("SUCCESSFULLY REMOVED");
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
