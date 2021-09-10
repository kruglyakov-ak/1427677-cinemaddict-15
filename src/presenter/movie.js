import FilmCardView from '../view/film-card.js';
import FilmPoupView from '../view/film-popup.js';
import CommentsListModel from '../model/comments-list.js';
import {isOnline} from '../utils/common.js';
import {
  render,
  RenderPosition,
  remove,
  replace
} from '../utils/render.js';
import {UserAction, UpdateType, FilterType} from '../const.js';

const Mode = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
};

export default class Movie {
  constructor(filmListContainer, changeData, changeMode, filterType, api) {
    this._filmListContainer = filmListContainer;
    this._bodyElement = document.querySelector('body');
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._filterType = filterType;
    this._api = api;

    this._filmCard = null;
    this._popup = null;
    this._handleAddToWatchlistClick = this._handleAddToWatchlistClick.bind(this);
    this._handleMarkAsWatchedlistClick = this._handleMarkAsWatchedlistClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._handleCommentDeleteClick = this._handleCommentDeleteClick.bind(this);
    this._handleCommentSubmit = this._handleCommentSubmit.bind(this);
    this._mode = Mode.CLOSE;
    this._commentsListModel = new CommentsListModel();
  }

  init(movie) {
    this._movie = movie;
    this._api.getСomments(this._movie).then((comments) => {
      if (this._movie.comments) {
        this._commentsListModel.setCommentsList(comments);
      }
    });

    const prevFilmCard = this._filmCard;

    this._filmCard = new FilmCardView(movie);
    this._filmCard
      .setFilmCardInfoClickHandler(() => this._renderPopup(movie, this._commentsListModel.getCommentsList()));
    this._filmCard.setAddToWatchlistClickHandler(this._handleAddToWatchlistClick);
    this._filmCard.setMarkAsWatchedlistClickHandler(this._handleMarkAsWatchedlistClick);
    this._filmCard.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevFilmCard === null) {
      render(this._filmListContainer, this._filmCard, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmListContainer.getElement().contains(prevFilmCard.getElement())) {
      replace(this._filmCard, prevFilmCard);
    }

    remove(prevFilmCard);
  }

  resetView() {
    if (this._mode !== Mode.CLOSE) {
      this._closePopup();
    }
  }

  destroy() {
    remove(this._filmCard);
  }

  _renderPopup(movie) {
    if (this._popup) {
      this._closePopup();
    }

    if (this._popup !== null) {
      this._scrollPosition = this._popup.getScrollPosition();
      this._popup = null;
    }
    this._popup = new FilmPoupView(movie, this._commentsListModel.getCommentsList());
    this._openPopup();
    this._popup.getElement().scrollTo(0, this._scrollPosition);
    this._bodyElement.classList.add('hide-overflow');

    this._popup.setCloseBtnClickHandler(this._closePopup);
    this._popup.setAddToWatchlistClickHandler(this._handleAddToWatchlistClick);
    this._popup.setMarkAsWatchedlistClickHandler(this._handleMarkAsWatchedlistClick);
    this._popup.setFavoriteClickHandler(this._handleFavoriteClick);
    this._popup.setDeleteCommentClickHandler(this._handleCommentDeleteClick);
    this._popup.setSubmitCommentHandler(this._handleCommentSubmit);
  }

  _closePopup() {
    remove(this._popup);
    document.removeEventListener('keydown', this._onEscKeyDown);
    this._bodyElement.classList.remove('hide-overflow');
    this._mode = Mode.CLOSE;
    this._popup;
    this._popup = null;
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _openPopup() {
    render(this._bodyElement, this._popup, RenderPosition.BEFOREEND);
    document.addEventListener('keydown', this._onEscKeyDown);
    this._changeMode();
    this._mode = Mode.OPEN;
  }

  errorShake () {
    if (this._popup) {
      this._popup.shake();
    } else {
      this._filmCard.shake();
    }
  }

  updatePopup () {
    if (this._popup) {
      this._renderPopup(this._movie, this._commentsListModel.getCommentsList());
      this._popup.getElement().scrollTo(0, this._scrollPosition);
    }
  }

  updateCommentList() {
    this._api.getСomments(this._movie).then((comments) => {
      this._commentsListModel.setCommentsList(comments);
      this._renderPopup(this._movie, this._commentsListModel.getCommentsList());
      this._popup.getElement().scrollTo(0, this._scrollPosition);
    });
  }

  _handleAddToWatchlistClick() {
    if (this._popup) {
      this._scrollPosition = this._popup.getScrollPosition();
    }
    const isCurrentFilterType = this._filterType === this._filterType === FilterType.ALL ||
    this._filterType !== FilterType.WHATCHLIST;
    if (!isCurrentFilterType && this._popup) {
      this._closePopup();
    }
    this._changeData(
      UserAction.UPDATE_FILM_CARD,
      isCurrentFilterType ? UpdateType.PATCH : UpdateType.MINOR,
      Object.assign(
        {},
        this._movie,
        {
          isWatchlist: !this._movie.isWatchlist,
        },
      ),
    );
  }

  _handleMarkAsWatchedlistClick() {
    if (this._popup) {
      this._scrollPosition = this._popup.getScrollPosition();
    }
    const isCurrentFilterType = this._filterType === FilterType.ALL || this._filterType !== FilterType.HISTORY;
    const isAlreadyWatched = this._movie.isAlreadyWatched;
    if (!isCurrentFilterType && this._popup) {
      this._closePopup();
    }
    this._changeData(
      UserAction.UPDATE_FILM_CARD,
      isCurrentFilterType ? UpdateType.PATCH : UpdateType.MINOR,
      Object.assign(
        {},
        this._movie,
        {
          isAlreadyWatched: !this._movie.isAlreadyWatched,
          watchingDate: isAlreadyWatched ? null : new Date(),
        },
      ),
    );
  }

  _handleFavoriteClick() {
    if (this._popup) {
      this._scrollPosition = this._popup.getScrollPosition();
    }
    const isCurrentFilterType = this._filterType === FilterType.ALL || this._filterType !== FilterType.FAVORITES;
    if (!isCurrentFilterType && this._popup) {
      this._closePopup();
    }
    this._changeData(
      UserAction.UPDATE_FILM_CARD,
      isCurrentFilterType ? UpdateType.PATCH : UpdateType.MINOR,
      Object.assign(
        {},
        this._movie,
        {
          isFavorite: !this._movie.isFavorite,
        },
      ),
    );
  }

  _handleCommentDeleteClick(id, currentButton, buttons) {
    if (!isOnline()) {
      this._popup.shake();
      return;
    }
    if (this._popup) {
      this._scrollPosition = this._popup.getScrollPosition();
    }

    currentButton.textContent = 'Deleting...';
    buttons.forEach((button) => button.disabled = true);
    this._api.deleteComment(id).then(() => {
      this._changeData(
        UserAction.UPDATE_FILM_POPUP,
        UpdateType.PATCH,
        this._movie,
      );
    }).catch(() => {
      this._popup.shake();
      currentButton.textContent = 'Delete';
      buttons.forEach((button) => button.disabled = false);
    });
  }

  _handleCommentSubmit(data, textArea, emojiInputs) {
    if (!isOnline()) {
      this._popup.shake();
      return;
    }
    if (this._popup) {
      this._scrollPosition = this._popup.getScrollPosition();
    }

    const newComment = {
      emotion: data.checkedEmotion,
      comment: data.textComment,
    };

    textArea.setAttribute('disabled', 'disabled');
    emojiInputs.forEach((input) => input.disabled = true);
    this._api.addComment(this._movie, newComment).then((response) => {
      this._commentsListModel.addComment(response.comments);
    })
      .then(() => {
        this._changeData(
          UserAction.UPDATE_FILM_POPUP,
          UpdateType.PATCH,
          this._movie,
        );
      })
      .catch(() => {
        textArea.removeAttribute('disabled');
        emojiInputs.forEach((input) => input.disabled = false);
        this._popup.shake();
      });
  }
}


