'use strict';

(function (w) {
  var DEFAULT_TABINDEX = '0';
  var templatePlace = document.querySelector('main');
  var successMessageElement = document.querySelector('#success').content.cloneNode(true).querySelector('.success');
  var errorMessageElement = document.querySelector('#error').content.cloneNode(true).querySelector('.error');

  var init = function () {
    [successMessageElement, errorMessageElement].forEach(function (element) {
      element.classList.add('hidden');
      element.setAttribute('tabindex', DEFAULT_TABINDEX);
      templatePlace.insertAdjacentElement('afterbegin', element);
    });
    templatePlace.addEventListener('keydown', function (evt) {
      window.domUtil.isEscEvent(evt, function () {
        if (evt.target.matches('.success, .error')) {
          hideElement(evt.target);
        }
      });
    });
    templatePlace.addEventListener('click', function (evt) {
      window.domUtil.isLeftButtonMouseEvent(evt, function () {
        if (evt.target.matches('.success, .error')) {
          hideElement(evt.target);
        }
        if (evt.target.matches('.error__button')) {
          hideElement(evt.target.parentElement);
        }
      });
    });
  };

  var hideElement = function (element) {
    element.classList.add('hidden');
  };

  var showElement = function (element, error) {
    if (error) {
      element.querySelector('.error__message').textContent = error;
    }
    element.classList.remove('hidden');
    element.focus();
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
