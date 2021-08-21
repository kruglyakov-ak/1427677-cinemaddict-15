import AbstractView from './abstract.js';

const createFilmsListExtraTemplate = (extraTitle) => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">${extraTitle}</h2>
  </section>`
);

export default class FilmsListExtra extends AbstractView {
  constructor(extraTitle) {
    super();
    this._extraTitle = extraTitle;
  }

  getTemplate() {
    return createFilmsListExtraTemplate(this._extraTitle);
  }
}
