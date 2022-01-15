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
    await channels.trigger(`presence-${req.body.roomName}`, "categoriesSet", {
      round: req.body.round,
      categories: req.body.categories,
      userName: req.body.userName,
    });
  } catch (error) {
    console.log(error);
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

  try {
    const response = await faunaQuery;
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).send(error);
  }
}
