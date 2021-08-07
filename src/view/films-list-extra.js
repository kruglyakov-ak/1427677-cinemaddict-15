import {createElement} from '../utils.js';

const createFilmsListExtraTemplate = (extraTitle) => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">${extraTitle}</h2>
    <div class="films-list__container"></div>
  </section>`
);

export default class FilmsListExtra {
  constructor(extraTitle) {
    this._element = null;
    this._extraTitle = extraTitle;
  }

  getTemplate() {
    return createFilmsListExtraTemplate(this._extraTitle);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
