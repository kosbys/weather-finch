/**
 * Fetches data of a wikipedia page
 *
 * @param query - Usually the name of a bird
 * @returns Promise JSON containing page info
 */
export default async function getWikiData(query: string) {
  const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${query}`, {
    method: 'GET',
  });

  if (response.status === 200) {
    return await response.json();
  }

  throw new Error(response.status.toString());
}
