'use strict';

(function () {
  var mainPin = document.querySelector('.map__pin--main');
  var address = document.querySelector('#address');
  var MAP = document.querySelector('.map');
  var MAIN_PIN_WIDTH = mainPin.clientWidth;
  var MAIN_PIN_DISABLED_HEIGHT = mainPin.clientHeight;
  var MAIN_PIN_ACTIVE_HEIGHT = MAIN_PIN_DISABLED_HEIGHT + parseInt(window.getComputedStyle(mainPin, ':after').height, 10);
  var PIN_Y_MIN = 130;
  var PIN_Y_MAX = 630;
  var PIN_X_MIN = 0 - MAIN_PIN_WIDTH / 2;
  var PIN_X_MAX = MAP.clientWidth - MAIN_PIN_WIDTH / 2;
  var IS_ACTIVE_PAGE = true;

  var setAddressMainPinCoordinates = function (active) {
    var mainPinX = Math.floor(parseInt(mainPin.style.left, 10) + MAIN_PIN_WIDTH / 2);
    var mainPinY = parseInt(mainPin.style.top, 10) + MAIN_PIN_ACTIVE_HEIGHT;
    var mainPinDisabledY = Math.floor(parseInt(mainPin.style.top, 10) + MAIN_PIN_DISABLED_HEIGHT / 2);
    address.value = (active) ? mainPinX + ', ' + mainPinY : mainPinX + ', ' + mainPinDisabledY;
  };

  var activatePage = function (evt) {
    document.querySelector('.map').classList.remove('map--faded');
    window.util.adForm.classList.remove('ad-form--disabled');
    window.util.removeDisabled(window.util.filtersForm);
    window.util.removeDisabled(window.util.adForm);
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

  var renderMap = function () {
    var listElement = document.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();
    var offers = window.data.offers;
    for (var j = 0; j < window.util.COUNT_OFFERS; j++) {
      fragment.appendChild(window.pin.renderPin(offers[j]));
      fragment.appendChild(window.card.renderCard(offers[j]));
    }
    listElement.appendChild(fragment);
  };

  var fillMap = function (evt) {
    if (evt.currentTarget.dataset.triggered) {
      var pins = document.querySelectorAll('.map__pin.hidden');
      if (pins) {
        for (var i = 0; i < pins.length; i++) {
          pins[i].classList.remove('hidden');
        }
      }
      return;
    }
    renderMap();
    evt.currentTarget.dataset.triggered = true;

  };

  mainPin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
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
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      closePopupCard();
    }
  };

  var popupEnterPressHandler = function (evt) {
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
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

  window.util.addDisabled(window.util.filtersForm);
  window.util.addDisabled(window.util.adForm);
  setAddressMainPinCoordinates();

  var startPositionX = mainPin.offsetLeft;
  var startPositionY = mainPin.offsetTop;
  var setStartCoords = function () {
    mainPin.style.left = startPositionX + 'px';
    mainPin.style.top = startPositionY + 'px';
    setAddressMainPinCoordinates();
  };

  window.map = {
    defaultMap: function () {
      setStartCoords();
      document.querySelector('.map').classList.add('map--faded');
      hideOpenedCard();
      var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
      for (var i = 0; i < pins.length; i++) {
        pins[i].classList.add('hidden');
      }
    },
  };
})();
