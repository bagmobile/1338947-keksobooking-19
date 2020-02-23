'use strict';

(function (w) {
  var noticeForm = document.querySelector('form.ad-form');
  var filterForm = document.querySelector('.map__filters');
  var noticeFormElements = noticeForm.querySelectorAll('fieldset');
  var filterFormElements = filterForm.querySelectorAll('select, fieldset');
  var addressElementForm = noticeForm.querySelector('.ad-form #address');
  var priceElementForm = noticeForm.querySelector('.ad-form #price');
  var typeElementForm = noticeForm.querySelector('.ad-form #type');
  var capacityElementForm = noticeForm.querySelector('.ad-form #capacity');
  var roomNumberElementForm = noticeForm.querySelector('.ad-form #room_number');
  var timeInElementForm = noticeForm.querySelector('.ad-form #timein');
  var timeOutElementForm = noticeForm.querySelector('.ad-form #timeout');

  var init = function () {
    deactivateNoticeForm();
    deactivateFilterForm();
    setAddress(window.pin.getCoordinateMainPinCenter());
  };

  var deactivateBooking = function () {
    noticeForm.reset();
    filterForm.reset();
    deactivateNoticeForm();
    deactivateFilterForm();
    window.card.closeCard();
    window.pin.removePinElements();
    window.pin.setMainPinToCenterMap();
    setAddress(window.pin.getCoordinateMainPinCenter());
    window.map.deactivate();
  };

  var setAddress = function (coordinate) {
    addressElementForm.setAttribute('value', coordinate.x + ', ' + coordinate.y);
  };

  var activateNoticeForm = function () {
    setStateFormElements(noticeFormElements, true);
    setAddress(window.pin.getCoordinateMainPinPoint());
    changeMinPrice();
    validateCountGuests();
    noticeForm.classList.remove('ad-form--disabled');
  };

  var deactivateNoticeForm = function () {
    setStateFormElements(noticeFormElements, false);
    noticeForm.classList.add('ad-form--disabled');
  };

  var activateFilterForm = function () {
    setStateFormElements(filterFormElements, true);
  };

  var deactivateFilterForm = function () {
    setStateFormElements(filterFormElements, false);
  };

  var setStateFormElements = function (elements, isActive) {
    elements.forEach(function (element) {
      if (isActive) {
        element.removeAttribute('disabled');
      } else {
        element.setAttribute('disabled', '');
      }
    });
  };

  var validateCountGuests = function () {
    var VALIDATE_MESSAGE = 'Количесво гостей не соответствует количеству комнат';
    var validateRuleMapping = {
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
    for (var i = 0; i < validateRuleMapping[roomNumberSelectedValue].length; i++) {
      if (validateRuleMapping[roomNumberSelectedValue][i] === Number(capacitySelectedValue)) {
        return;
      }
    }
    capacityElementForm.setCustomValidity(VALIDATE_MESSAGE);
  };

  var changeMinPrice = function () {
    var newValue = typeElementForm.options[typeElementForm.selectedIndex].value;
    var minPrice = window.data.getMinPrice(newValue);
    priceElementForm.setAttribute('min', minPrice);
    priceElementForm.setAttribute('placeholder', minPrice);
  };

  typeElementForm.addEventListener('change', function () {
    changeMinPrice();
  });

  timeInElementForm.addEventListener('change', function () {
    timeOutElementForm.options.selectedIndex = timeInElementForm.options.selectedIndex;
  });

  timeOutElementForm.addEventListener('change', function () {
    timeInElementForm.options.selectedIndex = timeOutElementForm.options.selectedIndex;
  });

  [roomNumberElementForm, capacityElementForm].forEach(function (element) {
    element.addEventListener('change', function (evt) {
      validateCountGuests(evt);
    });
  });

  noticeForm.addEventListener('submit', function (evt) {
    var onSuccess = function () {
      window.message.showSuccessMessage();
      deactivateBooking();
    };
    var onError = function () {
      window.message.showErrorMessage();
    };
    evt.preventDefault();
    window.ajax.uploadData(new FormData(noticeForm), noticeForm.getAttribute('action'), onSuccess, onError);
  });

  noticeForm.addEventListener('reset', function () {
    deactivateBooking();
  });

  var getFilterData = function () {
    return {
      type: filterForm.querySelector('#housing-type').value,
      price: filterForm.querySelector('#housing-price').value,
      rooms: filterForm.querySelector('#housing-rooms').value,
      guests: filterForm.querySelector('#housing-guests').value,
      features: Array.from(filterForm.querySelectorAll('#housing-features input'))
        .filter(function (e) {
          return e.checked;
        })
        .map(function (e) {
          return e.value;
        }),
    };
  };

  filterForm.querySelectorAll('input, select').forEach(function (element) {
    element.addEventListener('change', function () {
      window.card.closeCard();
      window.pin.removePinElements();
      window.setTimeout(function () {
        window.pin.renderPinElements(window.data.getFilteredRentObjects(getFilterData()));
      }, window.data.FILTER_UPDATE_TIMEOUT);
    });
  });

  init();

  w.form = {
    activateNoticeForm: activateNoticeForm,
    activateFilterForm: activateFilterForm,
    setAddress: setAddress,
  };
})(window);
