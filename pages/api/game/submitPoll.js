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
      "pollSubmitted",
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
  for (let [_, pollObject] of Object.entries(req.body.polls)) {
    try {
      await client.query(
        q.Update(q.Ref(q.Collection("polls"), pollObject.id), {
          data: {
            points: pollObject.points,
          },
        })
      );
    } catch (error) {}
  }

  return res.status(200).end();
}
