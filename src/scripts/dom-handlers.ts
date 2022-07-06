import toLocationInfoPromise from './api-handlers';
import LocationInfo from '../index';
import Search from '../images/search-dark.svg';
import Spinner from '../images/spinner.svg';
import Bird from '../images/bird.svg';

export default (function domHandlers() {
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

  function toggleColorMode(event: Event) {
    const button = event.currentTarget as HTMLElement;

    if (button.classList.contains('light')) {
      document.documentElement.setAttribute('color-mode', 'light');
    } else {
      document.documentElement.setAttribute('color-mode', 'dark');
    }
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

  function createPage() {
    document.documentElement.setAttribute('color-mode', 'light');

    const header = createHeader();

    document.body.appendChild(header);
  }

  function showSpinner() {
    const spinner = document.createElement('img');
    spinner.src = Spinner;
    spinner.className = 'spinner';
    document.body.append(spinner);
  }

  function hideSpinner() {
    const spinner = document.getElementsByClassName('spinner')[0];
    document.body.removeChild(spinner);
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
    if (searchbar.value === '') {
      showError('empty');
      return;
    } else {
      showSpinner();
      const data = toLocationInfoPromise(searchbar.value)
        .then((result) => {
          hideError();
          console.log(result);
        })
        .catch((error) => {
          showError(error);
        })
        .finally(() => {
          hideSpinner();
        });

      searchbar.value = '';
    }

    event.preventDefault();
  }

  function createSearch(): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'search-container';
    const form = document.createElement('form');
    form.className = 'search';

    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'location';
    input.placeholder = 'London';

    const icon = document.createElement('img');
    icon.className = 'search-icon';
    icon.src = Search;
    icon.addEventListener('click', sendForm);

    const error = document.createElement('span');
    error.className = 'search-error';
    error.style.display = 'none';

    form.append(input, icon);

    form.addEventListener('submit', sendForm);

    container.append(form, error);

    return container;
  }
  return { createPage, createSearch };
})();
