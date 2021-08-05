import { formatReleaseDate } from '../utils.js';
const DATE_FORMAT = 'YYYY';
export const createFilmCardTemplate = (movie) => {
  const {
    commentsCount,
    title,
    totalRating,
    poster,
    releaseDate,
    runtime,
    description,
    genres,
    isWatchlist,
    isAlreadyWatched,
    isFavorite,
  } = movie;

  const setControlClassName = (isControl) => isControl ? 'film-card__controls-item--active' : '';
  const cutDescription = () => {
    if (description.length > 140) {
      return `${description.substring(0, 139)}...`;
    }

    return description;
  };
  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${formatReleaseDate(releaseDate, DATE_FORMAT)}</span>
      <span class="film-card__duration">${runtime}</span>
      <span class="film-card__genre">${genres[0]}</span>
    </p>
    <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${cutDescription()}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist
        ${setControlClassName(isWatchlist)}" type="button">
          Add to watchlist
        </button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched
        ${setControlClassName(isAlreadyWatched)}" type="button">
          Mark as watched
        </button>
        <button class="film-card__controls-item film-card__controls-item--favorite
         ${setControlClassName(isFavorite)}" type="button">
          Mark as favorite
        </button>
      </div>
  </article>`;
};
