'use strict';

(function () {
  var mainPin = document.querySelector('.map__pin--main');
  var filters = document.querySelector('.map__filters');
  var adForm = document.querySelector('.ad-form');
  var address = document.querySelector('#address');
  var MAP = document.querySelector('.map');
  var MAIN_PIN_WIDTH = mainPin.clientWidth;
  var MAIN_PIN_DISABLED_HEIGHT = mainPin.clientHeight;
  var MAIN_PIN_ACTIVE_HEIGHT = MAIN_PIN_DISABLED_HEIGHT + parseInt(window.getComputedStyle(mainPin, ':after').height, 10);
  var PIN_Y_MIN = 130;
  var PIN_Y_MAX = 630;
  var PIN_X_MIN = 0 - MAIN_PIN_WIDTH / 2;
  var PIN_X_MAX = MAP.clientWidth - MAIN_PIN_WIDTH / 2;
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;
  var IS_ACTIVE_PAGE = true;

  var setAddressMainPinCoordinates = function (active) {
    var mainPinX = Math.floor(parseInt(mainPin.style.left, 10) + MAIN_PIN_WIDTH / 2);
    var mainPinY = parseInt(mainPin.style.top, 10) + MAIN_PIN_ACTIVE_HEIGHT;
    var mainPinDisabledY = Math.floor(parseInt(mainPin.style.top, 10) + MAIN_PIN_DISABLED_HEIGHT / 2);
    address.value = (active) ? mainPinX + ', ' + mainPinY : mainPinX + ', ' + mainPinDisabledY;
  };


  var addDisabled = function (parent) {
    for (var i = 0; i < parent.children.length; i++) {
      parent.children[i].setAttribute('disabled', 'disabled');
    }
  };

  var removeDisabled = function (parent) {
    for (var i = 0; i < parent.children.length; i++) {
      parent.children[i].removeAttribute('disabled');
    }
  };

  var activatePage = function (evt) {
    document.querySelector('.map').classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    removeDisabled(filters);
    removeDisabled(adForm);
    setAddressMainPinCoordinates(IS_ACTIVE_PAGE);
    fillMap(evt);

    var cards = document.querySelectorAll('.map__card.popup');
    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.add('hidden');
      var cardCloseBtn = cards[i].querySelector('.popup__close');
      var cardOpenBtn = cards[i].previousElementSibling;

      cardCloseBtn.addEventListener('click', closePopupCard);

      cardCloseBtn.addEventListener('keydown', popupEscPressHandler);

      cardOpenBtn.addEventListener('click', function (evt1) {
        openPopupCard(evt1);
        document.addEventListener('keydown', popupEscPressHandler);
      });

      cardOpenBtn.addEventListener('keydown', popupEnterPressHandler);
    }
  };

  var fillMap = function (evt) {
    if (evt.currentTarget.dataset.triggered) {
      return;
    }
    evt.currentTarget.dataset.triggered = true;
    var listElement = document.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < window.data.COUNT_DESCRIPTIONS; i++) {
      fragment.appendChild(window.pin.renderPin(window.data.offers[i]));
      fragment.appendChild(window.card.renderCard(window.data.offers[i]));
    }
    listElement.appendChild(fragment);
  };

  mainPin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      activatePage(evt);
    }
  });

  mainPin.addEventListener('mousedown', function (evt) {
    activatePage(evt);
    evt.preventDefault();

    var pin = evt.currentTarget;

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY,
    };

    var dragged = false;

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY,
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY,
      };

      var pinX = (pin.offsetLeft - shift.x);
      var pinY = (pin.offsetTop - shift.y);

      setAddressMainPinCoordinates(IS_ACTIVE_PAGE);

      if (pinY < PIN_Y_MIN) {
        pinY = PIN_Y_MIN;
      } else if (pinY > PIN_Y_MAX) {
        pinY = PIN_Y_MAX;
      }

      if (pinX < PIN_X_MIN) {
        pinX = PIN_X_MIN;
      } else if (pinX > PIN_X_MAX) {
        pinX = PIN_X_MAX;
      }

      pin.style.top = pinY + 'px';
      pin.style.left = pinX + 'px';

    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      setAddressMainPinCoordinates(IS_ACTIVE_PAGE);

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

      if (dragged) {
        var clickPreventDefaultHandler = function (preventEvt) {
          preventEvt.preventDefault();
          mainPin.removeEventListener('click', clickPreventDefaultHandler);
        };
        mainPin.addEventListener('click', clickPreventDefaultHandler);
      }
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  var popupEscPressHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopupCard();
    }
  };

  var popupEnterPressHandler = function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      openPopupCard(evt);
    }
  };

  var hideOpenedCard = function () {
    var openedCard = document.querySelector('.map__card.popup:not(.hidden)');
    if (openedCard) {
      openedCard.classList.add('hidden');
    }
  };

  var closePopupCard = function () {
    hideOpenedCard();
    document.removeEventListener('keydown', popupEnterPressHandler);
  };

  var openPopupCard = function (evt) {
    hideOpenedCard();
    var mapCard = evt.currentTarget.nextElementSibling;
    var mapPin = evt.currentTarget;
    if (mapPin !== null) {
      mapCard.classList.remove('hidden');
    }
    document.addEventListener('keydown', popupEscPressHandler);
  };

  addDisabled(filters);
  addDisabled(adForm);
  setAddressMainPinCoordinates();
})();
