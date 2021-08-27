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
// import { updateItem } from '../utils/common.js';
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
  constructor(main, moviesModel, commentsListModel) {
    this._mainElement = main;
    this._moviesModel = moviesModel;
    this._commentsListModel = commentsListModel;

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
    this._currentSortType = SortType.DEFAULT;

    this._renderedMoviesCount = MOVIE_COUNT_PER_STEP;
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._commentsListModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderSort();
    this._renderFilmsContainer();
  }


  _getMovies() {
    switch (this._currentSortType) {
      case SortType.BY_RATING:
        return sortByRating(this._moviesModel.getMovies().slice());
      case SortType.BY_DATE:
        return sortByDate(this._moviesModel.getMovies().slice());
    }

    return this._moviesModel.getMovies();
  }

  _getCommentsList() {
    return this._commentsListModel.getCommentsList();
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

    this._currentSortType = sortType;
    this._clearFilmList();
    this._renderFilmsContainer();
  }

  _handleModeChange() {
    this._moviePresenter.forEach((presenter) => presenter.resetView());
    this._movieExtraRatePresenter.forEach((presenter) => presenter.resetView());
    this._movieExtraCommentPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  }

  _handleModelEvent(updateType, data) {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
  }

  // _handleFilmCardChange(updatedFilmCard) {
  //   const initFilmCardPresenter = (presentersMap) => {
  //     if (presentersMap.has(updatedFilmCard.id)) {
  //       presentersMap.get(updatedFilmCard.id).init(updatedFilmCard, this._getComments(updatedFilmCard.id));
  //     }
  //   };

  //   initFilmCardPresenter(this._moviePresenter);
  //   initFilmCardPresenter(this._movieExtraRatePresenter);
  //   initFilmCardPresenter(this._movieExtraCommentPresenter);
  // }

  _getComments(id) {
    let comments;
    this._getCommentsList()
      .forEach((comment) => {
        if (comment.has(id)) {
          comments = comment.get(id);
        }
      });

    return comments;
  }

  _renderSort() {
    if (this._getMovies().length) {
      render(this._mainElement, this._sortComponent, RenderPosition.BEFOREEND);
      this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    }
  }

  _renderFilmCard(containerElement, movie, movieList) {
    const moviePresenter = new MoviePresenter(containerElement, this._handleViewAction, this._handleModeChange);
    movieList.set(movie.id, moviePresenter);
    moviePresenter.init(movie, this._getComments(movie.id));
  }

  _renderFilmCards(container, movies, movieList) {
    movies
      .forEach((movie) => this._renderFilmCard(container, movie, movieList));
  }

  _renderFilmListEmpty() {
    render(this._filmsContainer, this._filmListEmptyComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    const movieCount = this._getMovies().length;
    const newRenderedMoviekCount = Math.min(movieCount, this._renderedMoviesCount + MOVIE_COUNT_PER_STEP);
    const movies = this._getMovies().slice(this._renderedMoviesCount, newRenderedMoviekCount);
    this._renderFilmCards(this._filmsListContainer, movies, this._moviePresenter);
    this._renderedMoviesCount = newRenderedMoviekCount;

    if (this._renderedMoviesCount >= movieCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderTopRatedFilmList() {
    render(this._filmsContainer, this._topRatedListComponent, RenderPosition.BEFOREEND);
    this._renderFilmsListContainer(this._topRatedListComponent, this._topRatedfilmsListContainer);

    const movieCount = this._getMovies().length;
    const movies = sortByRating(this._getMovies()).slice(0, Math.min(movieCount, EXTRA_FILMS_COUNT));

    this._renderFilmCards(this._topRatedfilmsListContainer, movies, this._movieExtraRatePresenter);
  }

  _renderMostCommentedFilmList() {
    render(this._filmsContainer, this._mostCommentedListComponent, RenderPosition.BEFOREEND);
    this._renderFilmsListContainer(this._mostCommentedListComponent, this._mostCommentedfilmsListContainer);

    const movieCount = this._getMovies().length;
    const movies = sortByComments(this._getMovies()).slice(0, Math.min(movieCount, EXTRA_FILMS_COUNT));

    this._renderFilmCards(this._mostCommentedfilmsListContainer, movies, this._movieExtraCommentPresenter);
  }

  _renderFilmList() {
    render(this._filmsContainer, this._filmsListComponent, RenderPosition.AFTERBEGIN);
    this._renderFilmsListContainer(this._filmsListComponent, this._filmsListContainer);

    const movieCount = this._getMovies().length;
    const movies = this._getMovies().slice(0, Math.min(movieCount, MOVIE_COUNT_PER_STEP));

    this._renderFilmCards(this._filmsListContainer, movies, this._moviePresenter);

    if (movieCount > MOVIE_COUNT_PER_STEP) {
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

    if (!this._getMovies().length) {
      this._renderFilmListEmpty();
      return;
    }

    this._renderTopRatedFilmList();
    this._renderMostCommentedFilmList();
    this._renderFilmList();
  }
}

