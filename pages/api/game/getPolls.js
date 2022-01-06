export default async function handler(req, res) {
  const { client, q } = require("../../../utilities/db");
  let out = [];
  for (const [evaluated, inputSetId] of req.body.inputSetIds) {
    try {
      const json = await client.query(
        q.Let(
          {
            match: q.Match(
              q.Index("polls__inputSetId_evaluator"),
              inputSetId,
              req.body.evaluator
            ),
            data: {
              data: {
                evaluator: req.body.evaluator,
                evaluated: evaluated,
                inputSetId: inputSetId,
                points: req.body.tentativePollResults[inputSetId],
                roomRefId: req.body.roomRefId,
                round: req.body.round,
              },
            },
          },
          q.If(
            q.Exists(q.Var("match")),
            q.Get(q.Var("match")),
            q.Create(q.Collection("polls"), q.Var("data"))
          )
        )
      );
      out.push(json);
    } catch (error) {
      console.error(error);
    }
  }
  return res.status(200).json(out);
}
