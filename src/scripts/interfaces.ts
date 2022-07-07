interface LocationInfo {
  location: string;
  country: string;
  temperature: number;
  humidity: number;
  weather: { desc: string; icon: string };
  time: string;
  bird: { name: string; image: string; description: string; link: string };
}

interface Bird {
  comName: string;
}

interface Weather {
  coord: { lon: number; lat: number };
  sys: { country: string };
  main: { temp: number; humidity: number };
  timezone: number;
  weather: Array<{ description: string; icon: string }>;
}

interface WikiPage {
  originalimage: { source: string };
  extract: string;
  content_urls: { desktop: { page: string } };
}

export { LocationInfo, Bird, Weather, WikiPage };
