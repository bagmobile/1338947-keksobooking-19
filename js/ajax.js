'use strict';

(function (w) {
  var TIMEOUT_UPLOAD = 10000;
  var TIMEOUT_LOAD = 10000;
  var StatusCode = {
    OK: 200,
  };

  var addListeners = function (xhr, onSuccess, onError) {
    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onSuccess(xhr.response);
      } else {
        onError('Ошибка сервера: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

  };

  var loadData = function (url, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT_LOAD;
    addListeners(xhr, onSuccess, onError);
    xhr.open('GET', url);
    xhr.send();
  };

  var uploadData = function (data, url, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT_UPLOAD;
    addListeners(xhr, onSuccess, onError);
    xhr.open('POST', url);
    xhr.send(data);
  };

  w.ajax = {
    loadData: loadData,
    uploadData: uploadData,
  };
})(window);
