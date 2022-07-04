import './styles/style.scss';
import Weather from './scripts/weather';
import Bird from './scripts/bird';
import getWikiData from './scripts/wiki';

const weather = new Weather(process.env.WEATHER_KEY);
const bird = new Bird(process.env.BIRD_KEY);

weather.cityInfo('London').then(([c]) => {
  console.log(c);
});

bird.getBird(32.633, 35.325).then((data) => {
  console.log(data[0]);
});

getWikiData('tree pipit').then((d) => {
  console.log(d.originalimage.source);
});
