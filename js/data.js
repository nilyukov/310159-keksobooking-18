'use strict';
(function () {
  window.data = {
    COUNT_DESCRIPTIONS: 8,
  };

  var successHandler = function (data) {
    window.data.offers = data;
  };

  var errorHandler = function (errorMessage) {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorElement = errorTemplate.cloneNode(true);
    errorElement.querySelector('.error__message').textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', errorElement);
  };

  window.backend.load(successHandler, errorHandler);
})();
