export default function handler(req, res) {
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
