export default async function makeRequest(url, body, returnJSON = false) {
  try {
    const res = await fetch("/api/" + url, {
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  } catch (error) {
    return error;
  }

  if (!returnJSON) return;

  try {
    const response = await res.json();
    // console.log("response", response);
    return response;
  } catch (error) {
    return error;
  }
}
