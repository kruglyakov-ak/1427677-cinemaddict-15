import FilmCardView from '../view/film-card.js';
import FilmPoupView from '../view/film-popup.js';
import {
  render,
  RenderPosition,
  remove,
  replace
} from '../utils/render.js';


export default class Movie {
  constructor(filmListContainer) {
    this.filmListContainer = filmListContainer;
    this._bodyElement = document.querySelector('body');

    this._filmCard = null;
  }

  init(movie, comments) {
    this._movie = movie;

    const prevFilmCard = this._filmCard;

    this._filmCard = new FilmCardView(movie);

    this._filmCard.setFilmCardInfoClickHandler(() => this._renderPopup(movie, comments));

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
    this._openPopup(this._popup);

    this._popup.setCloseBtnClickHandler(() => {
      this._closePopup(this._popup);
    });
  }

  _closePopup(popup) {
    remove(popup);
    this._bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', (evt) => this._onEscKeyDown(evt, popup));
  }

  _onEscKeyDown(evt, popup) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup(popup);
    }
  }

  _openPopup(popup) {
    if (document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
    }
    render(this._bodyElement, popup, RenderPosition.BEFOREEND);
    this._bodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', (evt) => this._onEscKeyDown(evt, popup));
  }
}
