'use strict';

var MAX_RENT_OBJECT = 8;
var LEFT_OFFSET = 25;
var TOP_OFFSET = 70;
var MIN_PRICE = 1000;
var MAX_PRICE = 50000;
var MAX_ROOM_COUNT = 8;
var COEF_GUEST_APART = 1.5;
var TEMPLATE_REPLACE = '{{xx}}';
var ICON_TEMPLATE_PATH = 'img/avatars/user{{xx}}.png';

var MapLeft = {
  x: 130,
  y: 630
};

var rentTypes = ['palace', 'flat', 'house', 'bungalo'];
var rentCheckTimes = ['12:00', '13:00', '14:00'];
var rentFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var rentPhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];


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
        'photos': generateRandomArrayFromArray(rentPhotos)
      },
      'location': {
        'x': x,
        'y': y
      }
    });
  }
  return result;
};

var createRentObjectElement = function (rentObject) {
  var templateRentObject = document.querySelector('#pin').content;
  var rentObjectElement = templateRentObject.cloneNode(true);
  rentObjectElement.querySelector('.map__pin').style = 'left: ' + (rentObject.location.x - LEFT_OFFSET) + 'px; top:' + (rentObject.location.y - TOP_OFFSET) + 'px';
  rentObjectElement.querySelector('img').src = rentObject.author.avatar;
  rentObjectElement.querySelector('img').alt = rentObject.offer.title;
  return rentObjectElement;
};

var renderRentObjects = function (rentObjects) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < rentObjects.length; i++) {
    fragment.appendChild(createRentObjectElement(rentObjects[i]));
  }
  document.querySelector('.map__pins').appendChild(fragment);
};

var rentObjects = generateRentObjects();

document.querySelector('.map').classList.remove('map--faded');
renderRentObjects(rentObjects);


