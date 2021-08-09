import { createElement } from '../utils.js';
const ALL_MOVIES_EMPTY_MESSAGE = 'There are no movies in our database';

const createFilmsListTitle = (moviesLength) => {
  if (!moviesLength) {
    const title = ALL_MOVIES_EMPTY_MESSAGE;
    return `<h2 class="films-list__title">${title}</h2>`;
  }

  return '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>';
};
const createFilmsListTemplate = (moviesLength) => (
  `<section class="films-list">
    ${createFilmsListTitle(moviesLength)}
    <div class="films-list__container"></div>
  </section>`
);

export default class FilmsList {
  constructor(movies) {
    this._element = null;
    this._moviesLength = movies.length;
  }

  getTemplate() {
    return createFilmsListTemplate(this._moviesLength);
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
