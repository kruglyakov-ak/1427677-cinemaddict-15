import FooterStatisticsView from './view/footer-statistics.js';
import MoveisModel from './model/movies.js';
import FilterModel from './model/filter.js';
import MovieListPresenter from './presenter/movies-list.js';
import FilterPresenter from './presenter/filter.js';
import Api from './api.js';
import { generateMovie } from './mock/movie-mock.js';
import { generateCommentsList } from './mock/comments-mock.js';
import {
  render,
  RenderPosition
} from './utils/render.js';
import { getRandomNumberInRange } from './utils/common.js';

const AUTHORIZATION = 'Basic V2h5LCBNci4gQW5kZXJzb24sIHdoeT8';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

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
const api = new Api(END_POINT, AUTHORIZATION);

api.getMovies().then((newMovies) => {
  console.log(newMovies);
  // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
  // а ещё на сервере используется snake_case, а у нас camelCase.
  // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
  // Есть вариант получше - паттерн "Адаптер"
});

const moviesModel = new MoveisModel();
moviesModel.setMovies(movies);


const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const filterModel = new FilterModel();

const moviePresenter = new MovieListPresenter(mainElement, moviesModel, filterModel);
const filterPresenter = new FilterPresenter(headerElement, mainElement, filterModel, moviesModel);

filterPresenter.init();
moviePresenter.init();

render(footerElement, new FooterStatisticsView(movies), RenderPosition.BEFOREEND);
