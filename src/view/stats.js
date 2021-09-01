import AbstractView from './abstract.js';
import { StatsFilterType } from '../const.js';

const createStatsTemplate = (rating, currentFilter) => (
  `<section class="statistic">
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
      <p class="statistic__item-text">22 <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">130 <span class="statistic__item-description">h</span>
       22 <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">Sci-Fi</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>
`
);

export default class Stats extends AbstractView {
  constructor (rating, currentFilter) {
    super();
    this._rating = rating;
    this._currentFilter = currentFilter;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createStatsTemplate(this._rating, this._currentFilter);
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
