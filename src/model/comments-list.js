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

  addComments(updateType, update) {
    this._commentsList = [
      ...this._commentsList,
      update,
    ];

    this._notify(updateType, update);
  }

  deleteComments(updateType, updateId) {
    const index = this._commentsList.findIndex((comments) => comments.id === updateId);

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
