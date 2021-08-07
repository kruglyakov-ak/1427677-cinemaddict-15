import {createElement} from '../utils.js';

const createMainNavigationItemTemplate = (filter) => {
  const { name, count } = filter;

  return (
    `<a href="#${name.toLowerCase()}" class="main-navigation__item">
    ${name}<span class="main-navigation__item-count">${count}</span></a>`
  );
};

const createMainNavigationTemplate = (filterItems) => {

  const filterItemsTemplate = filterItems
    .map((filter) => createMainNavigationItemTemplate(filter))
    .join('');

  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    ${filterItemsTemplate}
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`;
};

export default class MainNavigation {
  constructor(filterItems) {
    this._element = null;
    this._filterItems = filterItems;
  }

  getTemplate() {
    return createMainNavigationTemplate(this._filterItems);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}