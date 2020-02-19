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
    setAddress(window.domUtil.getCoordinateCenter(window.pin.mainPin));
  };

  var activateNoticeForm = function () {
    setStateFormElements(noticeFormElements, true);
    setAddress(window.pin.getCoordinatePointMainPin());
    onChangeMinPrice();
    validateCountGuest();
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

  var setAddress = function (coordinate) {
    addressElementForm.setAttribute('value', coordinate.x + ', ' + coordinate.y);
  };

  var onChangeMinPrice = function () {
    var newValue = typeElementForm.options[typeElementForm.selectedIndex].value;
    var minPrice = window.data.rentType[newValue].minPrice;
    priceElementForm.setAttribute('min', minPrice);
    priceElementForm.setAttribute('placeholder', minPrice);
  };

  timeInElementForm.addEventListener('change', function () {
    timeOutElementForm.options.selectedIndex = timeInElementForm.options.selectedIndex;
  });

  timeOutElementForm.addEventListener('change', function () {
    timeInElementForm.options.selectedIndex = timeOutElementForm.options.selectedIndex;
  });

  typeElementForm.addEventListener('change', onChangeMinPrice);

  [roomNumberElementForm, capacityElementForm].forEach(function (element) {
    element.addEventListener('change', function (evt) {
      validateCountGuest(evt);
    });
  });

  noticeForm.addEventListener('submit', function (evt) {
    var onSuccess = function () {
      noticeForm.reset();
      filterForm.reset();
      deactivateNoticeForm();
      deactivateFilterForm();
      window.map.deactivate();
      window.pin.removePinElements();
      window.card.removeCards();
      window.domUtil.setCoordinateForStyleElement(window.pin.mainPin, window.pin.initMainPinCoordinate.x, window.pin.initMainPinCoordinate.y);
      setAddress(window.domUtil.getCoordinateCenter(window.pin.mainPin));
      window.message.showSuccessMessage();
    };
    var onError = function () {
      window.message.showErrorMessage();
    };

    evt.preventDefault();
    window.upload.uploadData(new FormData(noticeForm), noticeForm.getAttribute('action'), onSuccess, onError);
  });

  noticeForm.addEventListener('reset', function () {
    noticeForm.reset();
    filterForm.reset();
    deactivateNoticeForm();
    deactivateFilterForm();
    window.map.deactivate();
    window.pin.removePinElements();
    window.card.removeCards();
    window.domUtil.setCoordinateForStyleElement(window.pin.mainPin, window.pin.initMainPinCoordinate.x, window.pin.initMainPinCoordinate.y);
    setAddress(window.domUtil.getCoordinateCenter(window.pin.mainPin));
  });

  var onFilterChange = function () {
  };

  filterForm.querySelectorAll('input, select').forEach(function (element) {
    element.addEventListener('change', function () {
      window.card.removeCards();
      window.pin.removePinElements();

      var filterData = {
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

      window.pin.renderPinElements(window.data.getFilteredRentObjects(filterData));

    });
  });


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

  init();

  w.form = {
    activateNoticeForm: activateNoticeForm,
    activateFilterForm: activateFilterForm,
    setAddress: setAddress,
    onFilterChange: onFilterChange,
  };
})(window);
