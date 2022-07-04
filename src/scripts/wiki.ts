/**
 * Fetches data of a wikipedia page
 *
 * @param query - Usually the name of a bird
 * @returns Promise JSON containing page info
 */
export default async function getWikiPage(query: string): Promise<JSON> {
  const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${query}`, {
    method: 'GET',
  });

  if (response.status === 200) {
    const json = await response.json();
    return json;
  }

  throw new Error(response.status.toString());
}
