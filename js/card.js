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
    if (photos.length > 0) {
      var photo = photosElement.removeChild(photoElement);
      photos.forEach(function (value) {
        var newPhotoElement = photo.cloneNode(true);
        newPhotoElement.src = value;
        fragment.appendChild(newPhotoElement);
      });
      photosElement.appendChild(fragment);
    } else {
      window.domUtil.hideEmptyElement(photosElement);
    }
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

    window.domUtil.setAttribute(rentCardElement.querySelector('.popup__avatar'), 'src', rentObject.getAvatar());
    window.domUtil.setTextContent(rentCardElement.querySelector('.popup__title'), rentObject.getTitle());
    window.domUtil.setTextContent(rentCardElement.querySelector('.popup__text--address'), rentObject.getAddress());
    window.domUtil.setTextContent(rentCardElement.querySelector('.popup__text--price'), rentObject.getViewPrice());
    window.domUtil.setTextContent(rentCardElement.querySelector('.popup__type'), rentObject.getViewType());
    window.domUtil.setTextContent(rentCardElement.querySelector('.popup__text--capacity'), rentObject.getCapacity());
    window.domUtil.setTextContent(rentCardElement.querySelector('.popup__text--time'), rentObject.getTime());
    window.domUtil.setTextContent(rentCardElement.querySelector('.popup__description'), rentObject.getDescription());
    setCardFeatures(rentCardElement, rentObject.getFeatures());
    setRentCardPhotos(rentCardElement, rentObject.getPhotos());

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
