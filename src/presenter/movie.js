import FilmCardView from '../view/film-card.js';
import FilmPoupView from '../view/film-popup.js';
import {
  render,
  RenderPosition,
  remove,
  replace
} from '../utils/render.js';

const Mode = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
};

export default class Movie {
  constructor(filmListContainer, changeData, changeMode) {
    this._filmListContainer = filmListContainer;
    this._bodyElement = document.querySelector('body');
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmCard = null;

    this._handleAddToWatchlistClick = this._handleAddToWatchlistClick.bind(this);
    this._handleMarkAsWatchedlistClick = this._handleMarkAsWatchedlistClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._mode = Mode.CLOSE;
  }

  init(movie, comments) {
    this._movie = movie;

    const prevFilmCard = this._filmCard;

    this._filmCard = new FilmCardView(movie);

    this._filmCard.setFilmCardInfoClickHandler(() => this._renderPopup(movie, comments));
    this._filmCard.setAddToWatchlistClickHandler(this._handleAddToWatchlistClick);
    this._filmCard.setMarkAsWatchedlistClickHandler(this._handleMarkAsWatchedlistClick);
    this._filmCard.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevFilmCard === null) {
      render(this._filmListContainer, this._filmCard, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmListContainer.getElement().contains(prevFilmCard.getElement())) {
      replace(this._filmCard, prevFilmCard);
    }

    remove(prevFilmCard);
  }

  resetView() {
    if (this._mode !== Mode.CLOSE) {
      this._closePopup();
    }
  }

  destroy() {
    remove(this._filmCard);
  }

  _renderPopup(movie, comments) {
    if (this._popup) {
      this._closePopup();
    }
    this._popup = new FilmPoupView(movie, comments);
    this._openPopup();
    this._bodyElement.classList.add('hide-overflow');

    this._popup.setCloseBtnClickHandler(this._closePopup);
    this._popup.setAddToWatchlistClickHandler(this._handleAddToWatchlistClick);
    this._popup.setMarkAsWatchedlistClickHandler(this._handleMarkAsWatchedlistClick);
    this._popup.setFavoriteClickHandler(this._handleFavoriteClick);
  }

  _closePopup() {
    remove(this._popup);
    document.removeEventListener('keydown', this._onEscKeyDown);
    this._bodyElement.classList.remove('hide-overflow');
    this._mode = Mode.CLOSE;
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _openPopup() {
    render(this._bodyElement, this._popup, RenderPosition.BEFOREEND);
    document.addEventListener('keydown', this._onEscKeyDown);
    this._changeMode();
    this._mode = Mode.OPEN;
  }

  _handleAddToWatchlistClick() {
    this._changeData(
      Object.assign(
        {},
        this._movie,
        {
          isWatchlist: !this._movie.isWatchlist,
        },
      ),
    );
  }

  _handleMarkAsWatchedlistClick() {
    this._changeData(
      Object.assign(
        {},
        this._movie,
        {
          isAlreadyWatched: !this._movie.isAlreadyWatched,
        },
      ),
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._movie,
        {
          isFavorite: !this._movie.isFavorite,
        },
      ),
    );
  }
}


