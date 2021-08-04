const MIN_MOVIES_COUNT = 10;
const MAX_MOVIES_COUNT = 20;

const createProfileRating = (watchedMoviesCount) => {
  const novice = watchedMoviesCount > 0 && watchedMoviesCount <= MIN_MOVIES_COUNT;
  const fan = watchedMoviesCount > MIN_MOVIES_COUNT && watchedMoviesCount <= MAX_MOVIES_COUNT;
  const movieBuff = watchedMoviesCount > MAX_MOVIES_COUNT;

  if (novice) {
    return 'Novice';
  } else if (fan) {
    return 'Fan';
  } else if (movieBuff) {
    return 'Movie Buff';
  } else {
    return '';
  }
};

export const createHeaderProfileTemplate = (watchedMovies) => (
  `<section class="header__profile profile">
  <p class="profile__rating">${createProfileRating(watchedMovies)}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`
);
