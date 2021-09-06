import FilmCardView from '../view/film-card.js';
import FilmPoupView from '../view/film-popup.js';
import CommentsListModel from '../model/comments-list.js';
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
    }).catch(() => {
      this._commentsListModel.setCommentsList(null);
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

    this._popup = new FilmPoupView(movie, this._commentsListModel.getCommentsList());
    this._openPopup();
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

  _handleAddToWatchlistClick() {
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

  _handleCommentDeleteClick(id, data, button) {
    button.innerHTML = 'Deleting...';
    button.disabled = true;
    this._api.deleteComment(id).then(() => {
      this._changeData(
        UserAction.UPDATE_FILM_POPUP,
        UpdateType.PATCH,
        this._movie,
        () => {
          this._api.getСomments(this._movie).then((comments) => {
            this._commentsListModel.setCommentsList(comments);
            this._renderPopup(this._movie, this._commentsListModel.getCommentsList());
            this._popup.getElement().scrollTo(0, data.scrollPosition);
          });
        },
      );
    }).catch(() => {
      button.innerHTML = 'Delete';
      button.disabled = false;
    });
  }

  _handleCommentSubmit(data) {
    const newComment = {
      emotion: data.checkedEmotion,
      comment: data.textComment,
    };

    if (!data.checkedEmotion || !data.textComment) {
      return;
    }
    this._api.addComment(this._movie, newComment).then((response) => {
      this._commentsListModel.addComment(response.comments);
    })
      .then(() => {
        this._changeData(
          UserAction.UPDATE_FILM_POPUP,
          UpdateType.PATCH,
          this._movie,
          () => {
            this._api.getСomments(this._movie).then((comments) => {
              this._commentsListModel.setCommentsList(comments);
              this._renderPopup(this._movie, this._commentsListModel.getCommentsList());
              this._popup.getElement().scrollTo(0, data.scrollPosition);
            });
          },
        );
      });

  }
}


