import HeaderProfileView from '../view/header-profile.js';
import MainNavigationView from '../view/main-navigation.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';

export default class Filter {
  constructor(headerProfileContainer, filterContainer, filterModel, moviesModel) {
    this._filterContainer = filterContainer;
    this._headerProfileContainer = headerProfileContainer;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;

    this._mainNavigationComponent = null;
    this._headerProfileComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevMainNavigationComponent = this._mainNavigationComponent;
    const prevHeaderProfileComponent = this._headerProfileComponent;

    this._mainNavigationComponent = new MainNavigationView(filters, this._filterModel.getFilter());
    this._headerProfileComponent = new HeaderProfileView(this._getWatchedMoviesCount());
    this._mainNavigationComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevMainNavigationComponent === null && prevHeaderProfileComponent === null) {
      render( this._headerProfileContainer, this._headerProfileComponent, RenderPosition.BEFOREEND);
      render(this._filterContainer, this._mainNavigationComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._mainNavigationComponent, prevMainNavigationComponent);
    replace(this._headerProfileComponent, prevHeaderProfileComponent);
    remove(prevMainNavigationComponent);
    remove(prevHeaderProfileComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const movies = this._moviesModel.getMovies();

    return [
      {
        type: FilterType.WHATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WHATCHLIST](movies).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](movies).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](movies).length,
      },
    ];
  }

  _getWatchedMoviesCount() {
    return this._getFilters().find((filterItem) => filterItem.name === 'History').count;
  }
}
