export default async function handler(req, res) {
  const { client, q } = require("../../../utilities/db");
  const faunaQuery = client.query(
    q.Map(
      q.Paginate(
        q.Match(q.Index("polls__roomRefId_round"), [
          req.body.roomRefId,
          req.body.round,
        ])
      ),
      q.Lambda(
        "ref",
        q.Let(
          {
            doc: q.Get(q.Var("ref")),
          },
          {
            id: q.Select(["ref", "id"], q.Var("doc")),
            evaluated: q.Select(["data", "evaluated"], q.Var("doc")),
            points: q.Sum(q.Select(["data", "points"], q.Var("doc"))),
          }
        )
      )
    )
  );

  try {
    const response = await faunaQuery;
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).send(error);
  }
}
