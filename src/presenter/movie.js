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

const MOVIE_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;
const TOP_RATED_LIST_TITLE = 'Top rated';
const MOST_COMMENTED_LIST_TITLE = 'Most commented';


export default class Movie {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;

    this._sortComponent = new SortView();
    this._filmsListComponent = new FilmsListView();
    this._filmListEmptyComponent = new FilmsListEmptyView();
    this._topRatedListComponent = new FilmsListExtraView(TOP_RATED_LIST_TITLE);
    this._mostCommentedListComponent = new FilmsListExtraView(MOST_COMMENTED_LIST_TITLE);
    this._filmCardComponent = new FilmCardView();
    this._filmPopupComponent = new FilmPoupView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._mainFilmsListElement = this._filmsContainer.querySelector('.films-list');
    this._mainFilmsListContainerElement = this._filmsContainer.querySelector('.films-list__container');
    this._topRatedFilmsListContainerElement = this._filmsContainer
      .querySelector('.films-list:nth-child(2')
      .querySelector('.films-list__container');
    this._mostCommentedFilmsListContainerElement = this._filmsContainer
      .querySelector('.films-list:nth-child(3)')
      .querySelector('.films-list__container');
  }

  init(movies, comments) {
    this._movies = movies.slice();
    this._comments = comments.slice();

    this._renderFilmList();
  }

  _renderSort() {
    if (this._movies.length) {
      render(document.querySelector('.main'), this._sortComponent, RenderPosition.BEFOREEND);
    }
  }

  _renderFilmCard() {
    // Метод, отрисовки карточки фильма
  }

  _renderFilmPopup() {
    // Метод, метод отрисовки попапа
  }

  _renderFilmCards(from, to, container) {
    // Метод для рендеринга N-карточек фильма за раз
  }

  _renderFilmListEmpty() {
    render(this._filmsContainer, this._filmListEmptyComponent, RenderPosition.BEFOREEND);
  }

  _renderShowMoreButton() {
    // Метод, куда уйдёт логика по отрисовке компонетов задачи,
    // текущая функция renderTask в main.js
  }

  _renderTopRatedFilmList() {
    render(this._filmsContainer, this._topRatedListComponent, RenderPosition.BEFOREEND);
    this._renderFilmCards(0, EXTRA_FILMS_COUNT, this._topRatedFilmsListContainerElement);
  }

  _renderMostCommentedFilmList() {
    render(this._filmsContainer, this._mostCommentedListComponent, RenderPosition.BEFOREEND);
    this._renderFilmCards(0, EXTRA_FILMS_COUNT, this._mostCommentedFilmsListContainerElement);
  }

  _renderFilmList() {
    if (!this._movies.length) {
      this._renderFilmListEmpty();
      return;
    }

    this._renderSort();

    render(this._filmsContainer, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderFilmCards(0, Math.min(this._movies.length, MOVIE_COUNT_PER_STEP), this._mainFilmsListContainerElement);
    if (this._movies.length > MOVIE_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }

    this._renderTopRatedFilmList();
    this._renderMostCommentedFilmList();
  }
}
