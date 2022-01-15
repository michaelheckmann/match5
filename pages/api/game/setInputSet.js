export default async function handler(req, res) {
  const { client, q } = require("../../../utilities/db");
  const faunaQuery = client.query(
    q.Let(
      {
        match: q.Match(q.Index("inputSets--roomRefId+round+userName--id"), [
          req.body.roomRefId,
          req.body.round,
          req.body.userName,
        ]),
        data: {
          data: {
            name: req.body.roomName,
            inputs: req.body.inputs,
            userName: req.body.userName,
            round: req.body.round,
            roomRefId: req.body.roomRefId,
          },
        },
      },
      q.If(
        q.Exists(q.Var("match")),
        q.Update(
          q.Ref(
            q.Collection("inputSets"),
            q.Select(["data", 0], q.Paginate(q.Var("match")))
          ),
          {
            data: {
              inputs: req.body.inputs,
            },
          }
        ),
        q.Create(q.Collection("inputSets"), q.Var("data"))
      )
    )
  );

  try {
    const response = await faunaQuery;
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
