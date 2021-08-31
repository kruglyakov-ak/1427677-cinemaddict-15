import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
const MINUTE_IN_HOUR = 60;

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
