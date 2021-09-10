import MoveisModel from '../model/movies.js';
import {isOnline} from '../utils/common.js';

const getSyncedMovies = (items) => items
  .filter(({success}) => success)
  .map(({payload}) => payload.movie);

const createStoreStructure = (items) =>
  items
    .reduce((acc, current) => Object.assign({}, acc, {
      [current.id]: current,
    }), {});


export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getMovies() {
    if (isOnline()) {
      return this._api.getMovies()
        .then((movies) => {
          const items = createStoreStructure(movies.map(MoveisModel.adaptToServer));
          this._store.setItems(items);
          return movies;
        });
    }

    const storeMovies = Object.values(this._store.getItems());

    return Promise.resolve(storeMovies.map(MoveisModel.adaptToClient));
  }

  updateMovie(movie) {
    if (isOnline()) {
      return this._api.updateMovie(movie)
        .then((updatedMovie) => {
          this._store.setItem(updatedMovie.id, MoveisModel.adaptToServer(updatedMovie));
          return updatedMovie;
        });
    }

    this._store.setItem(movie.id, MoveisModel.adaptToServer(Object.assign({}, movie)));

    return Promise.resolve(movie);
  }

  getСomments(movie) {
    if (isOnline()) {
      return this._api.getСomments(movie)
        .then((comments) => {
          const items = createStoreStructure(comments);
          this._store.setItem(items);
          return comments;
        });
    }

    return Promise.reject(new Error('Get comment failed'));
  }

  addComment(movie, comment) {
    if (isOnline()) {
      return this._api.addComment(movie, comment)
        .then((newComment) => {
          this._store.setItem(newComment.id, newComment);
          return newComment;
        });
    }

    return Promise.reject(new Error('Add comment failed'));
  }

  deleteComment(id) {
    if (isOnline()) {
      return this._api.deleteComment(id)
        .then(() => this._store.removeItem(id));
    }

    return Promise.reject(new Error('Delete comment failed'));
  }

  sync() {
    if (isOnline()) {
      const storeMovies = Object.values(this._store.getItems());

      return this._api.sync(storeMovies)
        .then((response) => {
          const updatedMovies = getSyncedMovies(response.updated);

          const items = createStoreStructure([...updatedMovies]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
