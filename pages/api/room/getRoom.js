export async function getRoom(roomName) {
  const { client, q } = require("../../../utilities/db");
  const faunaQuery = client.query(
    q.Map(
      q.Paginate(q.Match(q.Index("rooms--name"), roomName)),
      q.Lambda("room", q.Get(q.Var("room")))
    )
  );

  try {
    const response = await faunaQuery;
    return response;
  } catch (error) {
    return error;
  }
}

export default async function handler(req, res) {
  const { client, q } = require("../../../utilities/db");
  const faunaQuery = client.query(
    q.Map(
      q.Paginate(q.Match(q.Index("rooms--name"), req.body.roomName)),
      q.Lambda("room", q.Get(q.Var("room")))
    )
  );

  try {
    const response = await faunaQuery;
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).send(error);
  }
}
