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
      "pollSubmitted",
      { pageNumber: req.body.pageNumber, userName: req.body.userName },
      () => {
        res.status(200).end("sent event successfully");
      }
    );
  } catch (e) {
    console.log(e);
    res.status(405);
  }

  const { client, q } = require("../../../utilities/db");

  for (const [player, inputSetsId] of Object.entries(req.body.inputSetsIds)) {
    const faunaQuery = client.query(
      q.Update(q.Ref(q.Collection("inputSets"), inputSetsId), {
        data: {
          pollResults: req.body.pollResults[player],
        },
      })
    );

    faunaQuery
      .then(() => {
        res.status(200);
        res.end();
      })
      .catch(() => {
        res.status(500);
        res.end();
      });
  }
}
