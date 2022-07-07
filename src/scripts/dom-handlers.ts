import toLocationInfoPromise from './api-handlers';
import { LocationInfo } from './interfaces';
import Search from '../images/search-dark.svg';
import Spinner from '../images/spinner.svg';
import Bird from '../images/bird.svg';
import Cloud from '../images/cloud.svg';

export default (function domHandlers() {
  const weatherInfo = ['location', 'country', 'temperature', 'humidity', 'weather', 'time'];
  function toggleColorMode(event: Event) {
    const button = event.currentTarget as HTMLElement;

    if (button.classList.contains('light')) {
      document.documentElement.setAttribute('color-mode', 'light');
      localStorage.setItem('color-mode', 'light');
    } else {
      document.documentElement.setAttribute('color-mode', 'dark');
      localStorage.setItem('color-mode', 'dark');
    }
  }

  function displayLocationInfo(data: LocationInfo) {
    const container = document.getElementById('container');
    const birdName = document.getElementsByClassName('bird-name')[0];
    birdName.textContent = `${data.bird.name}`;
    const birdImage = document.getElementsByClassName('bird-image')[0] as HTMLImageElement;
    birdImage.src = data.bird.image;
    const birdLink = document.getElementById('wiki-url') as HTMLAnchorElement;
    birdLink.href = data.bird.link;
    const birdDesc = document.getElementsByClassName('bird-description')[0];

    const weatherIcon = document.getElementsByClassName('weather-icon')[0] as HTMLImageElement;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather.icon}@2x.png`;

    birdDesc.textContent = data.bird.description;

    container.style.visibility = 'visible';

    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'bird') {
        const currentDiv = document.getElementsByClassName(key)[0];

        switch (key) {
          case 'location':
          case 'country':
            currentDiv.textContent = `${value}`;
            break;
          case 'temperature':
            currentDiv.classList.add('celsius');
            currentDiv.textContent = `${key}: ${value}℃`;
            break;

          case 'humidity':
            currentDiv.textContent = `${key}: ${value}%`;
            break;

          case 'time':
            currentDiv.textContent = `Current time: ${value}`;
            break;

          case 'weather':
            currentDiv.textContent = `${value.desc}`;
            break;

          default:
            break;
        }
      }
    });
  }

  function showSpinner() {
    const spinner = document.getElementsByClassName('spinner')[0] as HTMLImageElement;
    spinner.style.visibility = 'visible';
    switch (document.documentElement.getAttribute('color-mode')) {
      case 'dark':
        spinner.classList.add('spinner-contrast');
        break;
      default:
        spinner.classList.remove('spinner-contrast');
        break;
    }
  }

  function hideSpinner() {
    const spinner = document.getElementsByClassName('spinner')[0] as HTMLImageElement;
    spinner.style.visibility = 'hidden';
  }

  function hideError() {
    const error = document.getElementsByClassName('search-error')[0] as HTMLElement;

    error.style.display = 'none';
  }

  function showError(type: string) {
    const error = document.getElementsByClassName('search-error')[0] as HTMLElement;

    if (type === 'empty') {
      error.textContent = 'Field empty';
    } else {
      error.textContent = type;
    }

    if (error.style.display === 'none') {
      error.style.display = 'block';
    }
  }

  function sendForm(event: KeyboardEvent): LocationInfo {
    const searchbar = <HTMLInputElement>document.getElementsByName('location')[0];
    const weather = document.createElement('div');
    weather.classList.add('weather-info');
    weather.style.backgroundImage = `url(${Cloud})`;

    if (searchbar.value === '') {
      showError('empty');
      return;
    }
    showSpinner();

    toLocationInfoPromise(searchbar.value)
      .then((result) => {
        const searchContainer = document.getElementsByClassName('search-container')[0];
        searchContainer.classList.add('search-done');
        hideError();
        displayLocationInfo(result);
      })
      .catch((err) => {
        showError(err as string);
      })
      .finally(() => {
        hideSpinner();
      });

    searchbar.value = '';

    event.preventDefault();
  }

  function colorModeButtons(): Array<HTMLElement> {
    const lightButton = document.createElement('button');
    lightButton.classList.add('color-mode-btn', 'light');
    lightButton.ariaLabel = 'Toggle Light Mode';
    lightButton.textContent = 'Light ☀️';

    const darkButton = document.createElement('button');
    darkButton.classList.add('color-mode-btn', 'dark');
    darkButton.ariaLabel = 'Toggle Dark Mode';
    darkButton.textContent = 'Dark 🌙';

    [lightButton, darkButton].forEach((button) => {
      button.addEventListener('click', toggleColorMode);
    });

    return [lightButton, darkButton];
  }

  function createHeader() {
    const header = document.createElement('header');
    const headerText = document.createElement('span');
    headerText.id = 'header-text';
    headerText.textContent = 'Weather Finch';

    const headerIcon = document.createElement('img');
    headerIcon.src = Bird as string;
    headerIcon.id = 'bird-icon';

    headerText.appendChild(headerIcon);

    const colorModes: Array<HTMLElement> = colorModeButtons();

    header.appendChild(headerText);

    colorModes.forEach((button) => {
      header.appendChild(button);
    });

    return header;
  }

  function createLocationInfo(): HTMLElement {
    const container = document.createElement('div');
    container.id = 'container';
    const weatherDiv = document.createElement('div');
    weatherDiv.className = 'weather-info';
    const birdDiv = document.createElement('div');
    birdDiv.className = 'bird-info';

    const weatherIcon = document.createElement('img');

    weatherIcon.className = 'weather-icon';

    weatherDiv.appendChild(weatherIcon);

    weatherInfo.forEach((el) => {
      const div = document.createElement('span');

      div.className = el;
      weatherDiv.appendChild(div);
    });

    const birdDetails = document.createElement('div');
    birdDetails.className = 'bird-details';

    const birdName = document.createElement('div');
    birdName.className = 'bird-name';

    const birdDesc = document.createElement('p');
    birdDesc.className = 'bird-description';

    const birdImage = document.createElement('img');
    birdImage.className = 'bird-image';

    const birdLink = document.createElement('a');
    birdLink.id = 'wiki-url';

    birdDetails.append(birdName, birdDesc);

    birdLink.appendChild(birdImage);

    birdDiv.append(birdDetails, birdLink);

    container.style.visibility = 'hidden';

    container.append(weatherDiv, birdDiv);

    return container;
  }

  function createSearch(): HTMLElement {
    const container = document.createElement('main');
    container.className = 'search-container';
    const form = document.createElement('form');
    form.className = 'search';
    form.autocomplete = 'off';

    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'location';
    input.placeholder = 'London';

    const icon = document.createElement('img');
    icon.className = 'search-icon';
    icon.src = Search as string;
    icon.addEventListener('click', sendForm);

    const spinner = document.createElement('img');
    spinner.src = Spinner as string;
    spinner.className = 'spinner';
    spinner.style.visibility = 'hidden';

    const err = document.createElement('span');
    err.className = 'search-error';
    err.style.display = 'none';

    form.append(input, icon, spinner);

    form.addEventListener('submit', sendForm);

    const info = createLocationInfo();

    container.append(form, err, info);

    return container;
  }

  function createPage() {
    if (
      localStorage.getItem('color-mode') === 'dark' ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches &&
        !localStorage.getItem('color-mode'))
    ) {
      document.documentElement.setAttribute('color-mode', 'dark');
    } else {
      document.documentElement.setAttribute('color-mode', 'light');
    }

    const header = createHeader();

    const main = createSearch();

    document.body.append(header, main);
  }

  return { createPage };
})();
