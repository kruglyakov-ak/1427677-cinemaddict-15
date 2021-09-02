import { ProfileRating } from '../const.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
const MINUTE_IN_HOUR = 60;
const MIN_MOVIES_COUNT = 10;
const MAX_MOVIES_COUNT = 20;
const TIME_COUNT = 1;

export const formatReleaseDate = (date, format) => dayjs(date).format(format);

export const cutDescription = (description, charactersCount) => {
  if (description.length > charactersCount) {
    return `${description.substring(0, charactersCount - 1)}...`;
  }
  return description;
};

export const sortByRating = (movies) => movies.sort((prev, next) => next.totalRating - prev.totalRating);
export const sortByComments = (movies) => movies.sort((prev, next) => next.commentsCount - prev.commentsCount);
export const sortByDate = (movies) => movies
  .sort((prev, next) => dayjs(next.releaseDate).diff(dayjs(prev.releaseDate)));

export const generateRuntime = (time) => {
  const hour = dayjs.duration(time, 'm').format('H');
  const minute = dayjs.duration(time, 'm').format('m');
  if (time < MINUTE_IN_HOUR) {
    return `${minute}m`;
  }
  return `${hour}h ${minute}m`;
};

export const createProfileRating = (watchedMoviesCount) => {
  const isNovice = watchedMoviesCount > 0 && watchedMoviesCount <= MIN_MOVIES_COUNT;
  const isFan = watchedMoviesCount > MIN_MOVIES_COUNT && watchedMoviesCount <= MAX_MOVIES_COUNT;
  const isMovieBuff = watchedMoviesCount > MAX_MOVIES_COUNT;

  if (isNovice) {
    return ProfileRating.NOVICE;
  } else if (isFan) {
    return ProfileRating.FAN;
  } else if (isMovieBuff) {
    return ProfileRating.MOVIE_BUFF;
  } else {
    return '';
  }
};

export const filterStatsByWatchingDate = (movies, period) => {
  const deadline = dayjs().subtract(TIME_COUNT, period);
  return movies.filter((movie) => dayjs(movie.watchingDate).diff(deadline, 'minute') > 0);
};
