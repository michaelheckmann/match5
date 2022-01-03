export default function handler(req, res) {
  const { client, q } = require("../../../utilities/db");
  const faunaQuery = client.query(
    q.Delete(q.Ref(q.Collection("rooms"), req.body.roomRefId))
  );
  faunaQuery
    .then((response) => {
      res.status(200);
      return res.json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(500);
      return res.send(error);
    });
}
