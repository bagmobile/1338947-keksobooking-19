'use strict';

(function (w) {
  var MAX_RENT_OBJECT = 8;
  var MIN_PRICE = 1000;
  var MAX_PRICE = 10000;
  var MAX_ROOM_COUNT = 7;
  var COEF_GUEST_APART = 1.5;
  var TEMPLATE_REPLACE = '{{xx}}';
  var ICON_TEMPLATE_PATH = 'img/avatars/user{{xx}}.png';

  var rentTypes = ['palace', 'flat', 'house', 'bungalo'];
  var rentCheckTimes = ['12:00', '13:00', '14:00'];
  var rentFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var rentPhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  var RentTypes = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало',
  };
  var MapRangeY = {
    BEGIN: 130,
    END: 630,
  };
  var RentTypeMinPrice = {
    'palace': 10000,
    'flat': 1000,
    'house': 5000,
    'bungalo': 0,
  };

  var mapElement = document.querySelector('.map__pins');

  var generateRentObjects = function () {
    var result = [];

    for (var i = 0; i < MAX_RENT_OBJECT; i++) {
      var x = window.mathUtil.generateRangeRandomValue(mapElement.clientLeft, mapElement.clientLeft + mapElement.clientWidth);
      var y = window.mathUtil.generateRangeRandomValue(MapRangeY.BEGIN, MapRangeY.END);
      var roomCount = window.mathUtil.generateRandomValue(MAX_ROOM_COUNT);

      result.push({
        'author': {
          'avatar': ICON_TEMPLATE_PATH.replace(TEMPLATE_REPLACE, '0' + (i + 1)),
        },
        'offer': {
          'title': 'Offer' + (i + 1),
          'address': x + ', ' + y,
          'price': window.mathUtil.generateRangeRandomValue(MIN_PRICE, MAX_PRICE),
          'type': rentTypes[window.mathUtil.generateRandomValue(rentTypes.length)],
          'rooms': roomCount,
          'guests': window.mathUtil.generateRangeRandomValue(roomCount, roomCount * COEF_GUEST_APART),
          'checkin': rentCheckTimes[window.mathUtil.generateRandomValue(rentCheckTimes.length)],
          'checkout': rentCheckTimes[window.mathUtil.generateRandomValue(rentCheckTimes.length)],
          'features': window.mathUtil.generateRandomArrayFromArray(rentFeatures),
          'description': 'Description' + (i + 1),
          'photos': window.mathUtil.generateRandomArrayFromArray(rentPhotos),
        },
        'location': {
          'x': x,
          'y': y,
        },
      });
    }
    return result;
  };

  w.data = {
    rentTypes: RentTypes,
    rentTypeMinPrice: RentTypeMinPrice,
    generateRentObjects: generateRentObjects
  };
})(window);
