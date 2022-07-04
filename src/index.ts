import toLocationInfoPromise from './scripts/api-handlers';
import './styles/style.scss';

toLocationInfoPromise('London').then((d) => {
  console.log(d);
});
