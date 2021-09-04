import FooterStatisticsView from './view/footer-statistics.js';
import MoveisModel from './model/movies.js';
import FilterModel from './model/filter.js';
import MovieListPresenter from './presenter/movies-list.js';
import FilterPresenter from './presenter/filter.js';
import Api from './api.js';
import {
  render,
  RenderPosition
} from './utils/render.js';

const AUTHORIZATION = 'Basic V2h5LCBNci4gQW5kZXJzb24sIHdoeT8';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

const api = new Api(END_POINT, AUTHORIZATION);

const moviesModel = new MoveisModel();

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const filterModel = new FilterModel();

const moviePresenter = new MovieListPresenter(mainElement, moviesModel, filterModel, api);
const filterPresenter = new FilterPresenter(headerElement, mainElement, filterModel, moviesModel);

filterPresenter.init();
moviePresenter.init();

render(footerElement, new FooterStatisticsView(moviesModel.getMovies()), RenderPosition.BEFOREEND);

api.getMovies().then((movies) => {
  moviesModel.setMovies(movies);
});

