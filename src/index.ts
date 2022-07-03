import './styles/style.scss';
import Kingfisher from './images/kingfisher.avif';

function component() {
  const container = document.createElement('div');
  container.classList.add('container');
  const element = document.createElement('h4');
  element.textContent = 'Hello, World!';
  const credit = document.createElement('a');
  credit.innerHTML = 'Image Credits';
  credit.href = 'https://unsplash.com/photos/vUNQaTtZeOo';

  container.append(element, credit);

  return container;
}

function image() {
  const img = document.createElement('img');
  img.src = Kingfisher;

  return img;
}

document.body.append(component(), image());

console.log(process.env.API_KEY);
