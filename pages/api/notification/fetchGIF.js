export default async function handler(req, res) {
  const CONTENT_FILTER = "medium";
  const MEDIA_FILTER = "minimal";
  const LIMIT = 10;
  const API_KEY = process.env.TENOR_API_KEY;
  const query = req.body.query;

  try {
    const response = await fetch(`

    https://g.tenor.com/v1/search
     ?key=${API_KEY}
     &q=${query}
     &contentfilter=${CONTENT_FILTER}
     &media_filter=${MEDIA_FILTER}
     &limit=${LIMIT}

    `);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error);
  }
}
