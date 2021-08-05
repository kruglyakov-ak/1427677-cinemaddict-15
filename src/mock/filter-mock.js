const movieToFilterMap = {
  Watchlist: (movies) => movies.filter((movie) => movie.isWatchlist).length,
  History: (movies) =>  movies.filter((movie) => movie.isAlreadyWatched).length,
  Favorites: (movies) =>  movies.filter((movie) => movie.isFavorite).length,
};

export const generateFilter = (movies) => Object.entries(movieToFilterMap).map(
  ([filterName, countMovies]) => ({
    name: filterName,
    count: countMovies(movies),
  }),
);
