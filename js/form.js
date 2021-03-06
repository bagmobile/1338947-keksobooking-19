'use strict';

(function (w) {

  var FILTER_UPDATE_TIMEOUT = 500;
  var DEFAULT_AVATAR_IMAGE = 'img/muffin-grey.svg';

  var noticeForm = document.querySelector('form.ad-form');
  var filterForm = document.querySelector('.map__filters');
  var noticeFormElements = noticeForm.querySelectorAll('fieldset');
  var filterFormElements = filterForm.querySelectorAll('select, fieldset');
  var avatarElementForm = noticeForm.querySelector('.ad-form #avatar');
  var avatarPreviewElementForm = noticeForm.querySelector('.ad-form-header__preview img');
  var photoContainerElementForm = noticeForm.querySelector('.ad-form__photo-container');
  var photoContainerPreviewElementForm = photoContainerElementForm.querySelector('.ad-form__photo');
  var sizeImage = {
    width: photoContainerPreviewElementForm.offsetWidth,
    height: photoContainerPreviewElementForm.offsetHeight,
  };
  var photoContainerPreviewTemplate = photoContainerPreviewElementForm.cloneNode(true);
  var photoContainerInputElementForm = photoContainerElementForm.querySelector('.ad-form__input');
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
    removeNoticeFormPhotos();
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
    checkCapacityGuests(true);
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

  var getAcceptCapacityGuests = function (countRoom) {
    var roomToCapacityMapping = {
      100: [0],
      1: [1],
      2: [1, 2],
      3: [1, 2, 3],
    };
    return (Object.keys(roomToCapacityMapping).indexOf(countRoom) > -1) ? roomToCapacityMapping[countRoom] : [];
  };

  var updateStateCapacityElementForm = function (guests) {
    Array.from(capacityElementForm.options).forEach(function (element) {
      if (guests.indexOf(Number(element.value)) > -1) {
        element.removeAttribute('disabled');
      } else {
        element.setAttribute('disabled', '');
      }
    });
  };

  var checkCapacityGuests = function (isRoomChangeAction) {
    var VALIDATE_MESSAGE = 'Количесво гостей не соответствует количеству комнат';

    var countRoom = roomNumberElementForm.options[roomNumberElementForm.selectedIndex].value;
    var capacityGuests = Number(capacityElementForm.options[capacityElementForm.selectedIndex].value);
    var guests = getAcceptCapacityGuests(countRoom);

    capacityElementForm.setCustomValidity('');
    if (isRoomChangeAction) {
      updateStateCapacityElementForm(guests);
    }

    if (guests.indexOf(capacityGuests) === -1) {
      capacityElementForm.setCustomValidity(VALIDATE_MESSAGE);
    }
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
      checkCapacityGuests(evt.target === roomNumberElementForm);
    });
  });

  avatarElementForm.addEventListener('change', function (evt) {
    window.fileReader.updateImages([avatarPreviewElementForm], evt.target.files);
  });

  var removeNoticeFormPhotos = function () {
    avatarPreviewElementForm.src = DEFAULT_AVATAR_IMAGE;
    photoContainerElementForm.querySelectorAll('.ad-form__photo').forEach(function (element) {
      element.remove();
    });
  };

  photoContainerInputElementForm.addEventListener('change', function (evt) {
    if (evt.target.files.length > 0) {
      var fragment = document.createDocumentFragment();
      removeNoticeFormPhotos();
      Array.from(evt.target.files).map(function () {
        var newPhotoElement = photoContainerPreviewTemplate.cloneNode(true);
        var img = document.createElement('img');
        img.width = sizeImage.width;
        img.height = sizeImage.height;
        newPhotoElement.appendChild(img);
        fragment.appendChild(newPhotoElement);
      });
      photoContainerElementForm.appendChild(fragment);
      window.fileReader.updateImages(photoContainerElementForm.querySelectorAll('.ad-form__photo img'), evt.target.files);
    }
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
      }, FILTER_UPDATE_TIMEOUT);
    });
  });

  init();

  w.form = {
    activateNoticeForm: activateNoticeForm,
    activateFilterForm: activateFilterForm,
    setAddress: setAddress,
  };

})(window);
