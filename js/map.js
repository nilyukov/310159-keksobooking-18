'use strict';

(function () {
  var mainPin = document.querySelector('.map__pin--main');
  var filters = document.querySelector('.map__filters');
  var adForm = document.querySelector('.ad-form');
  var address = document.querySelector('#address');

  var MAIN_PIN_WIDTH = mainPin.clientWidth;
  var MAIN_PIN_DISABLED_HEIGHT = mainPin.clientHeight;
  var MAIN_PIN_ACTIVE_HEIGHT = MAIN_PIN_DISABLED_HEIGHT + parseInt(window.getComputedStyle(mainPin, ':after').height, 10);
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;

  var mainPinDisabledY = Math.floor(parseInt(mainPin.style.top, 10) + MAIN_PIN_DISABLED_HEIGHT / 2);
  var mainPinX = Math.floor(parseInt(mainPin.style.left, 10) + MAIN_PIN_WIDTH / 2);
  var mainPinY = parseInt(mainPin.style.top, 10) + MAIN_PIN_ACTIVE_HEIGHT;

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

  var setAddress = function (x, y) {
    address.value = x + ', ' + y;
  };


  var activatePage = function (evt) {
    document.querySelector('.map').classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    removeDisabled(filters);
    removeDisabled(adForm);
    setAddress(mainPinX, mainPinY);
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
    var descriptionOffers = window.data.generateRandomOffers();
    for (var i = 0; i < window.data.COUNT_DESCRIPTIONS; i++) {
      fragment.appendChild(window.pin.renderPin(descriptionOffers[i]));
      fragment.appendChild(window.card.renderCard(descriptionOffers[i]));
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
  setAddress(mainPinX, mainPinDisabledY);
})();
