import HeaderProfileView from './view/header-profile.js';
import MainNavigationView from './view/main-navigation.js';
import SortView from './view/sort.js';
import FilmsContainerView from './view/films-container.js';
import FilmsListView from './view/films-list.js';
import FilmCardView from './view/film-card.js';
import FilmsListExtraView from './view/films-list-extra.js';
import ShowMoreButtonView from './view/show-more-button.js';
import FooterStatisticsView from './view/footer-statistics.js';
import FilmPoupView from './view/film-popup.js';
import FilmsListEmptyView from './view/films-list-empty.js';
import { generateMovie } from './mock/movie-mock.js';
import { generateComments } from './mock/comments-mock.js';
import { render, RenderPosition } from './utils.js';

const MOVIE_COUNT = 22;
const MOVIE_COUNT_PER_STEP = 5;
const MAIN_FILMS_COUNT = 5;
const EXTRA_FILMS_COUNT = 2;

const movies = new Array(MOVIE_COUNT).fill().map(generateMovie);
const comments = movies.map((movie) => generateComments(movie));
const moviesByRating = movies.slice().sort((prev, next) => next.totalRating - prev.totalRating);
const moviesByComments = movies.slice().sort((prev, next) => next.commentsCount - prev.commentsCount);

const bodyElement = document.querySelector('body');
const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

render(headerElement, new HeaderProfileView(
  new MainNavigationView(movies).getWatchedMovies()).getElement(), RenderPosition.BEFOREEND);
render(mainElement, new MainNavigationView(movies).getElement(), RenderPosition.BEFOREEND);
if (movies.length) {
  render(mainElement, new SortView().getElement(), RenderPosition.BEFOREEND);
}
render(mainElement, new FilmsContainerView().getElement(), RenderPosition.BEFOREEND);

const filmsContainerElement = mainElement.querySelector('.films');

if (!movies.length) {
  render(filmsContainerElement, new FilmsListEmptyView().getElement(), RenderPosition.BEFOREEND);
} else {
  render(filmsContainerElement, new FilmsListView().getElement(), RenderPosition.BEFOREEND);

  const mainFilmsListElement = filmsContainerElement.querySelector('.films-list');
  const mainFilmsListContainerElement = mainFilmsListElement.querySelector('.films-list__container');

  const closePopup = () => {
    const popupElement = document.querySelector('.film-details');
    if (popupElement) {
      bodyElement.removeChild(popupElement);
    }
    bodyElement.classList.remove('hide-overflow');
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  const openPopup = (popup) => {
    closePopup();
    render(bodyElement, popup.getElement(), RenderPosition.BEFOREEND);
    bodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', onEscKeyDown);
  };

  const renderFilmCard = (containerElement, movie, commentsList) => {
    const filmCard = new FilmCardView(movie);
    const filmPopup = new FilmPoupView(movie, commentsList);

    filmCard.setPosterClickHandler(() => {
      openPopup(filmPopup);
    });

    filmCard.setTitleClickHandler(() => {
      openPopup(filmPopup);
    });

    filmCard.setCommentsClickHandler(() => {
      openPopup(filmPopup);
    });

    filmPopup.setCloseBtnClickHandler(() => {
      closePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(containerElement, filmCard.getElement(), RenderPosition.BEFOREEND);
  };

  for (let i = 0; i < MAIN_FILMS_COUNT && i < MOVIE_COUNT; i++) {
    renderFilmCard(mainFilmsListContainerElement, movies[i], comments[i]);
  }

  if (movies.length > MOVIE_COUNT_PER_STEP) {
    let renderedMoviesCount = MOVIE_COUNT_PER_STEP;
    render(mainFilmsListElement, new ShowMoreButtonView().getElement(), RenderPosition.BEFOREEND);

    const showMoreButton = mainFilmsListElement.querySelector('.films-list__show-more');

    showMoreButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      movies
        .slice(renderedMoviesCount, renderedMoviesCount + MOVIE_COUNT_PER_STEP)
        .forEach((movie, i) => renderFilmCard(mainFilmsListContainerElement,
          movie, comments[i + MOVIE_COUNT_PER_STEP]));

      renderedMoviesCount += MOVIE_COUNT_PER_STEP;

      if (renderedMoviesCount >= movies.length) {
        showMoreButton.remove();
      }
    });
  }

  render(
    filmsContainerElement,
    new FilmsListExtraView('Top rated').getElement(),
    RenderPosition.BEFOREEND);

  const topRatedFilmsListElement = filmsContainerElement.querySelector('.films-list:nth-child(2');
  const topRatedFilmsListContainerElement = topRatedFilmsListElement.querySelector('.films-list__container');

  for (let i = 0; i < EXTRA_FILMS_COUNT && i < MOVIE_COUNT; i++) {
    renderFilmCard(topRatedFilmsListContainerElement, moviesByRating[i], comments[i]);
  }
  render(
    filmsContainerElement,
    new FilmsListExtraView('Most commented').getElement(),
    RenderPosition.BEFOREEND);

  const mostCommentedFilmsListElement = filmsContainerElement.querySelector('.films-list:nth-child(3)');
  const mostCommentedFilmsListContainerElement = mostCommentedFilmsListElement.querySelector('.films-list__container');

  for (let i = 0; i < EXTRA_FILMS_COUNT && i < MOVIE_COUNT; i++) {
    renderFilmCard(mostCommentedFilmsListContainerElement, moviesByComments[i], comments[i]);
  }
}

render(footerElement, new FooterStatisticsView(movies).getElement(), RenderPosition.BEFOREEND);
