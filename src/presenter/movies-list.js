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
import {
  sortByRating,
  sortByComments,
  sortByDate
} from '../utils/film.js';
import { SortType, UpdateType, UserAction } from '../const.js';

const MOVIE_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;
const TOP_RATED_LIST_TITLE = 'Top rated';
const MOST_COMMENTED_LIST_TITLE = 'Most commented';

export default class MoviesList {
  constructor(main, moviesModel) {
    this._mainElement = main;
    this._moviesModel = moviesModel;

    this._filmsContainer = new FilmsContainerView();
    this._filmsListContainer = new FilmsListContainerView();
    this._topRatedfilmsListContainer = new FilmsListContainerView();
    this._mostCommentedfilmsListContainer = new FilmsListContainerView();
    this._filmsListComponent = new FilmsListView();
    this._filmListEmptyComponent = new FilmsListEmptyView();
    this._topRatedListComponent = new FilmsListExtraView(TOP_RATED_LIST_TITLE);
    this._mostCommentedListComponent = new FilmsListExtraView(MOST_COMMENTED_LIST_TITLE);
    this._sortComponent = null;
    this._showMoreButtonComponent = null;
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
  }

  init() {
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
    this._clearFilmList({resetRenderedMoviekCount: true});
    this._renderFilmsContainer();
  }

  _handleModeChange() {
    this._moviePresenter.forEach((presenter) => presenter.resetView());
    this._movieExtraRatePresenter.forEach((presenter) => presenter.resetView());
    this._movieExtraCommentPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM_CARD:
        this._moviesModel.updateMovie(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsListModel.addComments(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsListModel.deleteComments(updateType, update);
        break;
    }
  }

  _initFilmCardPresenter(presentersMap, data) {
    if (presentersMap.has(data.id)) {
      presentersMap.get(data.id).init(data, data.comments);
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._initFilmCardPresenter(this._moviePresenter, data);
        this._initFilmCardPresenter(this._movieExtraRatePresenter, data);
        this._initFilmCardPresenter(this._movieExtraCommentPresenter, data);
        break;
      case UpdateType.MINOR:
        this._clearFilmList();
        this._renderFilmsContainer();
        break;
      case UpdateType.MAJOR:
        this._clearFilmList({resetRenderedMoviekCount: true, resetSortType: true});
        this._renderFilmsContainer();
        break;
    }
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }
    this._sortComponent = new SortView(this._currentSortType);

    if (this._getMovies().length) {
      render(this._mainElement, this._sortComponent, RenderPosition.BEFOREEND);
      this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    }
  }

  _renderFilmCard(containerElement, movie, movieList) {
    const moviePresenter = new MoviePresenter(containerElement, this._handleViewAction, this._handleModeChange);
    movieList.set(movie.id, moviePresenter);
    moviePresenter.init(movie, movie.comments);
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
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }
    this._showMoreButtonComponent = new ShowMoreButtonView();
    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderTopRatedFilmList() {
    render(this._filmsContainer, this._topRatedListComponent, RenderPosition.BEFOREEND);
    this._renderFilmsListContainer(this._topRatedListComponent, this._topRatedfilmsListContainer);

    const movieCount = this._getMovies().length;
    const movies = sortByRating(this._getMovies().slice()).slice(0, Math.min(movieCount, EXTRA_FILMS_COUNT));

    this._renderFilmCards(this._topRatedfilmsListContainer, movies, this._movieExtraRatePresenter);
  }

  _renderMostCommentedFilmList() {
    render(this._filmsContainer, this._mostCommentedListComponent, RenderPosition.BEFOREEND);
    this._renderFilmsListContainer(this._mostCommentedListComponent, this._mostCommentedfilmsListContainer);

    const movieCount = this._getMovies().length;
    const movies = sortByComments(this._getMovies().slice()).slice(0, Math.min(movieCount, EXTRA_FILMS_COUNT));

    this._renderFilmCards(this._mostCommentedfilmsListContainer, movies, this._movieExtraCommentPresenter);
  }

  _renderFilmList() {
    render(this._filmsContainer, this._filmsListComponent, RenderPosition.AFTERBEGIN);
    this._renderFilmsListContainer(this._filmsListComponent, this._filmsListContainer);

    const movieCount = this._getMovies().length;
    const movies = this._getMovies().slice(0, Math.min(movieCount, MOVIE_COUNT_PER_STEP));
    if (!this._getMovies().length) {
      this._renderFilmListEmpty();
      return;
    }

    this._renderFilmCards(this._filmsListContainer, movies, this._moviePresenter);

    if (movieCount > MOVIE_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _clearMapPresenter(mapPresenter) {
    mapPresenter.forEach((presenter) => presenter.destroy());
    mapPresenter.clear();
  }

  _clearFilmList({resetRenderedMoviekCount = false, resetMovieType = false} = {}) {
    const movieCount = this._getMovies().length;

    this._moviePresenter.forEach((presenter) => presenter.destroy());
    this._moviePresenter.clear();

    this._clearMapPresenter(this._moviePresenter);
    this._clearMapPresenter(this._movieExtraCommentPresenter);
    this._clearMapPresenter(this._movieExtraRatePresenter);

    remove(this._sortComponent);
    remove(this._filmListEmptyComponent);
    remove(this._showMoreButtonComponent);

    if (resetRenderedMoviekCount) {
      this._renderedMoviesCount = MOVIE_COUNT_PER_STEP;
    } else {
      this._renderedMoviesCount = Math.min(movieCount, this._renderedMoviesCount);
    }

    if (resetMovieType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderFilmsListContainer(container, component) {
    render(container, component, RenderPosition.BEFOREEND);
  }

  _renderFilmsContainer() {
    this._renderSort();
    render(this._mainElement, this._filmsContainer, RenderPosition.BEFOREEND);

    this._renderTopRatedFilmList();
    this._renderMostCommentedFilmList();
    this._renderFilmList();
  }
}

