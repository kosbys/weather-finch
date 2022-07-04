export default class Weather {
  key: string;

  /**
   * @param key - OpenWeatherMap API key
   */
  constructor(key: string) {
    this.key = key;
  }

  /**
   * Fetches weather information about a city
   *
   * @param city - The name of a city
   * @returns Promise JSON
   */
  async cityWeather(city: string): Promise<JSON> {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.key}`
    );

    if (response.status === 200) {
      const json = await response.json();
      return json;
    }

    throw new Error(response.status.toString());
  }
}
