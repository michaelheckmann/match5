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
      "categoriesSet",
      {
        round: req.body.round,
        categories: req.body.categories,
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

  const { client, q } = require("../../../utilities/db");
  let faunaQuery;

  switch (req.body.round) {
    case "roundOne":
      faunaQuery = client.query(
        q.Update(q.Ref(q.Collection("rooms"), req.body.roomRefId), {
          data: {
            roundOneCategories: req.body.categories,
          },
        })
      );
      break;
    case "roundTwo":
      faunaQuery = client.query(
        q.Update(q.Ref(q.Collection("rooms"), req.body.roomRefId), {
          data: {
            roundTwoCategories: req.body.categories,
          },
        })
      );
      break;
    default:
      break;
  }

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
