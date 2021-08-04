const MIN_MOVIES_COUNT_NOVICE_RATE = 1;
const MAX_MOVIES_COUNT_NOVICE_RATE = 10;
const MIN_MOVIES_COUNT_FAN_RATE = 11;
const MAX_MOVIES_COUNT_FAN_RATE = 20;
const MIN_MOVIES_COUNT_MOVIE_BUFF_RATE = 21;
const createProfileRating = (watchedMoviesCount) => {
  const empty = 0;
  const novice = watchedMoviesCount >=
    MIN_MOVIES_COUNT_NOVICE_RATE && watchedMoviesCount <= MAX_MOVIES_COUNT_NOVICE_RATE;
  const fan = watchedMoviesCount >= MIN_MOVIES_COUNT_FAN_RATE && watchedMoviesCount <= MAX_MOVIES_COUNT_FAN_RATE;
  const movieBuff = watchedMoviesCount >= MIN_MOVIES_COUNT_MOVIE_BUFF_RATE;

  if (empty) {
    return '';
  } else if (novice) {
    return 'Novice';
  } else if (fan) {
    return 'Fan';
  } else if (movieBuff) {
    return 'Movie Buff';
  }
};

export const createHeaderProfileTemplate = (watchedMovies) => (
  `<section class="header__profile profile">
  <p class="profile__rating">${createProfileRating(watchedMovies)}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`
);
