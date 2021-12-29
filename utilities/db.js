const faunadb = require("faunadb"),
  q = faunadb.query;

const client = new faunadb.Client({
  secret: process.env.FAUNA_ADMIN_KEY,
  domain: "db.eu.fauna.com",
  port: 443,
  scheme: "https",
  timeout: 30,
});

export { client, q };
