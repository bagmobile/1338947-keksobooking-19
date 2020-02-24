'use strict';

(function (w) {
  var MAX_RENT_OBJECT = 5;
  var DEFAULT_FILTER_VALUE = 'any';
  var REN_OBJECT_OFFER_KEY = 'offer';
  var ERROR_VALID_INPUT_DATA = 'Некорректные данные получены с сервера. Сообщите разработчикам.';

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

  var rangePriceFilter = {
    'low': [0, 10000],
    'middle': [10000, 50000],
    'high': [50000],
  };

  var rentObjects = [];
  var _isVerifiedData = false;

  var RentObject = function (object) {
    this.author = object.author;
    this.offer = object.offer;
    this.location = object.location;
    if (!this.author || !this.location) {
      throw ERROR_VALID_INPUT_DATA;
    }
  };
  RentObject.prototype.getAvatar = function () {
    return this.author.avatar;
  };
  RentObject.prototype.getTitle = function () {
    return this.offer.title;
  };
  RentObject.prototype.getAddress = function () {
    return this.offer.address;
  };
  RentObject.prototype.getPrice = function () {
    return this.offer.price;
  };
  RentObject.prototype.getViewPrice = function () {
    return this.getPrice() ? this.getPrice() + '₽/ночь' : undefined;
  };
  RentObject.prototype.getType = function () {
    return this.offer.type;
  };
  RentObject.prototype.getViewType = function () {
    return this.getType() ? rentType[this.getType()].name : undefined;
  };
  RentObject.prototype.getRooms = function () {
    return this.offer.rooms;
  };
  RentObject.prototype.getGuests = function () {
    return this.offer.guests;
  };
  RentObject.prototype.getCapacity = function () {
    return this.getRooms() && this.getGuests()
      ? this.getRooms() + ' комнат(ы) для ' + this.getGuests() + ' гостей'
      : undefined;
  };
  RentObject.prototype.getCheckin = function () {
    return this.offer.checkin;
  };
  RentObject.prototype.getCheckout = function () {
    return this.offer.checkout;
  };
  RentObject.prototype.getTime = function () {
    return this.getCheckin() && this.getCheckout()
      ? 'Заезд после ' + this.getCheckin() + ', выезд до ' + this.getCheckout()
      : undefined;
  };
  RentObject.prototype.getFeatures = function () {
    return this.offer.features;
  };
  RentObject.prototype.getPhotos = function () {
    return this.offer.photos;
  };
  RentObject.prototype.getDescription = function () {
    return this.offer.description;
  };
  RentObject.prototype.getLocation = function () {
    return this.location;
  };

  var setDataRentObjects = function (data) {
    try {
      _isVerifiedData = false;
      rentObjects = data.filter(function (element) {
        return element.hasOwnProperty(REN_OBJECT_OFFER_KEY);
      }).map(function (element) {
        return new RentObject(element);
      });
      _isVerifiedData = true;
    } catch (e) {
      _isVerifiedData = false;
      window.message.showErrorMessage(e);
    }
  };

  var isVerifiedData = function () {
    return _isVerifiedData;
  };

  var getRentObject = function (order) {
    return rentObjects[order] ? rentObjects[order] : null;
  };

  var getFilteredRentObjects = function (formFilter) {
    return (formFilter)
      ? filterRentObjects(formFilter)
      : rentObjects.slice(0, MAX_RENT_OBJECT);
  };

  var filterRentObjects = function (formFilter) {
    var results = [];
    for (var i = 0; i < rentObjects.length; i++) {
      if (isFilterConformity(rentObjects[i].getType(), formFilter.type)
        && isFilterRange(rentObjects[i].getPrice(), formFilter.price, rangePriceFilter)
        && isFilterConformity(rentObjects[i].getRooms(), formFilter.rooms, true)
        && isFilterConformity(rentObjects[i].getGuests(), formFilter.guests, true)
        && isFilterPlurality(rentObjects[i].getFeatures(), formFilter.features)) {
        results.push(rentObjects[i]);
      }
      if (results.length === MAX_RENT_OBJECT) {
        return results;
      }
    }
    return results;
  };

  var getMinPrice = function (index) {
    return rentType[index].minPrice;
  };

  var isFilterConformity = function (elementValue, filterValue, isNumeric) {
    return (filterValue === DEFAULT_FILTER_VALUE)
      || (elementValue === filterValue)
      || (isNumeric && (elementValue === Number(filterValue)));
  };

  var isFilterRange = function (elementValue, filterValue, range) {
    return (filterValue === DEFAULT_FILTER_VALUE)
      || ((elementValue >= range[filterValue][0]) && (!range[filterValue][1] || (elementValue < range[filterValue][1])));
  };

  var isFilterPlurality = function (elementValue, filterValue) {
    return Array.isArray(filterValue)
      ? filterValue.every(function (element) {
        return Array.isArray(elementValue) ? elementValue.indexOf(element) > -1 : elementValue === element;
      })
      : false;
  };

  w.data = {
    isVerifiedData: isVerifiedData,
    getMinPrice: getMinPrice,
    setDataRentObjects: setDataRentObjects,
    getFilteredRentObjects: getFilteredRentObjects,
    getRentObject: getRentObject,
  };
})(window);
