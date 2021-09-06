import AbstractObserver from '../utils/abstract-observer.js';

export default class CommentsList extends AbstractObserver {
  constructor() {
    super();
    this._commentsList = [];
  }

  setCommentsList(commentsList) {
    if (commentsList === null) {
      this._commentsList = commentsList;
    }
    this._commentsList = commentsList.slice();
  }

  getCommentsList() {
    return this._commentsList;
  }

  addComment(update) {
    this._commentsList = [
      ...this._commentsList,
      update,
    ];
  }
}
