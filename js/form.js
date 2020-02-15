'use strict';

(function (w) {
  var noticeForm = document.querySelector('form.ad-form');
  var filterForm = document.querySelector('.map__filters');
  var adFormElements = noticeForm.querySelectorAll('fieldset');
  var filterFormElements = filterForm.querySelectorAll('select, fieldset');
  var addressElementForm = noticeForm.querySelector('.ad-form #address');
  var priceElementForm = noticeForm.querySelector('.ad-form #price');
  var typeElementForm = noticeForm.querySelector('.ad-form #type');
  var capacityElementForm = noticeForm.querySelector('.ad-form #capacity');
  var roomNumberElementForm = noticeForm.querySelector('.ad-form #room_number');
  var timeInElementForm = noticeForm.querySelector('.ad-form #timein');
  var timeOutElementForm = noticeForm.querySelector('.ad-form #timeout');

  var activate = function () {
    activateFormElements(adFormElements);
    activateFormElements(filterFormElements);
    setAddress();
    setType();
    validateCountGuest();
    noticeForm.classList.remove('ad-form--disabled');
  };

  var deactivate = function () {
    disableFormElements(adFormElements);
    disableFormElements(filterFormElements);
    noticeForm.classList.add('ad-form--disabled');
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

  noticeForm.addEventListener('submit', function (evt) {
    var onSuccess = function () {
      noticeForm.reset();
      window.message.showSuccessMessage();
    };
    var onError = function () {
      window.message.showErrorMessage();
    };
    evt.preventDefault();
    window.upload.uploadData(new FormData(noticeForm), noticeForm.getAttribute('action'), onSuccess, onError);
  });

  noticeForm.addEventListener('reset', function (_evt) {

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
