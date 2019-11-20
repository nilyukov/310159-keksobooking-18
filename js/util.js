'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;
  var COUNT_OFFERS = 8;
  var adForm = document.querySelector('.ad-form');
  var filtersForm = document.querySelector('.map__filters');
  window.util = {
    ENTER_KEYCODE: ENTER_KEYCODE,
    ESC_KEYCODE: ESC_KEYCODE,
    COUNT_OFFERS: COUNT_OFFERS,
    adForm: adForm,
    filtersForm: filtersForm,

    addDisabled: function (parent) {
      for (var i = 0; i < parent.children.length; i++) {
        parent.children[i].setAttribute('disabled', 'disabled');
      }
    },

    removeDisabled: function (parent) {
      for (var i = 0; i < parent.children.length; i++) {
        parent.children[i].removeAttribute('disabled');
      }
    },

    errorHandler: function (errorMessage) {
      var errorTemplate = document.querySelector('#error').content.querySelector('.error');
      var errorElement = errorTemplate.cloneNode(true);
      errorElement.querySelector('.error__message').textContent = errorMessage;
      document.querySelector('main').insertAdjacentElement('afterbegin', errorElement);
      var errorCloseBtn = errorElement.querySelector('.error__button');
      errorCloseBtn.addEventListener('click', clickDocumentHandler);

      document.addEventListener('keydown', errorEscPressHandler);
      document.addEventListener('click', clickDocumentHandler);
    },
  };

  var clickDocumentHandler = function (evt) {
    var errorMsg = document.querySelector('.error__message');
    if (evt.target !== errorMsg) {
      closeErrorMessage();
    }
  };

  var closeErrorMessage = function () {
    var error = document.querySelector('.error');
    error.remove();
    document.removeEventListener('keydown', errorEscPressHandler);
    document.removeEventListener('click', clickDocumentHandler);
  };

  var errorEscPressHandler = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      closeErrorMessage();
    }
  };
})();
