import {createHeaderProfileTemplate} from './view/header-profile.js';
import {createMainNavigationTemplate} from './view/main-navigation.js';
import {createSortTemplate} from './view/sort.js';
import {createFilmsContainerTemplate} from './view/films-container.js';
import {createFilmsListTemplate} from './view/films-list.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createFilmsListExtraTemplate} from './view/films-list-extra.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createFooterStatisticsTemplate} from './view/footer-statistics.js';
// import {createFilmPoupTemplate} from './view/film-popup.js';
import {generateMovie} from './mock/movie-mock.js';
import {generateFilter} from './mock/filter-mock.js';

const MOVIE_COUNT = 30;
const MAIN_FILMS_COUNT = 5;
const EXTRA_FILMS_COUNT = 2;

const movies = new Array(MOVIE_COUNT).fill().map(generateMovie);
const filters = generateFilter(movies);
const moviesByRating = movies.slice().sort((prev, next) => next.totalRating - prev.totalRating);
const moviesByComments = movies.slice().sort((prev, next) => next.comments - prev.comments);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

render(siteHeaderElement, createHeaderProfileTemplate(), 'beforeend');
render(siteMainElement, createMainNavigationTemplate(filters), 'beforeend');
render(siteMainElement, createSortTemplate(), 'beforeend');
render(siteMainElement, createFilmsContainerTemplate(), 'beforeend');

const filmsContainerElement = siteMainElement.querySelector('.films');

render(filmsContainerElement, createFilmsListTemplate(), 'beforeend');

const mainFilmsListElement = filmsContainerElement.querySelector('.films-list');
const mainFilmsListContainerElement = mainFilmsListElement.querySelector('.films-list__container');

for (let i = 0; i < MAIN_FILMS_COUNT; i++) {
  render(mainFilmsListContainerElement, createFilmCardTemplate(movies[i]), 'beforeend');
}

render(mainFilmsListElement, createShowMoreButtonTemplate(), 'beforeend');

render(filmsContainerElement, createFilmsListExtraTemplate('Top rated'), 'beforeend');

const topRatedFilmsListElement = filmsContainerElement.querySelector('.films-list:nth-child(2');
const topRatedFilmsListContainerElement = topRatedFilmsListElement.querySelector('.films-list__container');

for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
  render(topRatedFilmsListContainerElement, createFilmCardTemplate(moviesByRating[i]), 'beforeend');
}

render(filmsContainerElement, createFilmsListExtraTemplate('Most commented'), 'beforeend');

const mostCommentedFilmsListElement = filmsContainerElement.querySelector('.films-list:nth-child(3)');
const mostCommentedFilmsListContainerElement = mostCommentedFilmsListElement.querySelector('.films-list__container');

for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
  render(mostCommentedFilmsListContainerElement, createFilmCardTemplate(moviesByComments[i]), 'beforeend');
}

const siteFooterElement = document.querySelector('.footer');

render(siteFooterElement, createFooterStatisticsTemplate(), 'beforeend');
// render(siteFooterElement, createFilmPoupTemplate(), 'beforeend');
