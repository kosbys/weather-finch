import toLocationInfoPromise from './api-handlers';
import Search from '../images/search-dark.svg';
import LocationInfo from '../index';

export default (function domHandlers() {
  function formError(type: string) {
    // TODO: Make this function toggle visibility and add error as a hidden element beforehand
    const error = document.createElement('div');
    error.className = 'search-error';

    if (type === 'empty') {
      error.textContent = 'Cannot submit an empty query.';
    } else {
      error.textContent = 'Cannot find your specified location.';
    }

    document.body.append(error);
  }

  function sendForm(event: KeyboardEvent): LocationInfo {
    const searchbar = <HTMLInputElement>document.getElementsByName('location')[0];
    if (searchbar.value === '') {
      formError('empty');
      return;
    } else {
      const data = toLocationInfoPromise(searchbar.value)
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          formError(error);
        });

      searchbar.value = '';
    }

    event.preventDefault();
  }

  function createSearch(): HTMLFormElement {
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

    form.append(input, icon);

    form.addEventListener('submit', sendForm);

    return form;
  }
  return { createSearch };
})();
