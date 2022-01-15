export default async function handler(req, res) {
  const password = req.body.password;
  return res
    .status(200)
    .json({ authenticated: password === process.env.PASSWORD });
}
