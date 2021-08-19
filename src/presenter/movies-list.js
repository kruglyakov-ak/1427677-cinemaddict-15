import SortView from '../view/sort.js';
import FilmsListView from '../view/films-list.js';
import FilmsListExtraView from '../view/films-list-extra.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmsListEmptyView from '../view/films-list-empty.js';
import FilmsContainerView from '../view/films-container.js';
import MoviePresenter from './movie.js';
import {
  render,
  RenderPosition
} from '../utils/render.js';

const MOVIE_COUNT_PER_STEP = 5;
const TOP_RATED_LIST_TITLE = 'Top rated';
const MOST_COMMENTED_LIST_TITLE = 'Most commented';

export default class MoviesList {
  constructor(main) {
    this._mainElement = main;
    this._filmsContainer = new FilmsContainerView();
    this._sortComponent = new SortView();
    this._filmsListComponent = new FilmsListView();
    this._filmListEmptyComponent = new FilmsListEmptyView();
    this._topRatedListComponent = new FilmsListExtraView(TOP_RATED_LIST_TITLE);
    this._mostCommentedListComponent = new FilmsListExtraView(MOST_COMMENTED_LIST_TITLE);
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._renderedMoviesCount = MOVIE_COUNT_PER_STEP;
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(movies, commentsList) {
    this._movies = movies.slice();
    this._commentsList = commentsList.slice();
    this._renderSort();
    this._renderFilmContainer();

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
    }
  }

  _renderFilmCard(containerElement, movie) {
    const moviePresenter = new MoviePresenter(containerElement);
    moviePresenter.init(movie, this._getComments(movie.id));
  }

  _renderFilmCards(from, to, container, movies) {
    movies
      .slice(from, to)
      .forEach((movie) => this._renderFilmCard(container, movie));
  }

  _renderFilmListEmpty() {
    render(this._filmsContainer, this._filmListEmptyComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    this._renderFilmCards(
      this._renderedMoviesCount,
      this._renderedMoviesCount + MOVIE_COUNT_PER_STEP,
      this._filmsContainer.getElement().querySelector('.films-list__container'),
      this._movies);

    this._renderedMoviesCount += MOVIE_COUNT_PER_STEP;
    if (this._renderedMoviesCount >= this._movies.length) {
      this._showMoreButtonComponent.getElement().remove();
    }
  }

  _renderShowMoreButton() {
    this._mainFilmsListElement = this._filmsContainer.getElement().querySelector('.films-list');
    render(this._mainFilmsListElement, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderFilmList() {
    render(this._filmsContainer, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderFilmCards(
      0,
      Math.min(this._movies.length, MOVIE_COUNT_PER_STEP),
      this._filmsContainer.getElement().querySelector('.films-list__container'),
      this._movies);

    if (this._movies.length > MOVIE_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderFilmContainer() {
    render(this._mainElement, this._filmsContainer, RenderPosition.BEFOREEND);

    if (!this._movies.length) {
      this._renderFilmListEmpty();
      return;
    }

    this._renderFilmList();
  }
}
