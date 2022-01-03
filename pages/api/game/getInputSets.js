export default function handler(req, res) {
  const { client, q } = require("../../../utilities/db");
  const faunaQuery = client.query(
    q.Map(
      q.Paginate(
        q.Match(
          q.Index("findByRoomRefIdAndRound"),
          req.body.roomRefId,
          req.body.round
        )
      ),
      q.Lambda("set", q.Get(q.Var("set")))
    )
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
