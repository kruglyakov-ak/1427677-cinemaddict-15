import AbstractView from './abstract.js';

const createMainNavigationItemTemplate = (filter, currentFilterType) => {
  const { type, name, count } = filter;

  if (type === 'all movies') {
    return `<a href="#${name.toLowerCase()}"
    class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
    data-name-filter = "${name.toLowerCase()}">
    ${name}</a>`;
  }
  return `<a href="#${name.toLowerCase()}"
    class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
    data-name-filter = "${name.toLowerCase()}">
    ${name}<span class="main-navigation__item-count">${count}</span></a>`;
};

const createMainNavigationTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createMainNavigationItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    ${filterItemsTemplate}
  </div>
  <a href="#stats" class="main-navigation__additional
  ${'stats' === currentFilterType ? 'main-navigation__item--active' : ''}" data-name-filter = "stats">Stats</a>
</nav>`;
};

export default class MainNavigation extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._statsClickHandler = this._statsClickHandler.bind(this);
  }

  getTemplate() {
    return createMainNavigationTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.nameFilter);
  }

  _statsClickHandler(evt) {
    evt.preventDefault();
    this._callback.statsClick();
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }

  setStatsClickHandler(callback) {
    this._callback.statsClick = callback;
    this.getElement().querySelector('.main-navigation__additional').addEventListener('click', this._statsClickHandler);
  }
}
