import dayjs from 'dayjs';

export const formatReleaseDate = (date, format) => dayjs(date).format(format);
export const getRandomNumberInRange = (min = 0, max = 1, numberSymbolsAfterComma = 0) => {
  const lower = Math.min(Math.abs(min), Math.abs(max));
  const upper = Math.max(Math.abs(min), Math.abs(max));
  const randomNumber = Math.random() * (upper - lower) + lower;
  return +randomNumber.toFixed(numberSymbolsAfterComma);
};
