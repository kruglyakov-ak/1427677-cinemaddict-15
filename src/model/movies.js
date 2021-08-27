import AbstractObserver from '../utils/abstract-observer.js';

export default class Moveis extends AbstractObserver {
  constructor() {
    super();
    this._movies = [];
  }

  setMovies(movies) {
    this._movies = movies.slice();
  }

  getMovies() {
    return this._movies;
  }
}
