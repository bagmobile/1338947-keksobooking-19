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
   * TODO Как сериализовать правильно объект? Инспектор подсвечивает обращение к полям
   */
  var RentObject = function (object) {
    this.author = object['author'];
    this.offer = object['offer'];
    this.location = object['location'];
  };

  var setDataRentObjects = function (data) {
    rentObjects = data.filter(function (element) {
      return element.hasOwnProperty('offer');
    });
  };

  var getRentObject = function (order) {
    return rentObjects[order] ? new RentObject(rentObjects[order]) : null;
  };

  var getFilteredRentObjects = function (formFilter) {
    return (formFilter) ? filterRentObjects(formFilter) : rentObjects.slice(0, MAX_RENT_OBJECT);
  };

  var filterRentObjects = function (formFilter) {
    var result = [];
    for (var i = 0; i < rentObjects.length; i++) {
      if (filterConformity(rentObjects[i].offer.type, formFilter.type)
        && filterRange(rentObjects[i].offer.price, formFilter.price, rangePriceFilter)
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

  w.data = {
    URL: URL,
    FILTER_UPDATE_TIMEOUT: FILTER_UPDATE_TIMEOUT,
    rentType: rentType,
    setDataRentObjects: setDataRentObjects,
    getFilteredRentObjects: getFilteredRentObjects,
    getRentObject: getRentObject,
  };
})(window);
