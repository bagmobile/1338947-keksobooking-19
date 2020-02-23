'use strict';

(function (w) {
  var map = document.querySelector('.map');
  var templateCard = document.querySelector('#card');
  var mapFiltersContainer = document.querySelector('.map__filters-container');

  var setCardFeatures = function (element, features) {
    element.querySelectorAll('.popup__feature').forEach(function (value) {
      if (features.indexOf(value.className.replace('popup__feature popup__feature--', '')) === -1) {
        value.classList.add('visually-hidden');
      }
    });
  };

  var setRentCardPhotos = function (element, photos) {
    var fragment = document.createDocumentFragment();
    var photosElement = element.querySelector('.popup__photos');
    var photoElement = photosElement.querySelector('.popup__photo');
    var photo = photosElement.removeChild(photoElement);
    photos.forEach(function (value) {
      var newPhotoElement = photo.cloneNode(true);
      newPhotoElement.src = value;
      fragment.appendChild(newPhotoElement);
    });
    photosElement.appendChild(fragment);
    // TODO нужно это делать
    photo = null;
  };

  var closeCard = function () {
    var element = map.querySelector('article.map__card');
    if (element) {
      element.remove();
      window.pin.setInactivePin();
    }
  };

  var onCloseCard = function () {
    closeCard();
  };

  var onShowCard = function (rentObject) {
    closeCard();
    showCard(rentObject);
  };

  var onClickPopupClose = function (evt) {
    window.domUtil.isLeftButtonMouseEvent(evt, onCloseCard);
  };

  var onKeyDownPopupClose = function (evt) {
    window.domUtil.isSpaceEvent(evt, function () {
      evt.preventDefault();
    });
    window.domUtil.isEnterEvent(evt, onCloseCard);
  };

  var onKeyDownCard = function (evt) {
    window.domUtil.isEscEvent(evt, onCloseCard);
  };

  var showCard = function (rentObject) {
    var rentCardElement = templateCard.content.cloneNode(true).querySelector('.map__card');
    // TODO вынести в отдельные функции
    rentCardElement.querySelector('.popup__avatar').src = rentObject.author.avatar;
    rentCardElement.querySelector('.popup__title').textContent = rentObject.offer.title;
    rentCardElement.querySelector('.popup__text--address').textContent = rentObject.offer.address;
    rentCardElement.querySelector('.popup__text--price').textContent = rentObject.offer.price ? rentObject.offer.price + '₽/ночь' : '';
    rentCardElement.querySelector('.popup__type').textContent = window.data.rentType[rentObject.offer.type].name;
    rentCardElement.querySelector('.popup__text--capacity').textContent = rentObject.offer.rooms + ' комнат(ы) для ' + rentObject.offer.guests + ' гостей';
    rentCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + rentObject.offer.checkin + ', выезд до ' + rentObject.offer.checkout;
    rentCardElement.querySelector('.popup__description').textContent = rentObject.offer.description;

    setCardFeatures(rentCardElement, rentObject.offer.features);
    setRentCardPhotos(rentCardElement, rentObject.offer.photos);

    rentCardElement.querySelector('.popup__close').addEventListener('click', onClickPopupClose);
    rentCardElement.querySelector('.popup__close').addEventListener('keydown', onKeyDownPopupClose);
    rentCardElement.addEventListener('keydown', onKeyDownCard);

    mapFiltersContainer.insertAdjacentElement('beforebegin', rentCardElement);

    window.domUtil.setFocusOnBlock(rentCardElement.querySelector('.popup__avatar'));
  };

  w.card = {
    closeCard: closeCard,
    onShowCard: onShowCard,
  };
})(window);
