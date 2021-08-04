import dayjs from 'dayjs';
const DESCRIPTION_SENTENCES_COUNT = 2;

const emotions = ['smile', 'sleeping', 'puke', 'angry'];
const commentAuthors = [
  'Anthony Mann',
  'Anne Wigton',
  'Heinz Herald',
  'Erich von Stroheim',
  'Mary Beth Hughes',
  'Dan Duryea',
  'John Cromwell',
  'Carole Lombard',
  'James Stewart',
  'David O. Selznick',
  'Rose Franken',
  'John Cromwell',
];
const commentTexts = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const getRandomNumberInRange = (min = 0, max = 1, numberSymbolsAfterComma = 0) => {
  const lower = Math.min(Math.abs(min), Math.abs(max));
  const upper = Math.max(Math.abs(min), Math.abs(max));
  const randomNumber = Math.random() * (upper - lower) + lower;
  return +randomNumber.toFixed(numberSymbolsAfterComma);
};

const generateCommentText = () => {
  const randomSentencesCount = getRandomNumberInRange(1, DESCRIPTION_SENTENCES_COUNT);
  const description =
    new Array(randomSentencesCount)
      .fill()
      .map(() => commentTexts[getRandomNumberInRange(0, commentTexts.length - 1)])
      .join(' ');
  return description;
};

const generateEmotions = () => emotions[getRandomNumberInRange(0, emotions.length - 1)];
const generateCommentAuthor = () => commentAuthors[getRandomNumberInRange(0, commentAuthors.length - 1)];
const generateDate = () => dayjs().format('YYYY/MM/DD HH:mm');

const generateComment = (movie) => {
  const {commentsCount} = movie;
  return {
    id: movie.id,
    author: generateCommentAuthor(),
    text: generateCommentText(),
    date: generateDate(commentsCount),
    emotion: generateEmotions(),
  };
};
export const generateComments = (movie) => new Array(movie.commentsCount).fill().map(() => generateComment(movie));
