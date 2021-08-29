import HeaderProfileView from './view/header-profile.js';
import MainNavigationView from './view/main-navigation.js';
import FooterStatisticsView from './view/footer-statistics.js';
import MoveisModel from './model/movies.js';
import MovieListPresenter from './presenter/movies-list.js';
import { generateMovie } from './mock/movie-mock.js';
import { generateCommentsList } from './mock/comments-mock.js';
import {
  render,
  RenderPosition
} from './utils/render.js';
import { getRandomNumberInRange } from './utils/common.js';

const MOVIE_COUNT = 12;
const COMMENTS_COUNT = 5;
let commentsCountFrom = 0;
const commentsList = generateCommentsList();
const getComments = () => {
  const commentCountTo = commentsCountFrom + getRandomNumberInRange(0, COMMENTS_COUNT);
  const comments = commentsList.slice(commentsCountFrom ,commentCountTo);
  commentsCountFrom = commentCountTo;
  return comments;
};
const movies = new Array(MOVIE_COUNT).fill().map(() => generateMovie(getComments()));

const moviesModel = new MoveisModel();
moviesModel.setMovies(movies);


const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

render(headerElement, new HeaderProfileView(
  new MainNavigationView(movies).getWatchedMovies()), RenderPosition.BEFOREEND);
render(mainElement, new MainNavigationView(movies), RenderPosition.BEFOREEND);

const moviePresenter = new MovieListPresenter(mainElement, moviesModel);
moviePresenter.init();

render(footerElement, new FooterStatisticsView(movies), RenderPosition.BEFOREEND);
