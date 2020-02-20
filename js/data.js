'use strict';

(function (w) {
  var MAX_RENT_OBJECT = 5;
  var DEFAULT_FILTER_VALUE = 'any';
  var MIN_PRICE = 0;
  var MAX_PRICE = 10000;
  var MAX_ROOM_COUNT = 3;
  var COEF_GUEST_APART = 1.5;
  var TEMPLATE_REPLACE = '{{xx}}';
  var ICON_TEMPLATE_PATH = 'img/avatars/user{{xx}}.png';
  var rentCheckTimes = ['12:00', '13:00', '14:00'];
  var rentFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var rentPhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  var rentType = {
    'palace': {
      name: 'Дворец',
      minPrice: 10000,
    },
    'house': {
      name: 'Дом',
      minPrice: 5000,
    },
    'flat': {
      name: 'Квартира',
      minPrice: 1000,
    },
    'bungalo': {
      name: 'Бунгало',
      minPrice: 0,
    },
  };

  var rangeFilter = {
    'low': [0, 10000],
    'middle': [10000, 50000],
    'high': [50000]
  };

  var rentObjects = [];

  var generateRentObjects = function () {
    var result = [];
    var rect = new window.domUtil.Rect(0, 130, 1200, 600);

    for (var i = 0; i < MAX_RENT_OBJECT; i++) {
      var x = window.mathUtil.generateRangeRandomValue(rect.left, rect.right);
      var y = window.mathUtil.generateRangeRandomValue(rect.top, rect.bottom);
      var roomCount = window.mathUtil.generateRandomValue(MAX_ROOM_COUNT);
      var rentTypes = Object.keys(rentType);

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
    }).map(function (element, index) {
      element.id = index;
      return element;
    });
  };

  var getRentObject = function (order) {
    return rentObjects[order] ? rentObjects[order] : null;
  };

  var filterConformity = function (elementValue, filterValue, isNumeric) {
    return (filterValue === DEFAULT_FILTER_VALUE) || (elementValue === filterValue) || (isNumeric && (elementValue === Number(filterValue)));
  };

  var filterRange = function (elementValue, filterValue, range) {
    return (filterValue === DEFAULT_FILTER_VALUE) || ((elementValue >= range[filterValue][0]) && (!range[filterValue][1] || (elementValue < range[filterValue][1])));
  };

  var filterPlurality = function (elementValue, filterValue) {
    return Array.isArray(filterValue) ? filterValue.every(function (element) {
      return Array.isArray(elementValue) ? elementValue.indexOf(element) > -1 : elementValue === element;
    }) : null;
  };

  var filterRentObjects = function (formFilter) {
    var result = [];
    for (var i = 0; i < rentObjects.length; i++) {
      if (filterConformity(rentObjects[i].offer.type, formFilter.type)
        && filterRange(rentObjects[i].offer.price, formFilter.price, rangeFilter)
        && filterConformity(rentObjects[i].offer.rooms, formFilter.rooms, true)
        && filterConformity(rentObjects[i].offer.guests, formFilter.guests, true)
        && filterPlurality(rentObjects[i].offer.features, formFilter.features)) {
        result.push(rentObjects[i]);
      }
      if (result.length === MAX_RENT_OBJECT) {
        return result;
      }
    }
    return result;
  };

  var getFilteredRentObjects = function (formFilter) {
    return (formFilter) ? filterRentObjects(formFilter) : rentObjects.slice(0, MAX_RENT_OBJECT);
  };

  w.data = {
    rentType: rentType,
    generateRentObjects: generateRentObjects,
    setDataRentObjects: setDataRentObjects,
    getFilteredRentObjects: getFilteredRentObjects,
    getRentObject: getRentObject,
  };
})(window);
