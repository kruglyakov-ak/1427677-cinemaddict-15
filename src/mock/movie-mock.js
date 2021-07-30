import dayjs from 'dayjs';

const DESCRIPTION_SENTENCES_COUNT = 5;
const COMMENTS_COUNT = 5;
const MIN_RATING_COUNT = 2;
const MAX_RATING_COUNT = 10;
const MIN_RUNTIME = 45;
const MAX_RUNTIME = 180;

function getRandomNumberInRange(min = 0, max = 1, numberSymbolsAfterComma = 0) {
  const lower = Math.min(Math.abs(min), Math.abs(max));
  const upper = Math.max(Math.abs(min), Math.abs(max));
  const randomNumber = Math.random() * (upper - lower) + lower;
  return +randomNumber.toFixed(numberSymbolsAfterComma);
}

const posters = [
  {
    title: 'Made for Each Other',
    src: './markup/images/posters/made-for-each-other.png',
  },
  {
    title: 'Popeye the Sailor Meets Sindbad the Sailor',
    src: './markup/images/posters/popeye-meets-sinbad.png',
  },
  {
    title: 'Sagebrush Trail',
    src: './markup/images/posters/sagebrush-trail.png',
  },
  {
    title: 'Santa Claus Conquers the Martians',
    src: './markup/images/posters/santa-claus-conquers-the-martians.png',
  },
  {
    title: 'The Dance of Life',
    src: './markup/images/posters/the-dance-of-life.png',
  },
  {
    title: 'The Great Flamarion',
    src: './markup/images/posters/the-great-flamarion.png',
  },
  {
    title: 'The Man with the Golden Arm',
    src: './markup/images/posters/the-man-with-the-golden-arm.png',
  },
];

const generatePoster = () => {
  const randomIndex = getRandomNumberInRange(0, posters.length - 1);
  return posters[randomIndex];
};

const generateDescription = () => {
  const descriptions = [
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
  const randomSentencesCount = getRandomNumberInRange(1, DESCRIPTION_SENTENCES_COUNT);
  const description =
    Array(randomSentencesCount)
      .fill()
      .map(() => descriptions[getRandomNumberInRange(0, descriptions.length - 1)])
      .join(' ');
  return description;
};

const generateComments = () => getRandomNumberInRange(0, COMMENTS_COUNT);

const generateRating = () => getRandomNumberInRange(MIN_RATING_COUNT, MAX_RATING_COUNT, 1);

const generateReleaseData = () => {
  const years = getRandomNumberInRange(1920, 2021);
  const month = getRandomNumberInRange(1, 12);
  const day =  getRandomNumberInRange(1, 30);
  const date = new Date(years, month, day);
  return dayjs(date);
};

const generateRuntime = () => {
  let minute = getRandomNumberInRange(MIN_RUNTIME, MAX_RUNTIME);
  const hour = Math.floor(minute/60);
  let runtime = `${minute}m`;
  if (hour > 0) {
    minute = minute - (hour * 60);
    runtime = `${hour}h ${minute}m`;
  }

  return runtime;
};

export const generateMovie = () => {
  const poster = generatePoster();

  return {
    'id': '0',
    'comments': generateComments(),
    'film_info': {
      'title': poster.title,
      'total_rating': generateRating(),
      'poster': poster.src,
      'release': {
        'date': generateReleaseData(),
      },
      'runtime': generateRuntime(),
      'description': generateDescription(),
    },
    'user_details': {
      'watchlist': Boolean(getRandomNumberInRange(0, 1)),
      'already_watched': Boolean(getRandomNumberInRange(0, 1)),
      'favorite': Boolean(getRandomNumberInRange(0, 1)),
    },
  };
};
