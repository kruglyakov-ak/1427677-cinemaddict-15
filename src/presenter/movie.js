import FilmCardView from '../view/film-card.js';
import FilmPoupView from '../view/film-popup.js';
import {
  render,
  RenderPosition,
  remove
} from '../utils/render.js';


export default class Movie {
  constructor(filmListContainer) {
    this.filmListContainer = filmListContainer;
    this._bodyElement = document.querySelector('body');

    this._renderFilmPopup = this._renderFilmPopup.bind(this);
  }

  init(movie, comments) {
    this._movie = movie;
    this._filmCard = new FilmCardView(movie);

    this._filmCard.setFilmCardInfoClickHandler(() => {
      this._renderFilmPopup(movie, comments);
    });

    render(this.filmListContainer, this._filmCard, RenderPosition.BEFOREEND);
  }

  _renderFilmPopup(movie, comments) {
    const popup = new FilmPoupView(movie, comments);
    this._openPopup(popup);

    popup.setCloseBtnClickHandler(() => {
      this._closePopup(popup);
      document.removeEventListener('keydown', (evt) => this._onEscKeyDown(evt, popup));
    });
  }

  _closePopup(popup) {
    remove(popup);
    this._bodyElement.classList.remove('hide-overflow');
  }

  _onEscKeyDown(evt, popup) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup(popup);
      document.removeEventListener('keydown', (event) => this._onEscKeyDown(event, popup));
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
