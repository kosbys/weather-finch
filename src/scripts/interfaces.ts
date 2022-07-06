interface LocationInfo {
  location: string;
  country: string;
  temperature: number;
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

interface WikiImage {
  originalimage: { source: string };
}

export { LocationInfo, Bird, Weather, WikiImage };
