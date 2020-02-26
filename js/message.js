'use strict';

(function (w) {

  var templatePlace = document.querySelector('main');
  var successMessageElement = document.querySelector('#success').content.cloneNode(true).querySelector('.success');
  var errorMessageElement = document.querySelector('#error').content.cloneNode(true).querySelector('.error');

  var init = function () {
    [successMessageElement, errorMessageElement].forEach(function (element) {
      element.classList.add('hidden');
      templatePlace.insertAdjacentElement('afterbegin', element);
    });
    templatePlace.addEventListener('keydown', function (evt) {
      window.domUtil.isEscEvent(evt, onHideMessage);
    });
    templatePlace.addEventListener('click', function (evt) {
      window.domUtil.isLeftButtonMouseEvent(evt, onHideMessage);
    });
  };

  var onHideMessage = function (evt) {
    if (evt.target) {
      if (evt.target.matches('.success, .error')) {
        evt.target.classList.add('hidden');
      }
      if (evt.target.matches('.error__button')) {
        evt.target.parentElement.classList.add('hidden');
      }
    }
  };

  var showElement = function (element, error) {
    if (error) {
      element.querySelector('.error__message').textContent = error;
    }
    element.classList.remove('hidden');
    window.domUtil.setFocusOnBlock(element);
  };

  var showSuccessMessage = function () {
    showElement(successMessageElement);
  };

  var showErrorMessage = function (error) {
    showElement(errorMessageElement, error);
  };

  init();

  w.message = {
    showSuccessMessage: showSuccessMessage,
    showErrorMessage: showErrorMessage,
  };
})(window);
