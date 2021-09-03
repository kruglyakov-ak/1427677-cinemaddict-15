import dayjs from 'dayjs';

export const DurationFormat = {
  HOUR: 'hour',
  MINUTE: 'minute',
};

export const getTotalDuration = (movies, format) => {
  const totalDuration = movies.reduce((acc, movie) => acc += movie.runtime, 0);
  switch (format) {
    case DurationFormat.HOUR:
      return dayjs.duration(totalDuration, 'm').format('H');
    case DurationFormat.MINUTE:
      return dayjs.duration(totalDuration, 'm').format('m');
  }
};

export const getGenres = (movies) => {
  const genres = new Set();
  movies.forEach((movie) => movie.genres.forEach((gener) => genres.add(gener)));
  return genres;
};

export const сountGenres = (movies) => {
  const allMoviesGenres = [];
  movies.forEach((movie) => allMoviesGenres.push(...movie.genres));
  const genres = [];
  getGenres(movies).forEach((genre) => genres
    .push({genre: genre, count: allMoviesGenres.filter((allMoviesgenre) => allMoviesgenre === genre).length}));
  return genres;
};

export const getGenresCount = (movies) => {
  const count = [];
  сountGenres(movies).forEach((genre) => count.push(genre.count));
  return count;
};

export const getTopGenre = (movies) => {
  const topGenre = сountGenres(movies);
  topGenre.sort((prev, next) => next.count - prev.count);
  return topGenre[0].genre;
};
