export default async function handler(req, res) {
  const params = new URLSearchParams({
    key: process.env.TENOR_API_KEY,
    q: req.body.query,
    locale: req.body.locale,
    media_filter: "basic",
    contentfilter: "medium",
    limit: 15,
  });

  try {
    const response = await fetch(`https://g.tenor.com/v1/search?${params}`);
    const jsonReponse = await response.json();

    return res.status(200).json(jsonReponse);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
