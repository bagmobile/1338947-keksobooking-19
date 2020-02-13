'use strict';

(function (w) {
  var adFormElements = document.querySelector('form.ad-form').querySelectorAll('fieldset');
  var filterFormElements = document.querySelector('form.map__filters').querySelectorAll('select, fieldset');
  var addressElementForm = document.querySelector('form.ad-form #address');
  var priceElementForm = document.querySelector('form.ad-form #price');
  var typeElementForm = document.querySelector('form.ad-form #type');
  var capacityElementForm = document.querySelector('form.ad-form #capacity');
  var roomNumberElementForm = document.querySelector('form.ad-form #room_number');
  var timeInElementForm = document.querySelector('form.ad-form #timein');
  var timeOutElementForm = document.querySelector('form.ad-form #timeout');


  var activate = function () {
    activateFormElements(adFormElements);
    activateFormElements(filterFormElements);
    setAddress();
    setType();
    validateCountGuest();
    document.querySelector('form.ad-form').classList.remove('ad-form--disabled');
  };

  var deactivate = function () {
    disableFormElements(adFormElements);
    disableFormElements(filterFormElements);
    document.querySelector('form.ad-form').classList.add('ad-form--disabled');
  };

  var setAddress = function () {
    addressElementForm.setAttribute('value', getAddressFromChords(window.pin.mapPinMain));
  };

  var setType = function () {
    var newValue = typeElementForm.options[typeElementForm.selectedIndex].value;
    priceElementForm.setAttribute('min', window.data.rentTypeMinPrice[newValue]);
    priceElementForm.setAttribute('placeholder', window.data.rentTypeMinPrice[newValue]);
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

  timeInElementForm.addEventListener('change', function () {
    timeOutElementForm.options.selectedIndex = timeInElementForm.options.selectedIndex;
  });

  timeOutElementForm.addEventListener('change', function () {
    timeInElementForm.options.selectedIndex = timeOutElementForm.options.selectedIndex;
  });

  typeElementForm.addEventListener('change', setType);

  [roomNumberElementForm, capacityElementForm].forEach(function (element) {
    element.addEventListener('change', function (evt) {
      validateCountGuest(evt);
    });
  });

  var getAddressFromChords = function (element) {
    return Math.round(Number(element.style.left.replace('px', '')) + window.pin.LEFT_OFFSET)
      + ', ' + Math.round(Number(element.style.top.replace('px', '')) + window.pin.TOP_OFFSET);
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

  w.form = {
    activate: activate,
    deactivate: deactivate
  };
})(window);
