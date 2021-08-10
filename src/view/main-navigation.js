import {createElement} from '../utils.js';

const movieToFilterMap = {
  Watchlist: (movies) => movies.filter((movie) => movie.isWatchlist).length,
  History: (movies) =>  movies.filter((movie) => movie.isAlreadyWatched).length,
  Favorites: (movies) =>  movies.filter((movie) => movie.isFavorite).length,
};

const generateFilterItems = (movies) => Object.entries(movieToFilterMap).map(
  ([filterName, countMovies]) => ({
    name: filterName,
    count: countMovies(movies),
  }),
);

const createMainNavigationItemTemplate = (filter) => {
  const { name, count } = filter;

  return (
    `<a href="#${name.toLowerCase()}" class="main-navigation__item">
    ${name}<span class="main-navigation__item-count">${count}</span></a>`
  );
};

const createMainNavigationTemplate = (movies) => {
  const filterItemsTemplate = generateFilterItems(movies)
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
  constructor(movies) {
    this._element = null;
    this._movies = movies;
  }

  getTemplate() {
    return createMainNavigationTemplate(this._movies);
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

  getWatchedMovies() {
    return generateFilterItems(this._movies).find((filter) => filter.name === 'History').count;
  }
}
