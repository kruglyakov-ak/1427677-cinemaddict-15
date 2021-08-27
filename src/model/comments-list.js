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
}
