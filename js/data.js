'use strict';

(function (w) {
  var MAX_RENT_OBJECT = 5;
  var MIN_PRICE = 0;
  var MAX_PRICE = 10000;
  var MAX_ROOM_COUNT = 3;
  var COEF_GUEST_APART = 1.5;
  var TEMPLATE_REPLACE = '{{xx}}';
  var ICON_TEMPLATE_PATH = 'img/avatars/user{{xx}}.png';
  var rentCheckTimes = ['12:00', '13:00', '14:00'];
  var rentFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var rentPhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  var RentTypes = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало',
  };

  var RentTypeMinPrice = {
    'palace': 10000,
    'flat': 1000,
    'house': 5000,
    'bungalo': 0,
  };

  var rentObjects = [];

  var generateRentObjects = function () {
    var result = [];
    var rect = new window.domUtil.Rect(0, 130, 1200, 600);

    for (var i = 0; i < MAX_RENT_OBJECT; i++) {
      var x = window.mathUtil.generateRangeRandomValue(rect.left, rect.right);
      var y = window.mathUtil.generateRangeRandomValue(rect.top, rect.bottom);
      var roomCount = window.mathUtil.generateRandomValue(MAX_ROOM_COUNT);
      var rentTypes = Object.keys(RentTypes);

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

  var setDataRentObjects = function (data) {
    rentObjects = data.filter(function (element) {
      return element.hasOwnProperty('offer');
    });
    rentObjects.map(function (element, index) {
      element.id = index;
      return element;
    });
  };

  var getRentObject = function (order) {
    if (order && (rentObjects[order])) {
      return rentObjects[order];
    }
    return null;
  };

  var filterRentObject = function (filter) {
    var result = [];
    if (filter.type === 'any') {
      return rentObjects.slice(-MAX_RENT_OBJECT);
    }
    for (var i = 0; i < rentObjects.length; i++) {
      if (rentObjects[i].offer.type === filter.type) {
        result.push(rentObjects[i]);
      }
      if (result.length === MAX_RENT_OBJECT) {
        return result;
      }
    }
    return result;
  };

  var getFilteredRentObjects = function (filter) {
    if (filter) {
      return filterRentObject(filter);
    }
    return rentObjects.slice(-MAX_RENT_OBJECT);
  };


  w.data = {
    rentTypes: RentTypes,
    rentTypeMinPrice: RentTypeMinPrice,
    generateRentObjects: generateRentObjects,
    setDataRentObjects: setDataRentObjects,
    getFilteredRentObjects: getFilteredRentObjects,
    getRentObject: getRentObject
  };
})(window);
