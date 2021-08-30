import AbstractView from './abstract.js';

const createMainNavigationItemTemplate = (filter, currentFilterType) => {
  const { type, name, count } = filter;

  return (
    `<a href="#${name.toLowerCase()}"
    class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">
    ${name}<span class="main-navigation__item-count">${count}</span></a>`
  );
};

const createMainNavigationTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createMainNavigationItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    ${filterItemsTemplate}
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`;
};

export default class MainNavigation extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createMainNavigationTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}
