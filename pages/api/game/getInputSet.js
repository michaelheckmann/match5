export default async function handler(req, res) {
  const { client, q } = require("../../../utilities/db");
  const faunaQuery = client.query(
    q.Map(
      q.Paginate(
        q.Match(q.Index("inputSets--roomRefId+round+userName"), [
          req.body.roomRefId,
          req.body.round,
          req.body.userName,
        ])
      ),
      q.Lambda("set", q.Get(q.Var("set")))
    )
  );

  try {
    const response = await faunaQuery;
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).send(error);
  }
}
