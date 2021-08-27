import { formatReleaseDate, generateRuntime } from '../utils/film.js';
import SmartView from './smart.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const DATE_FORMAT = 'DD MMMM YYYY';
const ACTIVE_POPUP_CLASS_NAME = 'film-details__control-button--active';
const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];
const createGenreItemTemplate = (genre) => `<span class="film-details__genre">${genre}</span>`;
const createGenresTemplate = (genres) => genres
  .map((genre) => createGenreItemTemplate(genre))
  .join('');

const createCommentTitleCount = (commentsCount, isCommentsCount) => isCommentsCount ? `
<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}
</span></h3>` : '';

const createInputEmojiTamplate = (emotion, checkedEmotion) => `<input class="film-details__emoji-item visually-hidden"
name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}"
${checkedEmotion === emotion ? 'checked' : ''}>
  <label class="film-details__emoji-label" for="emoji-${emotion}">
    <img src="./images/emoji/${emotion}.png" alt="emoji" width="30" height="30">
      </label>`;

const createEmojiListTemplate = (emotions, checkedEmotion) => emotions
  .map((emotion) => createInputEmojiTamplate(emotion, checkedEmotion))
  .join('');

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
      <span class="film-details__comment-day">${dayjs(date).fromNow()}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
</li>`;
};

const createCommentsTemplate = (comments) => comments
  .map((comment) => createCommentTemplate(comment))
  .join('');

const createFilmPoupTemplate = (data, comments) => {
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
    isCommentsCount,
    textComment,
    checkedEmotion,
  } = data;

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
                  <td class="film-details__cell">${generateRuntime(runtime)}</td>
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
           ${isWatchlist ? ACTIVE_POPUP_CLASS_NAME : ''}" id="watchlist" name="watchlist">
                Add to watchlist
              </button>
          <button type="button" class="film-details__control-button film-details__control-button--watched
          ${isAlreadyWatched ? ACTIVE_POPUP_CLASS_NAME : ''}" id="watched" name="watched">
               Already watched
              </button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite
          ${isFavorite ? ACTIVE_POPUP_CLASS_NAME : ''}" id="favorite" name="favorite">
                Add to favorites
              </button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          ${createCommentTitleCount(commentsCount, isCommentsCount)}

          <ul class="film-details__comments-list">
          ${createCommentsTemplate(comments)}
        </ul>

  <div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">
    ${checkedEmotion ? `<img src="./images/emoji/${checkedEmotion}.png"
    alt="emoji-${checkedEmotion}" width="55" height="55">` : ''}
    </div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input"
      placeholder="Select reaction below and write comment here"
      name="comment">${textComment ? textComment : ''}</textarea>
    </label>

    <div class="film-details__emoji-list">
    ${createEmojiListTemplate(EMOTIONS, checkedEmotion)}
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class FilmPoup extends SmartView {
  constructor(movie, comments) {
    super();
    this._data = FilmPoup.parseMovieToData(movie);
    this._comments = comments;
    this._clickCloseBtnHandler = this._clickCloseBtnHandler.bind(this);
    this._clickAddToWatchlistHandler = this._clickAddToWatchlistHandler.bind(this);
    this._clickMarkAsWatchedlistHandler = this._clickMarkAsWatchedlistHandler.bind(this);
    this._clickFavoriteHandler = this._clickFavoriteHandler.bind(this);
    this._addToWatchlistToggleHandler = this._addToWatchlistToggleHandler.bind(this);
    this._markAsWatchedlistToggleHandler = this._markAsWatchedlistToggleHandler.bind(this);
    this._favoriteToggleHandler = this._favoriteToggleHandler.bind(this);
    this._textTextareaHandler = this._textTextareaHandler.bind(this);
    this._emotionInputHandler = this._emotionInputHandler.bind(this);
    this._scrollPopupHandler = this._scrollPopupHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmPoupTemplate(this._data, this._comments);
  }

  _clickCloseBtnHandler(evt) {
    evt.preventDefault();
    this._callback.closeBtnClick();
  }

  _clickAddToWatchlistHandler(evt) {
    evt.preventDefault();
    this._callback.addToWatchlistClick();
  }

  _clickMarkAsWatchedlistHandler(evt) {
    evt.preventDefault();
    this._callback.markAsWatchedlistClick();
  }

  _clickFavoriteHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _addToWatchlistToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isWatchlist: !this._data.isWatchlist,
    });
    this.getElement().scrollTo(0, this._data.scrollPosition);
  }

  _markAsWatchedlistToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isAlreadyWatched: !this._data.isAlreadyWatched,
    });
    this.getElement().scrollTo(0, this._data.scrollPosition);
  }

  _favoriteToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isFavorite: !this._data.isFavorite,
    });
    this.getElement().scrollTo(0, this._data.scrollPosition);
  }

  _textTextareaHandler(evt) {
    evt.preventDefault();
    this.updateData({
      textComment: evt.target.value,
    }, true);
  }

  _emotionInputHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    this.updateData({
      checkedEmotion: evt.target.value,
    });
    this.getElement().scrollTo(0, this._data.scrollPosition);
  }

  _scrollPopupHandler(evt) {
    this.updateData({
      scrollPosition: evt.target.scrollTop,
    }, true);
  }

  setCloseBtnClickHandler(callback) {
    this._callback.closeBtnClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._clickCloseBtnHandler);
  }

  setAddToWatchlistClickHandler(callback) {
    this._callback.addToWatchlistClick = callback;
    this.getElement()
      .querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this._clickAddToWatchlistHandler);
  }

  setMarkAsWatchedlistClickHandler(callback) {
    this._callback.markAsWatchedlistClick = callback;
    this.getElement()
      .querySelector('.film-details__control-button--watched')
      .addEventListener('click', this._clickMarkAsWatchedlistHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement()
      .querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this._clickFavoriteHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setPresenterHandlers();
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this._addToWatchlistToggleHandler);
    this.getElement()
      .querySelector('.film-details__control-button--watched')
      .addEventListener('click', this._markAsWatchedlistToggleHandler);
    this.getElement()
      .querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this._favoriteToggleHandler);
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._textTextareaHandler);
    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('click', this._emotionInputHandler);
    this.getElement()
      .addEventListener('scroll', this._scrollPopupHandler);
  }

  _setPresenterHandlers() {
    this.setCloseBtnClickHandler(this._callback.closeBtnClick);
    this.setAddToWatchlistClickHandler(this._callback.addToWatchlistClick);
    this.setMarkAsWatchedlistClickHandler(this._callback.markAsWatchedlistClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  }

  static parseMovieToData(movie) {
    return Object.assign(
      {},
      movie,
      {
        isCommentsCount: movie.commentsCount !== 0,
        scrollPosition: 0,
      },
    );
  }
}
