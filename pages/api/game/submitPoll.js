export default async function handler(req, res) {
  const { client, q } = require("../../../utilities/db");
  for (let [_, pollObject] of Object.entries(req.body.polls)) {
    try {
      await client.query(
        q.Update(q.Ref(q.Collection("polls"), pollObject.id), {
          data: {
            points: pollObject.points,
          },
        })
      );
    } catch (error) {}
  }

  return res.status(200).end();
}
