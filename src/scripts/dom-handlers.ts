import toLocationInfoPromise from './api-handlers';
import { LocationInfo } from './interfaces';
import Search from '../images/search-dark.svg';
import Spinner from '../images/spinner.svg';
import Bird from '../images/bird.svg';

export default (function domHandlers() {
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
    console.log(data);
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
    const error = <HTMLElement>document.querySelector('.search-error');
    error.style.display = 'none';
  }

  function showError(type: string) {
    const error = <HTMLElement>document.querySelector('.search-error');

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
      .catch((error) => {
        showError(error);
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
    headerIcon.src = Bird;
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
    // todo: placeholder
    const main = document.createElement('main');
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
    icon.src = Search;
    icon.addEventListener('click', sendForm);

    const spinner = document.createElement('img');
    spinner.src = Spinner;
    spinner.className = 'spinner';
    spinner.style.visibility = 'hidden';

    const error = document.createElement('span');
    error.className = 'search-error';
    error.style.display = 'none';

    form.append(input, icon, spinner);

    form.addEventListener('submit', sendForm);

    container.append(form, error);

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
