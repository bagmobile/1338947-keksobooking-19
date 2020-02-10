'use strict';

var ESC_KEY = 'Escape';
var ENTER_KEY = 'Enter';
var MAX_RENT_OBJECT = 8;
var LEFT_OFFSET = 25;
var TOP_OFFSET = 70;
var MIN_PRICE = 1000;
var MAX_PRICE = 10000;
var MAX_ROOM_COUNT = 8;
var COEF_GUEST_APART = 1.5;
var TEMPLATE_REPLACE = '{{xx}}';
var ICON_TEMPLATE_PATH = 'img/avatars/user{{xx}}.png';

var MapLeft = {
  x: 130,
  y: 630,
};

var RentTypes = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало',
};

var rentTypes = ['palace', 'flat', 'house', 'bungalo'];
var rentCheckTimes = ['12:00', '13:00', '14:00'];
var rentFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var rentPhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var map = document.querySelector('.map');
var adFormElements = document.querySelector('form.ad-form').querySelectorAll('fieldset');
var filterFormElements = document.querySelector('form.map__filters').querySelectorAll('select, fieldset');
var mapPinMain = document.querySelector('.map__pin--main');
var addressElementForm = document.querySelector('form.ad-form #address');
var priceElementForm = document.querySelector('form.ad-form #price');
var typeElementForm = document.querySelector('form.ad-form #type');
var capacityElementForm = document.querySelector('form.ad-form #capacity');
var roomNumberElementForm = document.querySelector('form.ad-form #room_number');
var timeInElementForm = document.querySelector('form.ad-form #timein');
var timeOutElementForm = document.querySelector('form.ad-form #timeout');

var generateRandomValue = function (max) {
  return Math.floor(Math.random() * max);
};

var generateRangeRandomValue = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var generateRandomArrayFromArray = function (arr) {
  var result = [];
  var beginIndex = generateRandomValue(arr.length);
  for (var i = beginIndex; i < arr.length; i++) {
    result.push(arr[i]);
  }
  return result;
};

var generateRentObjects = function () {
  var result = [];
  var mapElement = document.querySelector('.map__pins');
  for (var i = 0; i < MAX_RENT_OBJECT; i++) {
    var x = generateRangeRandomValue(mapElement.clientLeft + LEFT_OFFSET, mapElement.clientLeft + mapElement.clientWidth - LEFT_OFFSET);
    var y = generateRangeRandomValue(MapLeft.x, MapLeft.y);
    var roomCount = generateRandomValue(MAX_ROOM_COUNT);

    result.push({
      'author': {
        'avatar': ICON_TEMPLATE_PATH.replace(TEMPLATE_REPLACE, '0' + (i + 1)),
      },
      'offer': {
        'title': 'Offer' + (i + 1),
        'address': x + ', ' + y,
        'price': generateRangeRandomValue(MIN_PRICE, MAX_PRICE),
        'type': rentTypes[generateRandomValue(rentTypes.length)],
        'rooms': roomCount,
        'guests': generateRangeRandomValue(roomCount, roomCount * COEF_GUEST_APART),
        'checkin': rentCheckTimes[generateRandomValue(rentCheckTimes.length)],
        'checkout': rentCheckTimes[generateRandomValue(rentCheckTimes.length)],
        'features': generateRandomArrayFromArray(rentFeatures),
        'description': 'Description' + (i + 1),
        'photos': generateRandomArrayFromArray(rentPhotos),
      },
      'location': {
        'x': x,
        'y': y,
      },
    });
  }
  return result;
};

var createRentObjectElement = function (rentObject, order) {
  var templateRentObject = document.querySelector('#pin').content;
  var rentObjectElement = templateRentObject.cloneNode(true);
  rentObjectElement.querySelector('.map__pin').style = 'left: ' + (rentObject.location.x - LEFT_OFFSET) + 'px; top:' + (rentObject.location.y - TOP_OFFSET) + 'px';
  rentObjectElement.querySelector('img').src = rentObject.author.avatar;
  rentObjectElement.querySelector('img').alt = rentObject.offer.title;
  rentObjectElement.querySelector('.map__pin').dataset.rentOrderElement = order;
  return rentObjectElement;
};

var renderRentObjects = function (rentObjects) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < rentObjects.length; i++) {
    fragment.appendChild(createRentObjectElement(rentObjects[i], i));
  }
  document.querySelector('.map__pins').appendChild(fragment);
};

// Рендерим фичи объекта недвижимости в карточку/
var setRentCardFeatures = function (element, features) {
  var listElement = element.querySelectorAll('.popup__feature');
  for (var i = 0; i < listElement.length; i++) {
    if (features.indexOf(listElement[i].className.replace('popup__feature popup__feature--', '')) === -1) {
      listElement[i].classList.add('visually-hidden');
    }
  }
};

// Рендерим фотки объекта недвижимости в карточку/
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


// Рендерим карточку объекта недвижимости /
var getRentCardElement = function (rentObject, rentOrderElement) {
  var rentCardElement = map.querySelector('.map .map__card[data-rent-order-element = "' + rentOrderElement + '"]');
  if (rentCardElement === null) {
    rentCardElement = document.querySelector('#card').content.querySelector('.map__card').cloneNode(true);
    rentCardElement.dataset.rentOrderElement = rentOrderElement;
    rentCardElement.querySelector('.popup__title').textContent = rentObject.offer.title;
    rentCardElement.querySelector('.popup__text--address').textContent = rentObject.offer.address;
    rentCardElement.querySelector('.popup__text--price').textContent = rentObject.offer.price ? rentObject.offer.price + '₽/ночь' : '';
    rentCardElement.querySelector('.popup__type').textContent = RentTypes[rentObject.offer.type];
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

var initBooking = function () {
  deactivateBooking();
  addressElementForm.setAttribute('value', getAddressFromChords());
};

var activateBooking = function () {
  if (document.querySelector('.map.map--faded') !== null) {
    map.classList.remove('map--faded');
    document.querySelector('form.ad-form').classList.remove('ad-form--disabled');
    addressElementForm.setAttribute('value', getAddressFromChords());
    renderRentObjects(rentObjects);
    activateFormElements(adFormElements);
    activateFormElements(filterFormElements);
    validateCountGuest();
  }
};

var deactivateBooking = function () {
  disableFormElements(adFormElements);
  disableFormElements(filterFormElements);
  map.classList.add('map--faded');
  document.querySelector('form.ad-form').classList.add('ad-form--disabled');
};

var activateFormElements = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].removeAttribute('disabled');
  }
};

var disableFormElements = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].setAttribute('disabled', '');
  }
};

var getAddressFromChords = function () {
  return Math.round(Number(mapPinMain.style.left.replace('px', '')) + LEFT_OFFSET)
    + ', ' + Math.round(Number(mapPinMain.style.top.replace('px', '')) + TOP_OFFSET);
};

var validateCountGuest = function () {
  var rulesMapping = {
    100: [0],
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
  };
  var roomNumberSelectedValue = roomNumberElementForm.options[roomNumberElementForm.selectedIndex].value;
  var capacitySelectedValue = capacityElementForm.options[capacityElementForm.selectedIndex].value;
  [roomNumberElementForm, capacityElementForm].forEach(function (element) {
    element.setCustomValidity('');
  });
  for (var i = 0; i < rulesMapping[roomNumberSelectedValue].length; i++) {
    if (rulesMapping[roomNumberSelectedValue][i] === Number(capacitySelectedValue)) {
      return;
    }
  }
  capacityElementForm.setCustomValidity('Количесво гостей не соответствует количеству комнат');
};

var closeRentCardElement = function (element) {
  if (element !== null) {
    element.classList.add('hidden');
  }
};

var showRentCardElement = function (element) {
  if (element !== null) {
    var rentOrderElement = element.dataset.rentOrderElement;
    closeRentCardElement(map.querySelector('article.map__card:not(.hidden)'));
    getRentCardElement(rentObjects[rentOrderElement], rentOrderElement).classList.remove('hidden');
  }
};

var activateBookingHandler = function (evt) {
  if ((evt.button === 0) || (evt.key === 'Enter')) {
    activateBooking();
  }
};

mapPinMain.addEventListener('mousedown', activateBookingHandler);

mapPinMain.addEventListener('keydown', activateBookingHandler);

timeInElementForm.addEventListener('change', function () {
  timeOutElementForm.options.selectedIndex = timeInElementForm.options.selectedIndex;
});

timeOutElementForm.addEventListener('change', function () {
  timeInElementForm.options.selectedIndex = timeOutElementForm.options.selectedIndex;
});

typeElementForm.addEventListener('change', function () {
  var typeRentMinPrice = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000,
  };
  var newValue = typeElementForm.options[typeElementForm.selectedIndex].value;
  priceElementForm.setAttribute('min', typeRentMinPrice[newValue]);
  priceElementForm.setAttribute('placeholder', typeRentMinPrice[newValue]);
});

[roomNumberElementForm, capacityElementForm].forEach(function (element) {
  element.addEventListener('change', function (evt) {
    validateCountGuest(evt);
  });
});

map.addEventListener('click', function (evt) {

  if ((evt.button === 0)) {
    if (evt.target.matches('article.map__card button.popup__close')) {
      closeRentCardElement(evt.target.parentElement);
    }
    if (evt.target.matches('.map__pin:not(.map__pin--main) > img')) {
      showRentCardElement(evt.target.parentElement);
    }
    if (evt.target.matches('.map__pin:not(.map__pin--main)')) {
      showRentCardElement(evt.target);
    }
  }
});

map.addEventListener('keydown', function (evt) {
  if (evt.key === ESC_KEY) {
    closeRentCardElement(map.querySelector('article.map__card:not(.hidden)'));
  }
  if ((evt.key === ENTER_KEY) && evt.target.matches('.map__pin:not(.map__pin--main)')) {
    showRentCardElement(evt.target);
  }
});

// Генерим данные для объектов недвидимости/
var rentObjects = generateRentObjects();

initBooking();
