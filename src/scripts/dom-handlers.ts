import toLocationInfoPromise from './api-handlers';
import LocationInfo from '../index';
import Search from '../images/search-dark.svg';
import Spinner from '../images/spinner.svg';

export default (function domHandlers() {
  // TODO: Create and style the page

  function createPage() {}

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
    // TODO: Make this function toggle visibility and add error as a hidden element beforehand
    const error = <HTMLElement>document.querySelector('.search-error');

    if (type === 'empty') {
      error.textContent = 'Cannot submit an empty query.';
    } else {
      error.textContent = 'Cannot find your specified location.';
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
          hideSpinner();
          hideError();
          console.log(result);
        })
        .catch((error) => {
          hideSpinner();
          showError(error);
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
