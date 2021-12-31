export async function getRoom(roomName) {
  const { client, q } = require("../../utilities/db");
  const faunaQuery = client.query(
    q.Map(
      q.Paginate(q.Match(q.Index("find_by_name"), roomName)),
      q.Lambda("room", q.Get(q.Var("room")))
    )
  );
  return faunaQuery.then((response) => {
    return response;
  });
}

export default function handler(req, res) {
  const { client, q } = require("../../utilities/db");
  const faunaQuery = client.query(
    q.Map(
      q.Paginate(q.Match(q.Index("find_by_name"), req.body.roomName)),
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
