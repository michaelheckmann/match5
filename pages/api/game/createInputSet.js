export default function handler(req, res) {
  const { client, q } = require("../../../utilities/db");
  const faunaQuery = client.query(
    q.Create(q.Collection("inputSets"), {
      data: {
        name: req.body.roomName,
        inputs: req.body.inputs,
        userName: req.body.userName,
        round: req.body.round,
        roomRefId: req.body.roomRefId,
        pollResults: [],
        pointSummary: 0,
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
