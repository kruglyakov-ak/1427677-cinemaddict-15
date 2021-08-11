import { formatReleaseDate, cutDescription, addActiveBtnClass } from '../utils/film.js';
import AbstractView from './abstract.js';

const DATE_FORMAT = 'YYYY';
const MAX_NUMBER_OF_CHARACTERS = 140;

const createFilmCardTemplate = (movie) => {
  const {
    commentsCount,
    title,
    totalRating,
    poster,
    releaseDate,
    runtime,
    description,
    genres,
    isWatchlist,
    isAlreadyWatched,
    isFavorite,
  } = movie;

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${formatReleaseDate(releaseDate, DATE_FORMAT)}</span>
      <span class="film-card__duration">${runtime}</span>
      <span class="film-card__genre">${genres[0]}</span>
    </p>
    <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${cutDescription(description, MAX_NUMBER_OF_CHARACTERS)}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist
        ${addActiveBtnClass(isWatchlist)}" type="button">
          Add to watchlist
        </button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched
        ${addActiveBtnClass(isAlreadyWatched)}" type="button">
          Mark as watched
        </button>
        <button class="film-card__controls-item film-card__controls-item--favorite
         ${addActiveBtnClass(isFavorite)}" type="button">
          Mark as favorite
        </button>
      </div>
  </article>`;
};

export default class FilmCard extends AbstractView {
  constructor(movie) {
    super();
    this._movie = movie;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._movie);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setPosterClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._clickHandler);
  }

  setTitleClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._clickHandler);
  }

  setCommentsClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._clickHandler);
  }
}
