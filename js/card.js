'use strict';

(function (w) {
  var map = document.querySelector('.map');
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
    photo = null;
  };

  var onCloseCard = function (evt) {
    closeCard(evt);
  };

  var onShowCard = function (evt) {
    closeCard();
    showCard(evt.currentTarget);
  };

  var onClickPopupClose = function (evt) {
    window.domUtil.isLeftButtonMouseEvent(evt, onCloseCard);
  };

  var onKewDownPopupClose = function (evt) {
    evt.preventDefault();
    window.domUtil.isEnterEvent(evt, onCloseCard);
  };

  var getCard = function (rentObject) {
    var rentCardElement = map.querySelector('.map__card[data-rent-order-element = "' + rentObject.id + '"]');

    if (rentCardElement === null) {
      rentCardElement = document.querySelector('#card').content.querySelector('.map__card').cloneNode(true);
      rentCardElement.dataset.rentOrderElement = rentObject.id;
      rentCardElement.querySelector('.popup__title').textContent = rentObject.offer.title;
      rentCardElement.querySelector('.popup__text--address').textContent = rentObject.offer.address;
      rentCardElement.querySelector('.popup__text--price').textContent = rentObject.offer.price ? rentObject.offer.price + '₽/ночь' : '';
      rentCardElement.querySelector('.popup__type').textContent = window.data.rentType[rentObject.offer.type].name;
      rentCardElement.querySelector('.popup__text--capacity').textContent = rentObject.offer.rooms + ' комнат(ы) для ' + rentObject.offer.guests + ' гостей';
      rentCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + rentObject.offer.checkin + ', выезд до ' + rentObject.offer.checkout;
      rentCardElement.querySelector('.popup__description').textContent = rentObject.offer.description;
      rentCardElement.querySelector('.popup__avatar').src = rentObject.author.avatar;
      setCardFeatures(rentCardElement, rentObject.offer.features);
      setRentCardPhotos(rentCardElement, rentObject.offer.photos);
      rentCardElement.querySelector('.popup__close').addEventListener('click', onClickPopupClose);
      rentCardElement.querySelector('.popup__close').addEventListener('keydown', onKewDownPopupClose);
      mapFiltersContainer.insertAdjacentElement('beforebegin', rentCardElement);
    }
    return rentCardElement;
  };

  var closeCard = function () {
    var element = map.querySelector('article.map__card:not(.hidden)');
    if (element) {
      element.classList.add('hidden');
      window.pin.setInactivePin();
    }
  };

  var removeCards = function () {
    map.querySelectorAll('article.map__card').forEach(function (element) {
      element.removeEventListener('click', onClickPopupClose);
      element.removeEventListener('kewdown', onKewDownPopupClose);
      element.remove();
    });
  };

  var showCard = function (element) {
    var rentObject = window.data.getRentObject(element.dataset.rentOrderElement);
    getCard(rentObject).classList.remove('hidden');
  };

  w.card = {
    removeCards: removeCards,
    onShowCard: onShowCard
  };
})(window);
