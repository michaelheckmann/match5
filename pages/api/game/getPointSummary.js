export default function handler(req, res) {
  const { client, q } = require("../../../utilities/db");
  const faunaQuery = client.query(
    q.Paginate(q.Match(q.Index("pointsByRoomRefId"), req.body.roomRefId))
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
