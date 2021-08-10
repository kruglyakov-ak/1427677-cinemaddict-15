import Abstract from '../view/abstract.js';

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const render = (container, child, place) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (child instanceof Abstract) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const bodyElement = document.querySelector('body');

export const closePopup = () => {
  const popupElement = document.querySelector('.film-details');
  if (popupElement) {
    bodyElement.removeChild(popupElement);
  }
  bodyElement.classList.remove('hide-overflow');
};

export const onEscKeyDown = (evt) => {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    evt.preventDefault();
    closePopup();
    document.removeEventListener('keydown', onEscKeyDown);
  }
};

export const openPopup = (popup) => {
  closePopup();
  render(bodyElement, popup, RenderPosition.BEFOREEND);
  bodyElement.classList.add('hide-overflow');
  document.addEventListener('keydown', onEscKeyDown);
};
