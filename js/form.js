'use strict';

(function () {
  var selectType = document.querySelector('#type');
  var inputTitle = document.querySelector('#title');
  var inputPrice = document.querySelector('#price');
  var textareaDescription = document.querySelector('#description');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var roomNumber = document.querySelector('#room_number');
  var capacity = document.querySelector('#capacity');


  var timeInChangeHandler = function (evt) {
    timeOut.value = evt.target.value;
  };

  var timeOutChangeHandler = function (evt) {
    timeIn.value = evt.target.value;
  };

  var setPriceValidityByType = function (price, type) {
    switch (type.value) {
      case 'flat':
        price.placeholder = 1000;
        price.setAttribute('min', 1000);

        if (price.value && price.value < 1000) {
          price.setCustomValidity('Минимальная цена: 1000 рублей');
        } else {
          price.setCustomValidity('');
        }
        break;
      case 'bungalo':
        price.placeholder = 0;
        price.setAttribute('min', 0);
        if (price.value && price.value < 0) {
          price.setCustomValidity('Минимальная цена: 0 рублей');
        } else {
          price.setCustomValidity('');
        }
        break;
      case 'house':
        price.placeholder = 5000;
        price.setAttribute('min', 5000);
        if (price.value && price.value < 5000) {
          price.setCustomValidity('Минимальная цена: 5 000 рублей');
        } else {
          price.setCustomValidity('');
        }
        break;
      case 'palace':
        price.placeholder = 10000;
        price.setAttribute('min', 10000);
        if (price.value && price.value < 10000) {
          price.setCustomValidity('Минимальная цена: 10 000 рублей');
        } else {
          price.setCustomValidity('');
        }
        break;
      default:
        price.setCustomValidity('');
        price.placeholder = '';
        break;
    }

  };

  var setCapacityValidityByType = function () {
    var capacityVal = +capacity.value;
    switch (roomNumber.value) {
      case '100':
        if (capacityVal !== 0) {
          capacity.setCustomValidity('Для 100 комнат допустим вариант "не для гостей"');
        } else {
          capacity.setCustomValidity('');
        }
        break;
      case '3':
        if (capacityVal === 0) {
          capacity.setCustomValidity('3 комнаты не доступны для варианта "не для гостей"');
        } else {
          capacity.setCustomValidity('');
        }
        break;
      case '2':
        if ((capacityVal !== 2) && (capacityVal !== 1)) {
          capacity.setCustomValidity('2 комнаты доступны только для 1 или 2 гостей.');
        } else {
          capacity.setCustomValidity('');
        }
        break;
      case '1':
        if (capacityVal !== 1) {
          capacity.setCustomValidity('1 комната доступна только для 1 гостя.');
        } else {
          capacity.setCustomValidity('');
        }
        break;
    }
  };

  timeIn.addEventListener('change', timeInChangeHandler);

  timeOut.addEventListener('change', timeOutChangeHandler);

  selectType.addEventListener('change', function () {
    setPriceValidityByType(inputPrice, selectType);
  });

  inputPrice.addEventListener('input', function () {
    setPriceValidityByType(inputPrice, selectType);
  });

  roomNumber.addEventListener('change', function () {
    setCapacityValidityByType();
  });

  capacity.addEventListener('change', function () {
    setCapacityValidityByType();
  });

  setPriceValidityByType(inputPrice, selectType);
  setCapacityValidityByType(capacity);

  var succesHandler = function () {
    inputTitle.value = '';
    inputPrice.value = '';
    textareaDescription.value = '';
    window.util.adForm.classList.add('ad-form--disabled');
    window.map.defaultMap();
    window.util.addDisabled(window.util.filtersForm);
    window.util.addDisabled(window.util.adForm);

    var successTemplate = document.querySelector('#success').content.querySelector('.success');
    var successElement = successTemplate.cloneNode(true);
    document.querySelector('main').insertAdjacentElement('afterbegin', successElement);
    document.addEventListener('keydown', successEscPressHandler);
    document.addEventListener('click', clickDocumentHandler);
  };

  var successEscPressHandler = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      closeSuccessMessage();
    }
  };

  var clickDocumentHandler = function (evt) {
    var successMsg = document.querySelector('.success__message');
    if (evt.target !== successMsg) {
      closeSuccessMessage();
    }
  };

  var closeSuccessMessage = function () {
    var success = document.querySelector('.success');
    success.remove();
    document.removeEventListener('keydown', successEscPressHandler);
    document.removeEventListener('click', clickDocumentHandler);
  };

  window.util.adForm.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(window.util.adForm), succesHandler, window.util.errorHandler);
    evt.preventDefault();
  });

})();
