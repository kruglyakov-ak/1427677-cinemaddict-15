import HeaderProfileView from './view/header-profile.js';
import { createMainNavigationTemplate } from './view/main-navigation.js';
import { createSortTemplate } from './view/sort.js';
import { createFilmsContainerTemplate } from './view/films-container.js';
import { createFilmsListTemplate } from './view/films-list.js';
import { createFilmCardTemplate } from './view/film-card.js';
import { createFilmsListExtraTemplate } from './view/films-list-extra.js';
import { createShowMoreButtonTemplate } from './view/show-more-button.js';
import { createFooterStatisticsTemplate } from './view/footer-statistics.js';
import { createFilmPoupTemplate } from './view/film-popup.js';
import { generateMovie } from './mock/movie-mock.js';
import { generateFilter } from './mock/filter-mock.js';
import { generateComments } from './mock/comments-mock.js';
import { renderTemplate, renderElement, RenderPosition } from './utils.js';

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
renderTemplate(siteMainElement, createMainNavigationTemplate(filters), 'beforeend');
renderTemplate(siteMainElement, createSortTemplate(), 'beforeend');
renderTemplate(siteMainElement, createFilmsContainerTemplate(), 'beforeend');

const filmsContainerElement = siteMainElement.querySelector('.films');

renderTemplate(filmsContainerElement, createFilmsListTemplate(), 'beforeend');

const mainFilmsListElement = filmsContainerElement.querySelector('.films-list');
const mainFilmsListContainerElement = mainFilmsListElement.querySelector('.films-list__container');

for (let i = 0; i < MAIN_FILMS_COUNT && i < MOVIE_COUNT; i++) {
  renderTemplate(mainFilmsListContainerElement, createFilmCardTemplate(movies[i]), 'beforeend');
}

if (movies.length > MOVIE_COUNT_PER_STEP) {
  let renderedMoviesCount = MOVIE_COUNT_PER_STEP;
  renderTemplate(mainFilmsListElement, createShowMoreButtonTemplate(), 'beforeend');

  const showMoreButton = mainFilmsListElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    movies
      .slice(renderedMoviesCount, renderedMoviesCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => renderTemplate(mainFilmsListContainerElement, createFilmCardTemplate(movie), 'beforeend'));

    renderedMoviesCount += MOVIE_COUNT_PER_STEP;

    if (renderedMoviesCount >= movies.length) {
      showMoreButton.remove();
    }
  });
}
if (movies.length) {
  renderTemplate(filmsContainerElement, createFilmsListExtraTemplate('Top rated'), 'beforeend');

  const topRatedFilmsListElement = filmsContainerElement.querySelector('.films-list:nth-child(2');
  const topRatedFilmsListContainerElement = topRatedFilmsListElement.querySelector('.films-list__container');

  for (let i = 0; i < EXTRA_FILMS_COUNT && i < MOVIE_COUNT; i++) {
    renderTemplate(topRatedFilmsListContainerElement, createFilmCardTemplate(moviesByRating[i]), 'beforeend');
  }

  renderTemplate(filmsContainerElement, createFilmsListExtraTemplate('Most commented'), 'beforeend');

  const mostCommentedFilmsListElement = filmsContainerElement.querySelector('.films-list:nth-child(3)');
  const mostCommentedFilmsListContainerElement = mostCommentedFilmsListElement.querySelector('.films-list__container');

  for (let i = 0; i < EXTRA_FILMS_COUNT && i < MOVIE_COUNT; i++) {
    renderTemplate(mostCommentedFilmsListContainerElement, createFilmCardTemplate(moviesByComments[i]), 'beforeend');
  }
}
const siteFooterElement = document.querySelector('.footer');
renderTemplate(siteFooterElement, createFooterStatisticsTemplate(movies), 'beforeend');
renderTemplate(siteFooterElement, createFilmPoupTemplate(movies[0], comments[0]), 'afterend');
