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
import { generateMovie } from './mock/movie-mock.js';
import { generateFilter } from './mock/filter-mock.js';
import { generateComments } from './mock/comments-mock.js';
import { renderElement, RenderPosition } from './utils.js';

const MOVIE_COUNT = 48;
const MOVIE_COUNT_PER_STEP = 5;
const MAIN_FILMS_COUNT = 5;
const EXTRA_FILMS_COUNT = 2;

const movies = new Array(MOVIE_COUNT).fill().map(generateMovie);
const filters = generateFilter(movies);
const comments = movies.map((movie) => generateComments(movie));
const moviesByRating = movies.slice().sort((prev, next) => next.totalRating - prev.totalRating);
const moviesByComments = movies.slice().sort((prev, next) => next.commentsCount - prev.commentsCount);

const getWatchedMovies = () => filters.find((filter) => filter.name === 'History').count;

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

renderElement(siteHeaderElement, new HeaderProfileView(getWatchedMovies()).getElement(), RenderPosition.BEFOREEND);
renderElement(siteMainElement, new MainNavigationView(filters).getElement(), RenderPosition.BEFOREEND);
renderElement(siteMainElement, new SortView().getElement(), RenderPosition.BEFOREEND);
renderElement(siteMainElement, new FilmsContainerView().getElement(), RenderPosition.BEFOREEND);

const filmsContainerElement = siteMainElement.querySelector('.films');

renderElement(filmsContainerElement, new FilmsListView().getElement(), RenderPosition.BEFOREEND);

const mainFilmsListElement = filmsContainerElement.querySelector('.films-list');
const mainFilmsListContainerElement = mainFilmsListElement.querySelector('.films-list__container');

for (let i = 0; i < MAIN_FILMS_COUNT && i < MOVIE_COUNT; i++) {
  renderElement(mainFilmsListContainerElement, new FilmCardView(movies[i]).getElement(), RenderPosition.BEFOREEND);
}

if (movies.length > MOVIE_COUNT_PER_STEP) {
  let renderedMoviesCount = MOVIE_COUNT_PER_STEP;
  renderElement(mainFilmsListElement, new ShowMoreButtonView().getElement(), RenderPosition.BEFOREEND);

  const showMoreButton = mainFilmsListElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    movies
      .slice(renderedMoviesCount, renderedMoviesCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => renderElement(
        mainFilmsListContainerElement,
        new FilmCardView(movie).getElement(),
        RenderPosition.BEFOREEND));

    renderedMoviesCount += MOVIE_COUNT_PER_STEP;

    if (renderedMoviesCount >= movies.length) {
      showMoreButton.remove();
    }
  });
}
if (movies.length) {
  renderElement(
    filmsContainerElement,
    new FilmsListExtraView('Top rated').getElement(),
    RenderPosition.BEFOREEND);

  const topRatedFilmsListElement = filmsContainerElement.querySelector('.films-list:nth-child(2');
  const topRatedFilmsListContainerElement = topRatedFilmsListElement.querySelector('.films-list__container');

  for (let i = 0; i < EXTRA_FILMS_COUNT && i < MOVIE_COUNT; i++) {
    renderElement(
      topRatedFilmsListContainerElement,
      new FilmCardView(moviesByRating[i]).getElement(),
      RenderPosition.BEFOREEND);
  }
  renderElement(
    filmsContainerElement,
    new FilmsListExtraView('Most commented').getElement(),
    RenderPosition.BEFOREEND);

  const mostCommentedFilmsListElement = filmsContainerElement.querySelector('.films-list:nth-child(3)');
  const mostCommentedFilmsListContainerElement = mostCommentedFilmsListElement.querySelector('.films-list__container');

  for (let i = 0; i < EXTRA_FILMS_COUNT && i < MOVIE_COUNT; i++) {
    renderElement(
      mostCommentedFilmsListContainerElement,
      new FilmCardView(moviesByComments[i]).getElement(),
      RenderPosition.BEFOREEND);
  }
}
const siteFooterElement = document.querySelector('.footer');

renderElement(siteFooterElement, new FooterStatisticsView(movies).getElement(), RenderPosition.BEFOREEND);
renderElement(siteFooterElement, new FilmPoupView(movies[0], comments[0]).getElement(), RenderPosition.BEFOREEND);
