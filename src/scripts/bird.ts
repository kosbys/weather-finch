export default class Bird {
  key: string;

  /**
   * @param key - eBird API key
   */
  constructor(key: string) {
    this.key = key;
  }

  /**
   * Fetches a list of notable recent birds spotted in the area
   * @param lat - Latitude of a city
   * @param lon - Longtitude of a city
   * @returns Promise JSON data of notable birds
   */
  async getBird(lat: number, lon: number): Promise<JSON> {
    const response = await fetch(
      `https://api.ebird.org/v2/data/obs/geo/recent/notable?lat=${lat}&lng=${lon}`,
      {
        method: 'GET',
        headers: {
          'X-eBirdApiToken': this.key,
        },
      }
    );

    if (response.status === 200) {
      const json = response.json();
      return json;
    }

    throw new Error(response.status.toString());
  }
}
