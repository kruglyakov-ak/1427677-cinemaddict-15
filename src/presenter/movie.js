import FilmCardView from '../view/film-card.js';
import FilmPoupView from '../view/film-popup.js';
import {
  render,
  RenderPosition,
  remove,
  replace
} from '../utils/render.js';


export default class Movie {
  constructor(filmListContainer, changeData) {
    this.filmListContainer = filmListContainer;
    this._bodyElement = document.querySelector('body');
    this._changeData = changeData;

    this._filmCard = null;

    this._handleAddToWatchlistClick = this._handleAddToWatchlistClick.bind(this);
    this._handleMarkAsWatchedlistClick = this._handleMarkAsWatchedlistClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  init(movie, comments) {
    this._movie = movie;

    const prevFilmCard = this._filmCard;

    this._filmCard = new FilmCardView(movie);

    this._filmCard.setFilmCardInfoClickHandler(() => this._renderPopup(movie, comments));
    this._filmCard.setAddToWatchlistClickHandler(() => {
      if (this._popup) {
        this._popup.getElement().querySelector('.film-details__control-button--watchlist')
          .classList.toggle('film-details__control-button--active');
      }
      this._handleAddToWatchlistClick();
    });
    this._filmCard.setMarkAsWatchedlistClickHandler(() => {
      if (this._popup) {
        this._popup.getElement().querySelector('.film-details__control-button--watched')
          .classList.toggle('film-details__control-button--active');
      }
      this._handleMarkAsWatchedlistClick();
    });
    this._filmCard.setFavoriteClickHandler(() => {
      if (this._popup) {
        this._popup.getElement().querySelector('.film-details__control-button--favorite')
          .classList.toggle('film-details__control-button--active');
      }
      this._handleFavoriteClick();
    });

    if (prevFilmCard === null) {
      render(this.filmListContainer, this._filmCard, RenderPosition.BEFOREEND);
      return;
    }

    if (this.filmListContainer.contains(prevFilmCard.getElement())) {
      replace(this._filmCard, prevFilmCard);
    }

    remove(prevFilmCard);
  }

  destroy() {
    remove(this._filmCard);
  }

  _renderPopup(movie, comments) {
    this._popup = new FilmPoupView(movie, comments);
    this._openPopup();

    this._popup.setCloseBtnClickHandler(() => {
      this._closePopup();
    });
    this._popup.setAddToWatchlistClickHandler(() => {
      this._handleAddToWatchlistClick();
      this._popup.getElement().querySelector('.film-details__control-button--watchlist')
        .classList.toggle('film-details__control-button--active');
    });
    this._popup.setMarkAsWatchedlistClickHandler(() => {
      this._handleMarkAsWatchedlistClick();
      this._popup.getElement().querySelector('.film-details__control-button--watched')
        .classList.toggle('film-details__control-button--active');
    });
    this._popup.setFavoriteClickHandler(() => {
      this._handleFavoriteClick();
      this._popup.getElement().querySelector('.film-details__control-button--favorite')
        .classList.toggle('film-details__control-button--active');
    });
  }

  _closePopup() {
    remove(this._popup);
    this._bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _openPopup() {
    if (document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
    }
    render(this._bodyElement, this._popup, RenderPosition.BEFOREEND);
    this._bodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onEscKeyDown);
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


