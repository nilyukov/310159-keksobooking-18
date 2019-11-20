'use strict';

(function () {
  var URL_GET = 'https://js.dump.academy/keksobooking/data';
  window.backend = {
    load: function (loadHandler, errorHandler) {

      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          loadHandler(xhr.response);
        } else {
          errorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        errorHandler('Произошла ошибка соединения');
      });

      xhr.open('GET', URL_GET);
      xhr.send();
    }
  };
})();
