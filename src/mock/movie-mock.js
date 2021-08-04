const DESCRIPTION_SENTENCES_COUNT = 5;
const COMMENTS_COUNT = 5;
const MIN_RATING_COUNT = 2;
const MAX_RATING_COUNT = 10;
const MIN_RUNTIME = 45;
const MAX_RUNTIME = 180;
const GENRES_COUNT = 3;
const MAX_AGE_RATING = 18;
const ACTORS_COUNT = 3;
const DIRECTOR_COUNT = 1;
const MAX_ID_COUNR = 99;
const DESCRIPTIONS = [
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
const POSTERS = [
  {
    title: 'Made for Each Other',
    src: 'made-for-each-other.png',
  },
  {
    title: 'Popeye the Sailor Meets Sindbad the Sailor',
    src: 'popeye-meets-sinbad.png',
  },
  {
    title: 'Sagebrush Trail',
    src: 'sagebrush-trail.jpg',
  },
  {
    title: 'Santa Claus Conquers the Martians',
    src: 'santa-claus-conquers-the-martians.jpg',
  },
  {
    title: 'The Dance of Life',
    src: 'the-dance-of-life.jpg',
  },
  {
    title: 'The Great Flamarion',
    src: 'the-great-flamarion.jpg',
  },
  {
    title: 'The Man with the Golden Arm',
    src: 'the-man-with-the-golden-arm.jpg',
  },
];
const ACTORS = [
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
const COUNTRIES = [
  'Switzerland',
  'Denmark',
  'Netherlands',
  'Finland',
  'Australia',
  'Iceland',
  'Austria',
  'Germany',
  'New Zealand',
  'Norway',
  'Sweden',
  'Japan',
  'United States',
  'Spain',
  'Lithuania',
  'Portugal',
  'Canada',
  'United Kingdom',
  'France',
];
const GENERS = [
  'Action',
  'Adventure',
  'Animation',
  'Biography',
  'Comedy',
  'Crime',
  'Drama',
  'Family',
  'Fantasy',
  'Film-Noir',
  'History',
  'Horror',
  'Music',
  'Musical',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Sport',
  'Thriller',
  'War',
  'Western',
];
const MIN_YEARS_RELEASE = 1920;
const MAX_YEARS_RELEASE = 2021;
const MIN_MONTH_RELEASE = 1;
const MAX_MONTH_RELEASE = 12;
const MIN_DAY_RELEASE = 1;
const MAX_DAY_RELEASE = 30;
const MINUTE_IN_HOUR = 60;

const getRandomNumberInRange = (min = 0, max = 1, numberSymbolsAfterComma = 0) => {
  const lower = Math.min(Math.abs(min), Math.abs(max));
  const upper = Math.max(Math.abs(min), Math.abs(max));
  const randomNumber = Math.random() * (upper - lower) + lower;
  return +randomNumber.toFixed(numberSymbolsAfterComma);
};

const generatePoster = () => {
  const randomIndex = getRandomNumberInRange(0, POSTERS.length - 1);
  return POSTERS[randomIndex];
};

const generateDescription = () => {
  const randomSentencesCount = getRandomNumberInRange(1, DESCRIPTION_SENTENCES_COUNT);
  const description =
    new Array(randomSentencesCount)
      .fill()
      .map(() => DESCRIPTIONS[getRandomNumberInRange(0, DESCRIPTIONS.length - 1)])
      .join(' ');
  return description;
};

const generateComments = () => getRandomNumberInRange(0, COMMENTS_COUNT);

const generateRating = () => getRandomNumberInRange(MIN_RATING_COUNT, MAX_RATING_COUNT, 1);

const generateReleaseDate = () => {
  const years = getRandomNumberInRange(MIN_YEARS_RELEASE, MAX_YEARS_RELEASE);
  const month = getRandomNumberInRange(MIN_MONTH_RELEASE, MAX_MONTH_RELEASE);
  const day = getRandomNumberInRange(MIN_DAY_RELEASE, MAX_DAY_RELEASE);
  return new Date(years, month, day);
};

const generateRuntime = () => {
  let minute = getRandomNumberInRange(MIN_RUNTIME, MAX_RUNTIME);
  const hour = Math.floor(minute / MINUTE_IN_HOUR);
  let runtime = `${minute}m`;
  if (hour > 0) {
    minute = minute - (hour * MINUTE_IN_HOUR);
    runtime = `${hour}h ${minute}m`;
  }

  return runtime;
};

const generateGenre = () => new Array(GENRES_COUNT)
  .fill()
  .map(() => GENERS[getRandomNumberInRange(0, GENERS.length - 1)]);

const generateAgeRating = () => getRandomNumberInRange(0, MAX_AGE_RATING);

const generateActors = (count) => new Array(count)
  .fill()
  .map(() => ACTORS[getRandomNumberInRange(0, ACTORS.length - 1)])
  .join('');

const generateCountrie = () => COUNTRIES[getRandomNumberInRange(0, COUNTRIES.length - 1)];

export const generateMovie = () => {
  const poster = generatePoster();

  return {
    id: getRandomNumberInRange(1, MAX_ID_COUNR),
    commentsCount: generateComments(),
    title: poster.title,
    totalRating: generateRating(),
    poster: poster.src,
    ageRating: generateAgeRating(),
    director: generateActors(DIRECTOR_COUNT),
    writers: generateActors(ACTORS_COUNT),
    actors: generateActors(ACTORS_COUNT),
    releaseDate: generateReleaseDate(),
    releaseCountry: generateCountrie(),
    genres: generateGenre(),
    runtime: generateRuntime(),
    description: generateDescription(),
    isWatchlist: Boolean(getRandomNumberInRange(0, 1)),
    isAlreadyWatched: Boolean(getRandomNumberInRange(0, 1)),
    isFavorite: Boolean(getRandomNumberInRange(0, 1)),
  };
};
