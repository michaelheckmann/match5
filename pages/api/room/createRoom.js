export default async function handler(req, res) {
  const { client, q } = require("../../../utilities/db");
  const faunaQuery = client.query(
    q.Create(q.Collection("rooms"), {
      data: {
        name: req.body.roomName,
        players: [req.body.playerName],
        host: req.body.playerName,
        gameState: "lobby",
        roundOneCategories: [],
        roundTwoCategories: [],
        pollPage: 0,
      },
    })
  );

  try {
    const response = await faunaQuery;
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).send(error);
  }
}
