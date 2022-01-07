export default async function handler(req, res) {
  const { client, q } = require("../../../utilities/db");
  const faunaQuery = client.query(
    q.Call(q.Function("GetPointSummary"), req.body.roomRefId)
  );
  try {
    const response = await faunaQuery;
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).send(error);
  }
}
