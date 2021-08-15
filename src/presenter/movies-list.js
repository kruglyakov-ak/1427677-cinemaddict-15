import SortView from '../view/sort.js';
import FilmsListView from '../view/films-list.js';
import FilmCardView from '../view/film-card.js';
import FilmsListExtraView from '../view/films-list-extra.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmPoupView from '../view/film-popup.js';
import FilmsListEmptyView from '../view/films-list-empty.js';
import FilmsContainerView from '../view/films-container.js';
import {
  render,
  RenderPosition,
  closePopup,
  openPopup,
  onEscKeyDown
} from '../utils/render.js';

const MOVIE_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;
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

  _renderFilmContainer() {
    render(this._mainElement, this._filmsContainer, RenderPosition.BEFOREEND);

    if (!this._movies.length) {
      this._renderFilmListEmpty();
      return;
    }

    this._renderFilmList();
    this._renderTopRatedFilmList();
    this._renderMostCommentedFilmList();
  }

  _renderFilmCard(containerElement, movie) {
    const filmCard = new FilmCardView(movie);
    const filmPopup = new FilmPoupView(movie, this._getComments(movie.id));

    filmCard.setPosterClickHandler(() => openPopup(filmPopup));

    filmCard.setTitleClickHandler(() => openPopup(filmPopup));

    filmCard.setCommentsClickHandler(() => openPopup(filmPopup));

    filmPopup.setCloseBtnClickHandler(() => {
      closePopup(filmPopup);
      document.removeEventListener('keydown', (evt) => onEscKeyDown(evt, filmPopup));
    });

    render(containerElement, filmCard, RenderPosition.BEFOREEND);
  }

  _renderFilmCards(from, to, container, movies, comments) {
    movies.slice(from, to).forEach((movie) => this._renderFilmCard(container, movie, comments));
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

  _renderTopRatedFilmList() {
    const moviesByRating = this._movies.slice().sort((prev, next) => next.totalRating - prev.totalRating);
    render(this._filmsContainer, this._topRatedListComponent, RenderPosition.BEFOREEND);
    this._renderFilmCards(0, EXTRA_FILMS_COUNT, this._filmsContainer.getElement()
      .querySelector('.films-list:nth-child(2')
      .querySelector('.films-list__container'), moviesByRating);
  }

  _renderMostCommentedFilmList() {
    const moviesByComments = this._movies.slice().sort((prev, next) => next.commentsCount - prev.commentsCount);
    render(this._filmsContainer, this._mostCommentedListComponent, RenderPosition.BEFOREEND);
    this._renderFilmCards(0, EXTRA_FILMS_COUNT, this._filmsContainer.getElement()
      .querySelector('.films-list:nth-child(3)')
      .querySelector('.films-list__container'), moviesByComments);
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
}
