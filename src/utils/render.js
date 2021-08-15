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

export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

const bodyElement = document.querySelector('body');

export const closePopup = (popup) => {
  if (popup) {
    remove(popup);
  }
  bodyElement.classList.remove('hide-overflow');
};

export const onEscKeyDown = (evt, popup) => {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    evt.preventDefault();
    closePopup(popup);
    // eslint-disable-next-line no-shadow
    document.removeEventListener('keydown', (evt) => onEscKeyDown(evt, popup));
  }
};

export const openPopup = (popup) => {
  closePopup();
  render(bodyElement, popup, RenderPosition.BEFOREEND);
  bodyElement.classList.add('hide-overflow');
  document.addEventListener('keydown', (evt) => onEscKeyDown(evt, popup));
};
