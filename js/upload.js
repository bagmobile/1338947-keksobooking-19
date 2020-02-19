'use strict';

(function (w) {
  var TIMEOUT_UPLOAD = 10000;
  var StatusCode = {
    OK: 200,
  };

  var uploadData = function (data, url, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT_UPLOAD;
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

    xhr.open('POST', url);
    xhr.send(data);
  };

  w.upload = {
    uploadData: uploadData
  };
})(window);
