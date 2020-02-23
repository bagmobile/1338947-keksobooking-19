'use strict';

(function (w) {
  var URL = 'https://js.dump.academy/keksobooking/data';
  var MAX_RENT_OBJECT = 5;
  var DEFAULT_FILTER_VALUE = 'any';
  var FILTER_UPDATE_TIMEOUT = 500;

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

  /*
   * TODO Как сериализовать правильно объект? Нужно описать все поля с проверкой? Или может инициализайию проводить
   *  с тремя основными полями author, offer, location
   */
  var RentObject = function (object) {
    this.object = object;
  };
  RentObject.prototype.getAvatar = function () {
    return this.object['author']['avatar'];
  };
  RentObject.prototype.getTitle = function () {
    return this.object['offer']['title'];
  };
  RentObject.prototype.getAddress = function () {
    return this.object['offer']['address'];
  };
  RentObject.prototype.getPrice = function () {
    return this.object['offer']['price'];
  };
  RentObject.prototype.getViewPrice = function () {
    return this.getPrice() ? this.getPrice() + '₽/ночь' : undefined;
  };
  RentObject.prototype.getType = function () {
    return this.object['offer']['type'];
  };
  RentObject.prototype.getViewType = function () {
    return this.getType() ? rentType[this.getType()].name : undefined;
  };
  RentObject.prototype.getRooms = function () {
    return this.object['offer']['rooms'];
  };
  RentObject.prototype.getGuests = function () {
    return this.object['offer']['guests'];
  };
  RentObject.prototype.getCapacity = function () {
    return this.getRooms() && this.getGuests()
      ? this.getRooms() + ' комнат(ы) для ' + this.getGuests() + ' гостей'
      : undefined;
  };
  RentObject.prototype.getTime = function () {
    return this.object['offer']['checkin'] && this.object['offer']['checkout']
      ? 'Заезд после ' + this.object['offer']['checkin'] + ', выезд до ' + this.object['offer']['checkout']
      : undefined;
  };
  RentObject.prototype.getFeatures = function () {
    return this.object['offer']['features'];
  };
  RentObject.prototype.getPhotos = function () {
    return this.object['offer']['photos'];
  };
  RentObject.prototype.getDescription = function () {
    return this.object['offer']['description'];
  };
  RentObject.prototype.getLocation = function () {
    return this.object['location'];
  };

  var setDataRentObjects = function (data) {
    rentObjects = data.filter(function (element) {
      return element.hasOwnProperty('offer');
    }).map(function (element) {
      return new RentObject(element);
    });
  };

  var getRentObject = function (order) {
    return rentObjects[order] ? rentObjects[order] : null;
  };

  var getFilteredRentObjects = function (formFilter) {
    return (formFilter)
      ? filterRentObjects(formFilter)
      : rentObjects.slice(0, MAX_RENT_OBJECT);
  };

  // TODO Как всё же быть с фильтрацией, как унифицировать
  var filterRentObjects = function (formFilter) {
    var result = [];
    for (var i = 0; i < rentObjects.length; i++) {
      if (filterConformity(rentObjects[i].getType(), formFilter.type)
        && filterRange(rentObjects[i].getPrice(), formFilter.price, rangePriceFilter)
        && filterConformity(rentObjects[i].getRooms(), formFilter.rooms, true)
        && filterConformity(rentObjects[i].getGuests(), formFilter.guests, true)
        && filterPlurality(rentObjects[i].getFeatures(), formFilter.features)) {
        result.push(rentObjects[i]);
      }
      if (result.length === MAX_RENT_OBJECT) {
        return result;
      }
    }
    return result;
  };

  var getMinPrice = function (index) {
    return rentType[index].minPrice;
  };

  var filterConformity = function (elementValue, filterValue, isNumeric) {
    return (filterValue === DEFAULT_FILTER_VALUE)
      || (elementValue === filterValue)
      || (isNumeric && (elementValue === Number(filterValue)));
  };

  var filterRange = function (elementValue, filterValue, range) {
    return (filterValue === DEFAULT_FILTER_VALUE)
      || ((elementValue >= range[filterValue][0]) && (!range[filterValue][1] || (elementValue < range[filterValue][1])));
  };

  var filterPlurality = function (elementValue, filterValue) {
    return Array.isArray(filterValue)
      ? filterValue.every(function (element) {
        return Array.isArray(elementValue) ? elementValue.indexOf(element) > -1 : elementValue === element;
      })
      : false;
  };

  w.data = {
    URL: URL,
    FILTER_UPDATE_TIMEOUT: FILTER_UPDATE_TIMEOUT,
    getMinPrice: getMinPrice,
    setDataRentObjects: setDataRentObjects,
    getFilteredRentObjects: getFilteredRentObjects,
    getRentObject: getRentObject,
  };
})(window);
