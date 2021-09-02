import AbstractView from './abstract.js';
import { StatsFilterType } from '../const.js';
import { getTotalDuration } from '../utils/film.js';
import dayjs from 'dayjs';


const createStatsTemplate = (rating, currentFilter, movies) => {
  const totalDuration = getTotalDuration(movies);
  const hour = dayjs.duration(totalDuration, 'm').format('H');
  const minute = dayjs.duration(totalDuration, 'm').format('m');
  const genres = new Set();
  movies.forEach((movie) => movie.genres.forEach((gener) => genres.add(gener)));

  const getGenresCount = () => {
    const allMoviesGenres = [];
    movies.forEach((movie) => allMoviesGenres.push(...movie.genres));
    const genresCount = [];
    genres.forEach((genre) => genresCount
      .push({genre: genre, count: allMoviesGenres.filter((allMoviesgenre) => allMoviesgenre === genre).length}));
    return genresCount;
  };

  const getTopGenre = () => {
    const topGenre = getGenresCount();
    topGenre.sort((prev, next) => next.count - prev.count);
    return topGenre[0].genre;
  };

  return `<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${rating}</span>
  </p>

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="statistic__filters-input visually-hidden"
    name="statistic-filter" id="statistic-all-time" value="${StatsFilterType.ALL}"
    ${currentFilter === StatsFilterType.ALL ? 'checked' : ''}>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" class="statistic__filters-input visually-hidden"
    name="statistic-filter" id="statistic-today" value="${StatsFilterType.TODAY}"
    ${currentFilter === StatsFilterType.TODAY ? 'checked' : ''}>
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" class="statistic__filters-input visually-hidden"
    name="statistic-filter" id="statistic-week" value="${StatsFilterType.WEEK}"
    ${currentFilter === StatsFilterType.WEEK ? 'checked' : ''}>
    <label for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" class="statistic__filters-input visually-hidden"
    name="statistic-filter" id="statistic-month" value="${StatsFilterType.MONTH}"
    ${currentFilter === StatsFilterType.MONTH ? 'checked' : ''}>
    <label for="statistic-month" class="statistic__filters-label">Month</label>

    <input type="radio" class="statistic__filters-input visually-hidden"
    name="statistic-filter" id="statistic-year" value="${StatsFilterType.YEAR}"
    ${currentFilter === StatsFilterType.YEAR ? 'checked' : ''}>
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${movies.length}<span class="statistic__item-description">
      ${movies.length > 1 ? 'movies' : 'movie'}</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${hour > 1 ? `${hour} <span class="statistic__item-description">h</span>` : ''}
       ${minute} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${movies.length ? getTopGenre() : ''}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>
`;
};

export default class Stats extends AbstractView {
  constructor (rating, currentFilter, movies) {
    super();
    this._rating = rating;
    this._currentFilter = currentFilter;
    this._movies = movies;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createStatsTemplate(this._rating, this._currentFilter, this._movies);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().querySelector('.statistic__filters').addEventListener('click', this._filterTypeChangeHandler);
  }
}
