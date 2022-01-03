export default function handler(req, res) {
  const { client, q } = require("../../../utilities/db");

  for (const [player, inputSetsId] of Object.entries(req.body.inputSetsIds)) {
    const faunaQuery = client.query(
      q.Update(q.Ref(q.Collection("inputSets"), inputSetsId), {
        data: {
          pointSummary: req.body.pointSummarys.find((p) => p[0] === player)[1],
        },
      })
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
}
