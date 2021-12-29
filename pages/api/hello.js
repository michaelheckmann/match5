// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const { client, q } = require("../../utilities/db");
  var createP = client.query(
    q.Get(q.Ref(q.Collection("Names"), "319327366253904072"))
  );

  createP.then(function (response) {
    res.status(200);
    res.json(response);
  });
}
