import './styles/style.scss';

const KEY = process.env.API_KEY;

/**
 * Fetches the geocode data of a city so it can be called by the weather API
 *
 * @param  city - The name of a city
 * @returns A promise of json data
 */
async function cityToLatLon(city: string): Promise<any> {
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${KEY}`
  );

  if (response.status === 200) {
    const json = await response.json();
    return json;
  }

  throw new Error(response.status.toString());
}

cityToLatLon('London').then(([c]) => {
  console.log(c);
});

export default cityToLatLon;
