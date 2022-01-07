export default async function handler(req, res) {
  const { client, q } = require("../../../utilities/db");
  for (const inputSet of req.body.inputSetsIds) {
    const faunaQuery = client.query(
      q.Update(q.Ref(q.Collection("inputSets"), inputSet[1]), {
        data: {
          pointSummary: req.body.pointSummary.find(
            (p) => p[0] === inputSet[0]
          )[1],
        },
      })
    );

    return await faunaQuery
      .then((response) => {
        res.status(200);
        return res.json(response);
      })
      .catch((error) => {
        res.status(500);
        return res.send(error);
      });
  }
}
