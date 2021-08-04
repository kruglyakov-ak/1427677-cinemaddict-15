import { formatReleaseDate } from '../utils.js';
const DATE_FORMAT = 'DD MMMM YYYY';
const createGenreItemTemplate = (genre) => `<span class="film-details__genre">${genre}</span>`;
const createGenresTemplate = (genres) => genres
  .map((genre) => createGenreItemTemplate(genre))
  .join('');
const setControlClassName = (isControl) => isControl ? 'film-details__control-button--active' : '';

const createCommentTemplate = (comment) => {
  const {
    emotion,
    text,
    author,
    date,
  } = comment;

  return `<li class="film-details__comment">
<span class="film-details__comment-emoji">
  <img src="./images/emoji/${emotion}.png" alt="emoji-${emotion}" width="55" height="55">
</span>
  <div>
    <p class="film-details__comment-text">${text}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${date}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
</li>`;
};


const createCommentsTemplate = (comments) => comments
  .map((comment) => createCommentTemplate(comment))
  .join('');

export const createFilmPoupTemplate = (movie, comments) => {
  const {
    commentsCount,
    title,
    totalRating,
    poster,
    ageRating,
    director,
    writers,
    actors,
    releaseDate,
    runtime,
    releaseCountry,
    description,
    genres,
    isWatchlist,
    isAlreadyWatched,
    isFavorite,
  } = movie;

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

            <p class="film-details__age">${ageRating}+</p>
        </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${title}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tbody><tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${formatReleaseDate(releaseDate, DATE_FORMAT)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${runtime}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">${(createGenresTemplate(genres))}</td>
                </tr>
              </tbody></table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist
           ${setControlClassName(isWatchlist)}" id="watchlist" name="watchlist">
                Add to watchlist
              </button>
          <button type="button" class="film-details__control-button film-details__control-button--watched
          ${setControlClassName(isAlreadyWatched)}" id="watched" name="watched">
               Already watched
              </button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite
          ${setControlClassName(isFavorite)}" id="favorite" name="favorite">
                Add to favorites
              </button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}
          </span></h3>

          <ul class="film-details__comments-list">
          ${createCommentsTemplate(comments)}
        </ul>

  <div class="film-details__new-comment">
    <div class="film-details__add-emoji-label"></div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input"
      placeholder="Select reaction below and write comment here" name="comment"></textarea>
    </label>

    <div class="film-details__emoji-list">
      <input class="film-details__emoji-item visually-hidden"
      name="comment-emoji" type="radio" id="emoji-smile" value="smile">
        <label class="film-details__emoji-label" for="emoji-smile">
          <img src="./images/emoji/smile.png" alt="emoji" width="30" height="30">
            </label>

    <input class="film-details__emoji-item visually-hidden"
    name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
      <label class="film-details__emoji-label" for="emoji-sleeping">
        <img src="./images/emoji/sleeping.png" alt="emoji" width="30" height="30">
            </label>

          <input class="film-details__emoji-item visually-hidden"
          name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" alt="emoji" width="30" height="30">
            </label>

        <input class="film-details__emoji-item visually-hidden"
        name="comment-emoji" type="radio" id="emoji-angry" value="angry">
          <label class="film-details__emoji-label" for="emoji-angry">
            <img src="./images/emoji/angry.png" alt="emoji" width="30" height="30">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};
