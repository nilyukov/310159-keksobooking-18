'use strict';
(function () {
  var successHandler = function (data) {
    window.data.offers = data;
  };

  window.backend.load(successHandler, window.util.errorHandler);
})();
