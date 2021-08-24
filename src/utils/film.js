import dayjs from 'dayjs';

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
