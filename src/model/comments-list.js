import AbstractObserver from '../utils/abstract-observer.js';

export default class CommentsList extends AbstractObserver {
  constructor() {
    super();
    this._commentsList = [];
  }

  setCommentsList(commentsList) {
    this._commentsList = commentsList.slice();
  }

  getCommentsList() {
    return this._commentsList;
  }

  updateComments(updateType, update) {
    const index = this._commentsList.findIndex((comments) => comments.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this._commentsList = [
      ...this._commentsList.slice(0, index),
      update,
      ...this._commentsList.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addComments(updateType, update) {
    this._commentsList = [
      update,
      ...this._commentsList,
    ];

    this._notify(updateType, update);
  }

  deleteComments(updateType, update) {
    const index = this._commentsList.findIndex((comments) => comments.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting movie');
    }

    this._commentsList = [
      ...this._commentsList.slice(0, index),
      ...this._commentsList.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
