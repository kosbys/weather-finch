/**
 * Weather handler
 */
export default class Weather {
  key: string;

  /**
   * @param key - OpenWeatherMap API key
   */
  constructor(key: string) {
    this.key = key;
  }

  /**
   * Fetches the geocode data of a city so it can be called by the weather API
   *
   * @param city - The name of a city
   * @returns Promise JSON including name, country, latitude and longtitude
   */
  async cityInfo(city: string): Promise<any> {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${this.key}`
    );

    if (response.status === 200) {
      return await response.json();
    }

    throw new Error(response.status.toString());
  }
}
