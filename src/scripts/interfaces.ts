interface LocationInfo {
  location: string;
  country: string;
  temperature: { celsius: number; fahrenheit: number };
  humidity: number;
  weather: string;
  time: string;
  bird: { name: string; image: string };
}

interface Bird {
  comName: string;
}

interface Weather {
  coord: { lon: number; lat: number };
  sys: { country: string };
  main: { temp: number; humidity: number };
  timezone: number;
  weather: Array<{ description: string }>;
}

export { LocationInfo, Bird, Weather };
