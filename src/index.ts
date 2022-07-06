import domHandlers from './scripts/dom-handlers';
import './styles/style.scss';

/**
 * Weather information about a location and a bird recently found nearby
 */
export default interface LocationInfo {
  location: string;
  country: string;
  temperature: { celsius: number; fahrenheit: number };
  humidity: number;
  weather: string;
  time: string;
  bird: { name: string; image: string };
}

domHandlers.createPage();
