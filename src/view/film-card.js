import { formatReleaseDate, cutDescription, generateRuntime } from '../utils/film.js';
import AbstractView from './abstract.js';

const DATE_FORMAT = 'YYYY';
const MAX_NUMBER_OF_CHARACTERS = 140;
const ACTIVE_CARD_CLASS_NAME = 'film-card__controls-item--active';

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
      <span class="film-card__duration">${generateRuntime(runtime)}</span>
      <span class="film-card__genre">${genres[0]}</span>
    </p>
    <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${cutDescription(description, MAX_NUMBER_OF_CHARACTERS)}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist
        ${isWatchlist ? ACTIVE_CARD_CLASS_NAME : ''}" type="button">
          Add to watchlist
        </button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched
        ${isAlreadyWatched ? ACTIVE_CARD_CLASS_NAME : ''}" type="button">
          Mark as watched
        </button>
        <button class="film-card__controls-item film-card__controls-item--favorite
         ${isFavorite ? ACTIVE_CARD_CLASS_NAME : ''}" type="button">
          Mark as favorite
        </button>
      </div>
  </article>`;
};

export default class FilmCard extends AbstractView {
  constructor(movie) {
    super();
    this._movie = movie;
    this._clickFilmCardInfoHandler = this._clickFilmCardInfoHandler.bind(this);
    this._clickAddToWatchlistHandler = this._clickAddToWatchlistHandler.bind(this);
    this._clickMarkAsWatchedlistHandler = this._clickMarkAsWatchedlistHandler.bind(this);
    this._clickFavoriteHandler = this._clickFavoriteHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._movie);
  }

  _clickFilmCardInfoHandler(evt) {
    evt.preventDefault();
    this._callback.filmCardInfoClick();
  }

  _clickAddToWatchlistHandler(evt) {
    evt.preventDefault();
    this._callback.addToWatchlistClick();
  }

  _clickMarkAsWatchedlistHandler(evt) {
    evt.preventDefault();
    this._callback.markAsWatchedlistClick();
  }

  _clickFavoriteHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFilmCardInfoClickHandler(callback) {
    this._callback.filmCardInfoClick = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._clickFilmCardInfoHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._clickFilmCardInfoHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._clickFilmCardInfoHandler);
  }

  setAddToWatchlistClickHandler(callback) {
    this._callback.addToWatchlistClick = callback;
    this.getElement()
      .querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this._clickAddToWatchlistHandler);
  }

  setMarkAsWatchedlistClickHandler(callback) {
    this._callback.markAsWatchedlistClick = callback;
    this.getElement()
      .querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this._clickMarkAsWatchedlistHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement()
      .querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this._clickFavoriteHandler);
  }
}
