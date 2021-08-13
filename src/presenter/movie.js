import SortView from './view/sort.js';
import FilmsListView from './view/films-list.js';
import FilmCardView from './view/film-card.js';
import FilmsListExtraView from './view/films-list-extra.js';
import ShowMoreButtonView from './view/show-more-button.js';
import FilmPoupView from './view/film-popup.js';
import FilmsListEmptyView from './view/films-list-empty.js';
import {
  render,
  RenderPosition
} from './utils/render.js';

export default class Board {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;

    this._sortComponent = new SortView();
    this._filmsListComponent = new FilmsListView();
    this._filmListEmptyComponent = new FilmsListEmptyView();
    this._filmsListExtraComponent = new FilmsListExtraView();
    this._filmCardComponent = new FilmCardView();
    this._filmPopupComponent = new FilmPoupView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
  }

  init(movies) {
    this.movies = movies.slice();
    // Метод для инициализации (начала работы) модуля,
  }

  _renderSort() {
    // Метод для рендеринга сортировки
  }

  _renderFilmCard() {
    // Метод, отрисовки карточки фильма
  }

  _renderFilmPopup() {
    // Метод, метод отрисовки попапа
  }

  _renderFilmCards() {
    // Метод для рендеринга N-карточек фильма за раз
  }

  _renderFilmListEmpty() {
    // Метод для рендеринга заглушки
  }

  _renderShowMoreButton() {
    // Метод, куда уйдёт логика по отрисовке компонетов задачи,
    // текущая функция renderTask в main.js
  }

  _renderFilmListExtra() {
    // Метод для рендеринга доп. списков фильмов (Top rated, Most commented)
  }

  _renderFilmList() {
    // Метод для инициализации (начала работы) модуля
  }

}
