export async function validatePassword(password) {
  return password === process.env.PASSWORD;
}

export default function handler(req, res) {
  const password = req.body.password;
  res.status(200);
  return res.json({ authenticated: password === process.env.PASSWORD });
}
