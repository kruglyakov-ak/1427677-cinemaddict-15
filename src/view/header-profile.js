const createProfileRating = (watchedMoviesCount) => {
  const empty = 0;
  const novice = watchedMoviesCount >= 1 && watchedMoviesCount <= 10;
  const fan = watchedMoviesCount >= 11 && watchedMoviesCount <= 20;
  const movieBuff = watchedMoviesCount >= 21;

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
