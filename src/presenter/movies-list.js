import SortView from '../view/sort.js';
import FilmsListView from '../view/films-list.js';
import FilmsListExtraView from '../view/films-list-extra.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmsListEmptyView from '../view/films-list-empty.js';
import FilmsContainerView from '../view/films-container.js';
import FilmsListContainerView from '../view/films-list-container.js';
import MoviePresenter from './movie.js';
import {
  render,
  RenderPosition,
  remove
} from '../utils/render.js';
import { updateItem } from '../utils/common.js';
import {
  sortByRating,
  sortByComments,
  sortByDate
} from '../utils/film.js';
import { SortType } from '../const.js';

const MOVIE_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;
const TOP_RATED_LIST_TITLE = 'Top rated';
const MOST_COMMENTED_LIST_TITLE = 'Most commented';

export default class MoviesList {
  constructor(main) {
    this._mainElement = main;
    this._filmsContainer = new FilmsContainerView();
    this._filmsListContainer = new FilmsListContainerView();
    this._topRatedfilmsListContainer = new FilmsListContainerView();
    this._mostCommentedfilmsListContainer = new FilmsListContainerView();
    this._sortComponent = new SortView();
    this._filmsListComponent = new FilmsListView();
    this._filmListEmptyComponent = new FilmsListEmptyView();
    this._topRatedListComponent = new FilmsListExtraView(TOP_RATED_LIST_TITLE);
    this._mostCommentedListComponent = new FilmsListExtraView(MOST_COMMENTED_LIST_TITLE);
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._moviePresenter = new Map();
    this._movieExtraRatePresenter = new Map();
    this._movieExtraCommentPresenter = new Map();

    this._renderedMoviesCount = MOVIE_COUNT_PER_STEP;
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleFilmCardChange = this._handleFilmCardChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(movies, commentsList) {
    this._movies = movies.slice();
    this._sourcedMovies = movies.slice();
    this._commentsList = commentsList.slice();
    this._renderSort();
    this._renderFilmsContainer();
  }

  _sortMovie(sortType) {
    switch (sortType) {
      case SortType.BY_RATING:
        sortByRating(this._movies);
        break;
      case SortType.BY_DATE:
        sortByDate(this._movies);
        break;
      default:
        this._movies = this._sourcedMovies.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortMovie(sortType);
    this._clearFilmList();
    this._renderFilmsContainer();
  }

  _handleModeChange() {
    this._moviePresenter.forEach((presenter) => presenter.resetView());
    this._movieExtraRatePresenter.forEach((presenter) => presenter.resetView());
    this._movieExtraCommentPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleFilmCardChange(updatedFilmCard) {
    this._movies = updateItem(this._movies, updatedFilmCard);
    this._sourcedMovies = updateItem(this._sourcedMovies, updatedFilmCard);

    const initFilmCardPresenter = (presentersMap) => {
      if (presentersMap.has(updatedFilmCard.id)) {
        presentersMap.get(updatedFilmCard.id).init(updatedFilmCard, this._getComments(updatedFilmCard.id));
      }
    };

    initFilmCardPresenter(this._moviePresenter);
    initFilmCardPresenter(this._movieExtraRatePresenter);
    initFilmCardPresenter(this._movieExtraCommentPresenter);
  }

  _getComments(id) {
    let comments;
    this._commentsList
      .forEach((comment) => {
        if (comment.has(id)) {
          comments = comment.get(id);
        }
      });

    return comments;
  }

  _renderSort() {
    if (this._movies.length) {
      render(this._mainElement, this._sortComponent, RenderPosition.BEFOREEND);
      this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    }
  }

  _renderFilmCard(containerElement, movie, movieList) {
    const moviePresenter = new MoviePresenter(containerElement, this._handleFilmCardChange, this._handleModeChange);
    movieList.set(movie.id, moviePresenter);
    moviePresenter.init(movie, this._getComments(movie.id));
  }

  _renderFilmCards(from, to, container, movies, movieList) {
    movies
      .slice(from, to)
      .forEach((movie) => this._renderFilmCard(container, movie, movieList));
  }

  _renderFilmListEmpty() {
    render(this._filmsContainer, this._filmListEmptyComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    this._renderFilmCards(
      this._renderedMoviesCount,
      this._renderedMoviesCount + MOVIE_COUNT_PER_STEP,
      this._filmsListContainer,
      this._movies,
      this._moviePresenter);
    this._renderedMoviesCount += MOVIE_COUNT_PER_STEP;
    if (this._renderedMoviesCount >= this._movies.length) {
      this._showMoreButtonComponent.getElement().remove();
    }
  }

  _renderShowMoreButton() {
    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderTopRatedFilmList() {
    render(this._filmsContainer, this._topRatedListComponent, RenderPosition.BEFOREEND);
    this._renderFilmsListContainer(this._topRatedListComponent, this._topRatedfilmsListContainer);

    this._renderFilmCards(0,
      EXTRA_FILMS_COUNT,
      this._topRatedfilmsListContainer,
      sortByRating(this._movies.slice()),
      this._movieExtraRatePresenter);
  }

  _renderMostCommentedFilmList() {
    render(this._filmsContainer, this._mostCommentedListComponent, RenderPosition.BEFOREEND);
    this._renderFilmsListContainer(this._mostCommentedListComponent, this._mostCommentedfilmsListContainer);
    this._renderFilmCards(0,
      EXTRA_FILMS_COUNT,
      this._mostCommentedfilmsListContainer,
      sortByComments(this._movies.slice()),
      this._movieExtraCommentPresenter);
  }

  _renderFilmList() {
    render(this._filmsContainer, this._filmsListComponent, RenderPosition.AFTERBEGIN);
    this._renderFilmsListContainer(this._filmsListComponent, this._filmsListContainer);

    this._renderFilmCards(
      0,
      Math.min(this._movies.length, MOVIE_COUNT_PER_STEP),
      this._filmsListContainer,
      this._movies,
      this._moviePresenter);
    if (this._movies.length > MOVIE_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _clearMapPresenter(mapPresenter) {
    mapPresenter.forEach((presenter) => presenter.destroy());
    mapPresenter.clear();
  }

  _clearFilmList() {
    this._clearMapPresenter(this._moviePresenter);
    this._clearMapPresenter(this._movieExtraRatePresenter);
    this._clearMapPresenter(this._movieExtraCommentPresenter);
    this._renderedMoviesCount = MOVIE_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
    remove(this._topRatedListComponent);
    remove(this._mostCommentedListComponent);
  }

  _renderFilmsListContainer(container, component) {
    render(container, component, RenderPosition.BEFOREEND);
  }

  _renderFilmsContainer() {
    render(this._mainElement, this._filmsContainer, RenderPosition.BEFOREEND);

    if (!this._movies.length) {
      this._renderFilmListEmpty();
      return;
    }

    this._renderTopRatedFilmList();
    this._renderMostCommentedFilmList();
    this._renderFilmList();
  }
}

