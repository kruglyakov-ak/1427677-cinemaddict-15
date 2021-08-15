import HeaderProfileView from './view/header-profile.js';
import MainNavigationView from './view/main-navigation.js';
import FooterStatisticsView from './view/footer-statistics.js';
import MoviePresenter from './presenter/movie.js';
import { generateMovie } from './mock/movie-mock.js';
import { generateComments } from './mock/comments-mock.js';
import {
  render,
  RenderPosition
} from './utils/render.js';

const MOVIE_COUNT = 12;

const movies = new Array(MOVIE_COUNT).fill().map(generateMovie);
const comments = movies.map((movie) => generateComments(movie));

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

render(headerElement, new HeaderProfileView(
  new MainNavigationView(movies).getWatchedMovies()), RenderPosition.BEFOREEND);
render(mainElement, new MainNavigationView(movies), RenderPosition.BEFOREEND);

const moviePresenter = new MoviePresenter(mainElement);
moviePresenter.init(movies, comments);

render(footerElement, new FooterStatisticsView(movies), RenderPosition.BEFOREEND);
