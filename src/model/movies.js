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

  updateMovie(updateType, update) {
    const index = this._movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  deleteMovie(updateType, update) {
    const index = this._movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this._movies = [
      ...this._movies.slice(0, index),
      ...this._movies.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(movie) {
    const adaptedMovie = Object.assign(
      {},
      movie,
      {
        commentsCount: movie.comments.length,
        title: movie['film_info']['title'],
        altTitle: movie['film_info']['alternative_title'],
        totalRating: movie['film_info']['total_rating'],
        poster: movie['film_info']['poster'],
        ageRating: movie['film_info']['age_rating'],
        director: movie['film_info']['director'],
        writers: movie['film_info']['writers'],
        actors: movie['film_info']['actors'],
        releaseDate: movie['film_info']['release']['date'],
        releaseCountry: movie['film_info']['release']['release_country'],
        genres: movie['film_info']['genre'],
        runtime: movie['film_info']['runtime'],
        description: movie['film_info']['description'],
        isWatchlist: movie['user_details']['watchlist'],
        isAlreadyWatched: movie['user_details']['already_watched'],
        watchingDate: movie['user_details']['watching_date'],
        isFavorite: movie['user_details']['favorite'],
      },
    );

    // Ненужные ключи мы удаляем
    delete movie['film_info']['title'];
    delete movie['film_info']['alternative_title'];
    delete movie['film_info']['total_rating'];
    delete movie['film_info']['poster'];
    delete movie['film_info']['age_rating'];
    delete movie['film_info']['director'];
    delete movie['film_info']['writers'];
    delete movie['film_info']['actors'];
    delete movie['film_info']['release']['date'];
    delete movie['film_info']['release']['release_country'];
    delete movie['film_info']['release'];
    delete movie['film_info']['genre'];
    delete movie['film_info']['runtime'];
    delete movie['film_info']['description'];
    delete movie['user_details']['watchlist'];
    delete movie['user_details']['already_watched'];
    delete movie['user_details']['watching_date'];
    delete movie['user_details']['favorite'];

    return adaptedMovie;
  }

  static adaptToServer(movie) {
    const adaptedMovie = Object.assign(
      {},
      movie,
      {
        'film_info': {
          'title': movie.title,
          'alternative_title': movie.altTitle,
          'total_rating': movie.totalRating,
          'poster': movie.poster,
          'age_rating': movie.ageRating,
          'director': movie.director,
          'writers': movie.writers,
          'actors': movie.actors,
          'release': {
            'date': movie.releaseDate,
            'release_country': movie.releaseCountry,
          },
          'genre': movie.genres,
          'runtime': movie.runtime,
          'description': movie.description,
        },
        'user_details': {
          'watchlist': movie.isWatchlist,
          'already_watched': movie.isAlreadyWatched,
          'watching_date': movie.watchingDate,
          'favorite': movie.isFavorite,
        },
      },
    );

    delete movie.title;
    delete movie.altTitle;
    delete movie.totalRating;
    delete movie.poster;
    delete movie.ageRating;
    delete movie.director;
    delete movie.writers;
    delete movie.actors;
    delete movie.releaseDate;
    delete movie.releaseCountry;
    delete movie.genres;
    delete movie.runtime;
    delete movie.description;
    delete movie.isWatchlist;
    delete movie.isAlreadyWatched;
    delete movie.watchingDate;
    delete movie.isFavorite;

    return adaptedMovie;
  }
}


