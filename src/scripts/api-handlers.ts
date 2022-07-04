import { DateTime } from 'luxon';

function FormatLocalTime(offset: number): string {
  return DateTime.now()
    .toUTC(offset / 60)
    .toLocaleString(DateTime.TIME_24_SIMPLE);
}

/**
 * Fetches weather information about a location
 *
 * @param location - The name of a location
 * @returns Promise JSON
 */
async function getLocationWeather(location: string): Promise<any> {
  const WEATHER_KEY = process.env.WEATHER_KEY;

  if (!WEATHER_KEY) {
    throw new Error('Missing OpenWeatherMap API key');
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${WEATHER_KEY}&units=metric`
  );

  if (response.status === 200) {
    const json = await response.json();
    return json;
  }

  throw new Error(response.status.toString());
}

/**
 * Fetches a list of notable recent birds spotted in the area
 * @param lat - Latitude of a location
 * @param lon - Longtitude of a location
 * @returns Promise JSON
 */
async function getBird(lat: number, lon: number): Promise<any> {
  const BIRD_KEY = process.env.BIRD_KEY;

  if (!BIRD_KEY) {
    throw new Error('Missing eBird API key');
  }

  const response = await fetch(
    `https://api.ebird.org/v2/data/obs/geo/recent/notable?lat=${lat}&lng=${lon}`,
    {
      method: 'GET',
      headers: {
        'X-eBirdApiToken': BIRD_KEY,
      },
    }
  );

  if (response.status === 200) {
    const json = response.json();
    return json;
  }

  throw new Error(response.status.toString());
}

/**
 * Fetches data of a wikipedia page
 *
 * @param query - Usually the name of a bird
 * @returns Promise JSON
 */
async function getWikiPage(query: string): Promise<any> {
  const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${query}`, {
    method: 'GET',
  });

  if (response.status === 200) {
    const json = await response.json();
    return json;
  }

  throw new Error(response.status.toString());
}

interface LocationInfo {
  location: string;
  country: string;
  temperature: { celsius: number; fahrenheit: number };
  humidity: number;
  weather: string;
  time: string;
  bird: { name: string; image: string };
}

/**
 * Calls APIs in sequence of:
 * - location weather info
 * - Notable birds nearby
 * - Image of bird from wikipedia
 * And processes the combined data into a single object to be used easily.
 *
 * @param location - Name of a location (hopefully) located in the world
 * @returns Information about a location
 */
export default async function toLocationInfoPromise(location: string): Promise<LocationInfo> {
  try {
    const locationData = await getLocationWeather(location);
    const lat = locationData.coord.lat;
    const lon = locationData.coord.lon;
    const tempCelsius = Math.round(locationData.main.temp);
    const tempFahrenheit = Math.round(locationData.main.temp * 1.8 + 32);

    const [bird] = await getBird(lat, lon);
    const birdName = bird.comName;

    const image = await getWikiPage(birdName);

    return await {
      location,
      country: locationData.sys.country,
      temperature: { celsius: tempCelsius, fahrenheit: tempFahrenheit },
      humidity: locationData.main.humidity,
      weather: locationData.weather[0].description,
      time: FormatLocalTime(locationData.timezone),
      bird: { name: birdName, image: image.originalimage.source },
    };
  } catch (error) {
    throw new Error(error);
  }
}
