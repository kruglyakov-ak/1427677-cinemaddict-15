import AbstractView from './abstract.js';

const ALL_MOVIES_EMPTY_MESSAGE = 'There are no movies in our database';

const createFilmsListEmptyTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title">${ALL_MOVIES_EMPTY_MESSAGE}</h2>
  </section>`
);

export default class FilmsListEmpty extends AbstractView {
  getTemplate() {
    return createFilmsListEmptyTemplate();
  }
}
