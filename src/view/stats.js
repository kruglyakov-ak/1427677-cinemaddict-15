import AbstractView from './abstract.js';
import { StatsFilterType } from '../const.js';
import {
  DurationFormat,
  getTotalDuration,
  getTopGenre,
  getGenres,
  getGenresCount
} from '../utils/stats.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


const BAR_HEIGHT = 50;

const renderGenresChart = (statisticCtx, movies) => new Chart(statisticCtx, {
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels: Array.from(getGenres(movies)),
    datasets: [{
      data: getGenresCount(movies),
      backgroundColor: '#ffe800',
      hoverBackgroundColor: '#ffe800',
      anchor: 'start',
      barThickness: 30,
    }],
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 20,
        },
        color: '#ffffff',
        anchor: 'start',
        align: 'start',
        offset: 40,
      },
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#ffffff',
          padding: 100,
          fontSize: 20,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  },
});

const createStatsTemplate = (rating, currentFilter, movies) => (`<section class="statistic">
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
      <p class="statistic__item-text">${getTotalDuration(movies, DurationFormat.HOUR) > 1 ? `${
    getTotalDuration(movies, DurationFormat.HOUR)} <span class="statistic__item-description">h</span>` : ''}
       ${getTotalDuration(movies, DurationFormat.MINUTE)} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${movies.length ? getTopGenre(movies) : ''}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000" height="${BAR_HEIGHT * getGenres(movies).size}"></canvas>
  </div>

</section>
`);

export default class Stats extends AbstractView {
  constructor (rating, currentFilter, movies) {
    super();
    this._rating = rating;
    this._currentFilter = currentFilter;
    this._movies = movies;

    this._statisticCart = null;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);

    this._setChart();
  }

  removeElement() {
    super.removeElement();

    if (this._statisticCart !== null) {
      this._statisticCart = null;
    }
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

  restoreHandlers() {
    this._setChart();
  }

  _setChart() {
    if (this._statisticCart !== null) {
      this._statisticCart = null;
    }

    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    this._statisticCart = renderGenresChart(statisticCtx, this._movies);
  }
}
