'use strict';

(function (w) {

  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';
  var TIMEOUT_UPLOAD = 10000;
  var TIMEOUT_LOAD = 10000;

  var HttpMethod = {
    POST: 'POST',
    GET: 'GET'
  };
  var StatusCode = {
    OK: 200,
  };

  var getXHR = function (onSuccess, onError, timeout) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = timeout;
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
    return xhr;
  };

  var loadData = function (url, onSuccess, onError) {
    var xhr = getXHR(onSuccess, onError, TIMEOUT_LOAD);
    xhr.open(HttpMethod.GET, url || URL_LOAD);
    xhr.send();
  };

  var uploadData = function (data, url, onSuccess, onError) {
    var xhr = getXHR(onSuccess, onError, TIMEOUT_UPLOAD);
    xhr.open(HttpMethod.POST, url);
    xhr.send(data);
  };

  w.ajax = {
    loadData: loadData,
    uploadData: uploadData,
  };

})(window);
