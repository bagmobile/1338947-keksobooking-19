'use strict';

(function (w) {
  var setRentCardFeatures = function (element, features) {
    var listElement = element.querySelectorAll('.popup__feature');
    for (var i = 0; i < listElement.length; i++) {
      if (features.indexOf(listElement[i].className.replace('popup__feature popup__feature--', '')) === -1) {
        listElement[i].classList.add('visually-hidden');
      }
    }
  };

  var setRentCardPhotos = function (element, photos) {
    var fragment = document.createDocumentFragment();
    var photosElement = element.querySelector('.popup__photos');
    var photoElement = photosElement.querySelector('.popup__photo');
    var photo = photosElement.removeChild(photoElement);
    for (var i = 0; i < photos.length; i++) {
      var newPhotoElement = photo.cloneNode(true);
      newPhotoElement.src = photos[i];
      fragment.appendChild(newPhotoElement);
    }
    photosElement.appendChild(fragment);
    photo = null;
  };

  var getRentCardElement = function (rentObject, rentOrderElement) {
    var rentCardElement = document.querySelector('.map .map__card[data-rent-order-element = "' + rentOrderElement + '"]');

    if (rentCardElement === null) {
      rentCardElement = document.querySelector('#card').content.querySelector('.map__card').cloneNode(true);
      rentCardElement.dataset.rentOrderElement = rentOrderElement;
      rentCardElement.querySelector('.popup__title').textContent = rentObject.offer.title;
      rentCardElement.querySelector('.popup__text--address').textContent = rentObject.offer.address;
      rentCardElement.querySelector('.popup__text--price').textContent = rentObject.offer.price ? rentObject.offer.price + '₽/ночь' : '';
      rentCardElement.querySelector('.popup__type').textContent = window.data.rentTypes[rentObject.offer.type];
      rentCardElement.querySelector('.popup__text--capacity').textContent = rentObject.offer.rooms + ' комнат(ы) для ' + rentObject.offer.guests + ' гостей';
      rentCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + rentObject.offer.checkin + ', выезд до ' + rentObject.offer.checkout;
      rentCardElement.querySelector('.popup__description').textContent = rentObject.offer.description;
      rentCardElement.querySelector('.popup__avatar').src = rentObject.author.avatar;
      setRentCardFeatures(rentCardElement, rentObject.offer.features);
      setRentCardPhotos(rentCardElement, rentObject.offer.photos);
      document.querySelector('.map__filters-container').insertAdjacentElement('beforebegin', rentCardElement);
    }
    return rentCardElement;
  };

  var closeRentCardElement = function (element) {
    if (element !== null) {
      element.classList.add('hidden');
    }
  };

  var showRentCardElement = function (rentObjects, element) {
    if (element !== null) {
      var rentOrderElement = element.dataset.rentOrderElement;
      closeRentCardElement(document.querySelector('.map article.map__card:not(.hidden)'));
      getRentCardElement(rentObjects[rentOrderElement], rentOrderElement).classList.remove('hidden');
    }
  };

  w.card = {
    closeRentCardElement: closeRentCardElement,
    showRentCardElement: showRentCardElement
  };
})(window);
