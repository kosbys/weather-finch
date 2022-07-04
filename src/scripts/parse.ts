import '../styles/style.scss';
import Weather from './weather';
import Bird from './bird';
import getWikiPage from './wiki';

const weatherHandler = new Weather(process.env.WEATHER_KEY);
const birdHandler = new Bird(process.env.BIRD_KEY);

const weather = weatherHandler.cityWeather('London');

const bird = birdHandler.getBird(32.633, 35.325);

const wiki = getWikiPage('tree pipit');

Promise.all([weather, bird, wiki]).then((arr) => {
  console.log(arr);
});

function parse(city: string) {
  // Call weather API for weather info and coordinates => Call bird API using coordinates for recent notable birds
  // => Call wikipedia api for first bird name => process all relevant info into an object
}
