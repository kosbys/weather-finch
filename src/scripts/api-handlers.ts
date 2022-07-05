import { DateTime } from 'luxon';
import LocationInfo from '../index';

/**
 * Parse time using luxon
 *
 * @param offset - OpenWeatherMap UTC offset in seconds
 * @returns 24 hour clock time of a selected location in the form HH:MM
 */
function FormatLocalTime(offset: number): string {
  return DateTime.now()
    .toUTC(offset / 60) // Convert from OpenWeather seconds offset to minutes for Luxon
    .toLocaleString(DateTime.TIME_24_SIMPLE);
}

/**
 * Fetches weather information about a location
 *
 * @param location - The name of a location
 * @returns Promise JSON
 */
async function getLocationWeather(location: string): Promise<any> {
  const WEATHER_KEY = process.env.WEATHER_KEY; // located in .env

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

  throw new Error(`Cannot find ${location}`);
}

/**
 * Fetches a list of notable recent birds spotted in the area
 *
 * @param lat - Latitude of a location
 * @param lon - Longtitude of a location
 * @returns Promise JSON
 */
async function getBird(lat: number, lon: number): Promise<any> {
  const BIRD_KEY = process.env.BIRD_KEY; // located in .env

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

  throw new Error('Cannot find bird');
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

  throw Error('Cannot find wiki page');
}

/**
 * Calls APIs in sequence of:
 * - Location weather info
 * - Notable birds nearby
 * - Image of first notable bird from wikipedia
 *
 *  Then processes the combined data into a single object to be used easily.
 *
 * @param location - Name of a location in the world
 * @returns Information about a location
 */
export default async function toLocationInfoPromise(location: string): Promise<LocationInfo> {
  try {
    const locationData = await getLocationWeather(location);
    const lat = locationData.coord.lat;
    const lon = locationData.coord.lon;
    const tempCelsius = Math.round(locationData.main.temp);
    const tempFahrenheit = Math.round(locationData.main.temp * 1.8 + 32);

    const [bird] = await getBird(lat, lon); // Destructure to only contain first bird on list

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
    throw Error(error);
  }
}
