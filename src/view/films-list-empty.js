import {createElement} from '../utils.js';
const ALL_MOVIES_EMPTY_MESSAGE = 'There are no movies in our database';

const createFilmsListEmptyTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title">${ALL_MOVIES_EMPTY_MESSAGE}</h2>
  </section>`
);

export default class FilmsListEmpty {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsListEmptyTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
