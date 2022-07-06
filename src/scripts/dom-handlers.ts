import toLocationInfoPromise from './api-handlers';
import { LocationInfo } from './interfaces';
import Search from '../images/search-dark.svg';
import Spinner from '../images/spinner.svg';
import Bird from '../images/bird.svg';

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
    const main = document.getElementById('main');
    const birdName = document.getElementsByClassName('bird-name')[0];
    birdName.textContent = `I found a ${data.bird.name} in ${data.location}!`;
    const birdImage = document.getElementsByClassName('bird-image')[0] as HTMLImageElement;
    birdImage.src = data.bird.image;

    main.style.visibility = 'visible';

    console.log(data);
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'bird') {
        const currentDiv = document.getElementsByClassName(key)[0];

        currentDiv.textContent = `${key}: ${value}`;

        if (key === 'humidity') {
          currentDiv.textContent += '%';
        }

        if (key === 'temperature') {
          currentDiv.classList.add('celsius');
          currentDiv.textContent += '℃';
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
      error.textContent = 'Location not found';
    }

    if (error.style.display === 'none') {
      error.style.display = 'block';
    }
  }

  function sendForm(event: KeyboardEvent): LocationInfo {
    const searchbar = <HTMLInputElement>document.getElementsByName('location')[0];
    const weather = document.createElement('div');
    weather.classList.add('weather-info');

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
        console.log(err);

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
    const main = document.createElement('main');
    main.id = 'main';
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

    const birdName = document.createElement('div');
    birdName.className = 'bird-name';

    const birdImage = document.createElement('img');
    birdImage.className = 'bird-image';

    birdDiv.append(birdName, birdImage);

    main.style.visibility = 'hidden';

    main.append(weatherDiv, birdDiv);

    return main;
  }

  function createSearch(): HTMLElement {
    const container = document.createElement('nav');
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

    container.append(form, err);

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

    const nav = createSearch();

    const main = createLocationInfo();

    document.body.append(header, nav, main);
  }

  return { createPage };
})();
