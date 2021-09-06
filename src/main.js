import FooterStatisticsView from './view/footer-statistics.js';
import MoveisModel from './model/movies.js';
import FilterModel from './model/filter.js';
import MovieListPresenter from './presenter/movies-list.js';
import FilterPresenter from './presenter/filter.js';
import Api from './api.js';
import {
  render,
  RenderPosition,
  remove
} from './utils/render.js';
import { UpdateType } from './const.js';


const AUTHORIZATION = 'Basic V2h5LCBNci4gQW5kZXJzb24sIHdoeT8';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

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

const footerStatisticsView = new FooterStatisticsView(moviesModel.getMovies());

render(footerElement, footerStatisticsView, RenderPosition.BEFOREEND);

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(UpdateType.INIT, movies);
    remove(footerStatisticsView);
    render(footerElement, new FooterStatisticsView(moviesModel.getMovies()), RenderPosition.BEFOREEND);
  })
  .catch(() => {
    moviesModel.setMovies(UpdateType.INIT, []);
  });

