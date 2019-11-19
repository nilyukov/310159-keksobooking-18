'use strict';
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var COUNT_DESCRIPTIONS = 8;
var WIDTH_MAP = document.querySelector('.map').clientWidth;
var PIN_Y_MIN = 130;
var PIN_Y_MAX = 630;
var PIN_HEIGHT = 70;
var PIN_WIDTH = 50;
var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;

var mainPin = document.querySelector('.map__pin--main');

var MAIN_PIN_WIDTH = mainPin.clientWidth;
var MAIN_PIN_DISABLED_HEIGHT = mainPin.clientHeight;
var MAIN_PIN_ACTIVE_HEIGHT = MAIN_PIN_DISABLED_HEIGHT + parseInt(window.getComputedStyle(mainPin, ':after').height, 10);

var mainPinDisabledY = Math.floor(parseInt(mainPin.style.top, 10) + MAIN_PIN_DISABLED_HEIGHT / 2);
var mainPinX = Math.floor(parseInt(mainPin.style.left, 10) + MAIN_PIN_WIDTH / 2);
var mainPinY = parseInt(mainPin.style.top, 10) + MAIN_PIN_ACTIVE_HEIGHT;

var filters = document.querySelector('.map__filters');
var adForm = document.querySelector('.ad-form');
var address = document.querySelector('#address');
var selectType = document.querySelector('#type');
var inputPrice = document.querySelector('#price');
var timeIn = document.querySelector('#timein');
var timeOut = document.querySelector('#timeout');
var roomNumber = document.querySelector('#room_number');
var capacity = document.querySelector('#capacity');

var getArrayRandomLength = function (arr) {
  return arr.filter(function () {
    return Math.floor(Math.random() * 2);
  });
};

var generateRandomOffers = function () {
  var descriptions = [];
  for (var i = 0; i < COUNT_DESCRIPTIONS; i++) {
    var pinX = Math.floor(Math.random() * (WIDTH_MAP + 1)) - PIN_WIDTH / 2;
    var pinY = Math.floor(Math.random() * (PIN_Y_MAX + 1 - PIN_Y_MIN) + PIN_Y_MIN) - PIN_HEIGHT;

    descriptions.push({
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png',
      },
      offer: {
        title: 'заголовок предложения',
        address: pinX + ', ' + pinY,
        price: 100,
        type: TYPES[Math.floor(Math.random() * TYPES.length)],
        rooms: 2,
        guests: 4,
        checkin: CHECKIN[Math.floor(Math.random() * CHECKIN.length)],
        checkout: CHECKOUT[Math.floor(Math.random() * CHECKOUT.length)],
        features: getArrayRandomLength(FEATURES),
        description: 'description',
        photos: getArrayRandomLength(PHOTOS),
      },
      location: {
        x: pinX,
        y: pinY,
      },
    });
  }
  return descriptions;
};

var renderPin = function (descriptionPin) {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinElement = pinTemplate.cloneNode(true);
  var pinImg = pinElement.querySelector('img');

  pinElement.style.left = descriptionPin.location.x + 'px';
  pinElement.style.top = descriptionPin.location.y + 'px';
  pinImg.alt = descriptionPin.offer.title;
  pinImg.src = descriptionPin.author.avatar;
  return pinElement;
};

var renderCard = function (descriptionPin) {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var cardElement = cardTemplate.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = descriptionPin.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = descriptionPin.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = descriptionPin.offer.price + '₽/ночь';

  var offerType;
  switch (descriptionPin.offer.type) {
    case 'flat':
      offerType = 'Квартира';
      break;
    case 'bungalo':
      offerType = 'Бунгало';
      break;
    case 'house':
      offerType = 'Дом';
      break;
    case 'palace':
      offerType = 'Дворец';
      break;
    default:
      offerType = 'Жилье';
      break;
  }
  cardElement.querySelector('.popup__type').textContent = offerType;
  cardElement.querySelector('.popup__text--capacity').textContent = descriptionPin.offer.rooms + ' комнаты для ' + descriptionPin.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + descriptionPin.offer.checkin + ', выезд до ' + descriptionPin.offer.checkout;
  cardElement.querySelector('.popup__description').textContent = descriptionPin.offer.description;
  insertElements(cardElement.querySelector('.popup__features'), descriptionPin.offer.features);
  insertElements(cardElement.querySelector('.popup__photos'), descriptionPin.offer.photos);
  cardElement.querySelector('.popup__avatar').src = descriptionPin.author.avatar;
  return cardElement;
};

var insertElements = function (element, attributes) {
  for (var i = 0; i < attributes.length; i++) {
    var childElement;
    switch (element.tagName.toLowerCase()) {
      case 'div':
        childElement = '<img src="' + attributes[i] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">';
        break;
      case 'ul':
        childElement = '<li class="popup__feature popup__feature--' + attributes[i] + '"></li>';
        break;
    }

    if (i === 0) {
      element.innerHTML = childElement;
    } else {
      element.insertAdjacentHTML('beforeend', childElement);
    }
  }
};

var fillMap = function (evt) {
  if (evt.currentTarget.dataset.triggered) {
    return;
  }
  evt.currentTarget.dataset.triggered = true;
  var listElement = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  var descriptionOffers = generateRandomOffers();
  for (var i = 0; i < COUNT_DESCRIPTIONS; i++) {
    fragment.appendChild(renderPin(descriptionOffers[i]));
    fragment.appendChild(renderCard(descriptionOffers[i]));
  }
  listElement.appendChild(fragment);
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

mainPin.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    activatePage(evt);
  }
});

mainPin.addEventListener('mousedown', function (evt) {
  activatePage(evt);
});

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

addDisabled(filters);
addDisabled(adForm);
setAddress(mainPinX, mainPinDisabledY);
setPriceValidityByType(inputPrice, selectType);
setCapacityValidityByType(capacity);
