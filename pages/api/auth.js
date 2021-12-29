export default function handler(req, res) {
  const password = req.body.password;
  res.status(200);
  res.json({ authenticated: password === process.env.PASSWORD });
}
