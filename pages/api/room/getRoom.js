export async function getRoom(roomName) {
  const { client, q } = require("../../../utilities/db");
  const faunaQuery = client.query(
    q.Map(
      q.Paginate(q.Match(q.Index("findByName"), roomName)),
      q.Lambda("room", q.Get(q.Var("room")))
    )
  );
  return faunaQuery.then((response) => {
    return response;
  });
}

export default function handler(req, res) {
  const { client, q } = require("../../../utilities/db");
  const faunaQuery = client.query(
    q.Map(
      q.Paginate(q.Match(q.Index("findByName"), req.body.roomName)),
      q.Lambda("room", q.Get(q.Var("room")))
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
