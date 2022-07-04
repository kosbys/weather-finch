import './styles/style.scss';
import Weather from './scripts/weather';
import Bird from './scripts/bird';
import getImageFromPage from './scripts/wiki';
import getWikiPage from './scripts/wiki';

const weatherHandler = new Weather(process.env.WEATHER_KEY);
const birdHandler = new Bird(process.env.BIRD_KEY);

const weather = weatherHandler.cityWeather('London');

const bird = birdHandler.getBird(32.633, 35.325);

const wiki = getWikiPage('tree pipit');

Promise.all([weather, bird, wiki]).then((arr) => {
  console.log(arr);
});
