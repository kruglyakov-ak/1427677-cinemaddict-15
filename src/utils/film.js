import dayjs from 'dayjs';
const ACTIVE_CLASS_NAME = 'film-card__controls-item--active';

export const formatReleaseDate = (date, format) => dayjs(date).format(format);

export const cutDescription = (description, charactersCount) => {
  if (description.length > charactersCount) {
    return `${description.substring(0, charactersCount - 1)}...`;
  }
  return description;
};

export const addActiveBtnClass = (isControl) => isControl ? ACTIVE_CLASS_NAME : '';