import {FilterType} from '../const.js';

export const filter = {
  [FilterType.ALL]: (movies) => movies,
  [FilterType.WHATCHLIST]: (movies) => movies.filter((movie) => movie.isWatchlist),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.isAlreadyWatched),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.isFavorite),
  [FilterType.STATS]: (movies) => movies,
};
