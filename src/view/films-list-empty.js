import AbstractView from './abstract.js';
import {FilterType} from '../const.js';
const ALL_MOVIES_EMPTY_MESSAGE = 'There are no movies in our database';
const WHATCHLIST_MOVIES_EMPTY_MESSAGE = 'There are no movies to watch now';
const HISTORY_MOVIES_EMPTY_MESSAGE = 'There are no watched movies now';
const FAVORITES_MOVIES_EMPTY_MESSAGE = 'There are no favorite movies now';

const NoMoviesTextType = {
  [FilterType.ALL]: ALL_MOVIES_EMPTY_MESSAGE,
  [FilterType.WHATCHLIST]: WHATCHLIST_MOVIES_EMPTY_MESSAGE,
  [FilterType.HISTORY]: HISTORY_MOVIES_EMPTY_MESSAGE,
  [FilterType.FAVORITES]: FAVORITES_MOVIES_EMPTY_MESSAGE,
};


const createFilmsListEmptyTemplate = (filterType) => {
  const noTaskTextValue = NoMoviesTextType[filterType];

  return `<section class="films-list">
    <h2 class="films-list__title">${noTaskTextValue}</h2>
  </section>`;
};

export default class FilmsListEmpty extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createFilmsListEmptyTemplate(this._data);
  }
}
