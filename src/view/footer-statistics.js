import {createElement} from '../utils.js';

const createFooterStatisticsTemplate = (movies) => (
  `<section class="footer__statistics">
    <p>${movies.length} movies inside</p>
  </section>`
);

export default class FooterStatistics {
  constructor(movies) {
    this._element = null;
    this._movies = movies;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._movies);
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
