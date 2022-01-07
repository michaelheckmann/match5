export default async function handler(req, res) {
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

  try {
    const response = await faunaQuery;
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).send(error);
  }
}
