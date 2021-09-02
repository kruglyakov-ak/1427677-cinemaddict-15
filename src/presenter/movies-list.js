import SortView from '../view/sort.js';
import FilmsListView from '../view/films-list.js';
import FilmsListExtraView from '../view/films-list-extra.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmsListEmptyView from '../view/films-list-empty.js';
import FilmsContainerView from '../view/films-container.js';
import StatsVeiw from '../view/stats.js';
import FilmsListContainerView from '../view/films-list-container.js';
import MoviePresenter from './movie.js';
import { filter } from '../utils/filter.js';
import {
  render,
  RenderPosition,
  remove
} from '../utils/render.js';
import {
  sortByRating,
  sortByComments,
  sortByDate,
  createProfileRating
} from '../utils/film.js';
import { SortType, UpdateType, UserAction, FilterType, Screens, StatsFilterType } from '../const.js';


const MOVIE_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;
const TOP_RATED_LIST_TITLE = 'Top rated';
const MOST_COMMENTED_LIST_TITLE = 'Most commented';

export default class MoviesList {
  constructor(main, moviesModel, filterModel) {
    this._mainElement = main;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;

    this._filmsContainer = new FilmsContainerView();
    this._filmsListContainer = new FilmsListContainerView();
    this._filmsListComponent = new FilmsListView();

    this._sortComponent = null;
    this._showMoreButtonComponent = null;
    this._noTaskComponent = null;
    this._topRatedListComponent = null;
    this._mostCommentedListComponent = null;
    this._topRatedfilmsListContainer = null;
    this._mostCommentedfilmsListContainer = null;

    this._moviePresenter = new Map();
    this._movieExtraRatePresenter = new Map();
    this._movieExtraCommentPresenter = new Map();
    this._filterType = FilterType.ALL;
    this._currentSortType = SortType.DEFAULT;
    this._currentScreen = Screens.MOVIES;
    this._currentStatsFilter = StatsFilterType.ALL;
    this._renderedMoviesCount = MOVIE_COUNT_PER_STEP;
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleStatsFilterTypeChange = this._handleStatsFilterTypeChange.bind(this);

  }

  init() {
    this._renderFilmsContainer();
    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }


  _getMovies() {
    this._filterType = this._filterModel.getFilter();
    const movies = this._moviesModel.getMovies();
    const filtredMovies = filter[this._filterType](movies);
    this._currentProfileRating = createProfileRating(filter[FilterType.HISTORY](movies).length);
    if (this._filterType === FilterType.STATS) {
      this._currentScreen = Screens.STATS;
      return filtredMovies;
    }
    this._currentScreen = Screens.MOVIES;
    switch (this._currentSortType) {
      case SortType.BY_RATING:
        return sortByRating(filtredMovies.slice());
      case SortType.BY_DATE:
        return sortByDate(filtredMovies.slice());
    }

    return filtredMovies;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmList({ resetRenderedMoviekCount: true });
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
    const movies = this._moviesModel.getMovies();
    const filtredMovies = filter[FilterType.HISTORY](movies);
    switch (updateType) {
      case UpdateType.PATCH:
        this._initFilmCardPresenter(this._moviePresenter, data);
        this._initFilmCardPresenter(this._movieExtraRatePresenter, data);
        this._initFilmCardPresenter(this._movieExtraCommentPresenter, data);
        this._renderTopRatedFilmList();
        this._renderMostCommentedFilmList();
        break;
      case UpdateType.MINOR:
        this._clearFilmList({ resetRenderedMoviekCount: true });
        this._renderFilmsContainer();
        break;
      case UpdateType.MAJOR:
        this._clearFilmList({ resetRenderedMoviekCount: true, resetSortType: true });
        switch (this._currentScreen) {
          case Screens.MOVIES: this._renderFilmsContainer();
            break;
          case Screens.STATS:
            this._currentStatsFilter = StatsFilterType.ALL;
            this._renderStats(filtredMovies);
            break;
        }
        break;
    }
  }

  _renderStats(movies) {
    this._statsComponent = new StatsVeiw(this._currentProfileRating, this._currentStatsFilter, movies);
    this._statsComponent.setFilterTypeChangeHandler(this._handleStatsFilterTypeChange);
    render(this._mainElement, this._statsComponent, RenderPosition.BEFOREEND);
  }

  _handleStatsFilterTypeChange(value) {
    const movies = this._moviesModel.getMovies();
    const filtredMovies = filter[FilterType.HISTORY](movies);
    this._currentStatsFilter = value;
    remove(this._statsComponent);
    this._renderStats(filtredMovies);
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
    const moviePresenter =
    new MoviePresenter(containerElement, this._handleViewAction, this._handleModeChange, this._filterType);
    movieList.set(movie.id, moviePresenter);
    moviePresenter.init(movie, movie.comments);
  }

  _renderFilmCards(container, movies, movieList) {
    movies
      .forEach((movie) => this._renderFilmCard(container, movie, movieList));
  }

  _renderFilmListEmpty() {
    remove(this._filmsListComponent);
    remove(this._topRatedListComponent);
    remove(this._mostCommentedListComponent);
    this._filmListEmptyComponent = new FilmsListEmptyView(this._filterType);
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
    if (this._topRatedListComponent !== null && this._topRatedfilmsListContainer !== null) {
      remove(this._topRatedListComponent);
      remove(this._topRatedfilmsListContainer);
      this._topRatedListComponent = null;
      this._topRatedfilmsListContainer = null;
    }
    this._topRatedfilmsListContainer = new FilmsListContainerView();
    this._topRatedListComponent = new FilmsListExtraView(TOP_RATED_LIST_TITLE);
    const movieCount = this._getMovies().length;
    if (!movieCount) {
      return;
    }
    const movies = sortByRating(this._getMovies().slice()).slice(0, Math.min(movieCount, EXTRA_FILMS_COUNT));
    if (movies[0].totalRating === 0) {
      return;
    }
    render(this._filmsContainer, this._topRatedListComponent, RenderPosition.BEFOREEND);
    this._renderFilmsListContainer(this._topRatedListComponent, this._topRatedfilmsListContainer);
    this._renderFilmCards(this._topRatedfilmsListContainer, movies, this._movieExtraRatePresenter);
  }

  _renderMostCommentedFilmList() {
    if (this._mostCommentedListComponent !== null && this._mostCommentedfilmsListContainer !== null ) {
      remove(this._mostCommentedListComponent);
      remove(this._mostCommentedfilmsListContainer);
      this._mostCommentedListComponent = null;
      this._mostCommentedfilmsListContainer = null;
    }
    this._mostCommentedfilmsListContainer = new FilmsListContainerView();
    this._mostCommentedListComponent = new FilmsListExtraView(MOST_COMMENTED_LIST_TITLE);
    const movieCount = this._getMovies().length;
    if (!movieCount) {
      return;
    }
    const movies = sortByComments(this._getMovies().slice()).slice(0, Math.min(movieCount, EXTRA_FILMS_COUNT));
    if (movies[0].comments.length === 0) {
      return;
    }
    render(this._filmsContainer, this._mostCommentedListComponent, RenderPosition.BEFOREEND);
    this._renderFilmsListContainer(this._mostCommentedListComponent, this._mostCommentedfilmsListContainer);

    this._renderFilmCards(this._mostCommentedfilmsListContainer, movies, this._movieExtraCommentPresenter);
  }

  _renderFilmList() {
    const movieCount = this._getMovies().length;
    const movies = this._getMovies().slice(0, Math.min(movieCount, MOVIE_COUNT_PER_STEP));
    if (!movies.length) {
      this._renderFilmListEmpty();
      return;
    }
    render(this._filmsContainer, this._filmsListComponent, RenderPosition.AFTERBEGIN);
    this._renderFilmsListContainer(this._filmsListComponent, this._filmsListContainer);

    this._renderFilmCards(this._filmsListContainer, movies, this._moviePresenter);

    if (movieCount > MOVIE_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _clearMapPresenter(mapPresenter) {
    mapPresenter.forEach((presenter) => presenter.destroy());
    mapPresenter.clear();
  }

  _clearFilmList({ resetRenderedMoviekCount = false, resetSortType = false } = {}) {
    const movieCount = this._getMovies().length;

    this._clearMapPresenter(this._moviePresenter);
    this._clearMapPresenter(this._movieExtraCommentPresenter);
    this._clearMapPresenter(this._movieExtraRatePresenter);


    if (this._statsComponent) {
      remove(this._statsComponent);
    }
    remove(this._sortComponent);
    if (this._filmListEmptyComponent) {
      remove(this._filmListEmptyComponent);
    }
    remove(this._showMoreButtonComponent);
    remove(this._filmsListComponent);
    remove(this._topRatedListComponent);
    remove(this._mostCommentedListComponent);

    if (resetRenderedMoviekCount) {
      this._renderedMoviesCount = MOVIE_COUNT_PER_STEP;
    } else {
      this._renderedMoviesCount = Math.min(movieCount, this._renderedMoviesCount);
    }

    if (resetSortType) {
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

