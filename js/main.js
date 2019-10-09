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

var generateRandomOffers = function () {
  var descriptions = [];
  for (var i = 0; i < COUNT_DESCRIPTIONS; i++) {
    var pinX = Math.floor(Math.random() * (WIDTH_MAP + 1)) - PIN_WIDTH / 2;
    var pinY = Math.floor(Math.random() * (PIN_Y_MAX + 1 - PIN_Y_MIN) + PIN_Y_MIN) - PIN_HEIGHT;

    descriptions.push({
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
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
        features: FEATURES.slice(0, Math.floor(Math.random() * FEATURES.length) + 1),
        description: 'description',
        photos: PHOTOS.slice(0, Math.floor(Math.random() * PHOTOS.length) + 1)
      },
      location: {
        x: pinX,
        y: pinY
      }
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

  for (var i = 0; i < descriptionPin.offer.features.length; i++) {
    var featuresElement = '<li class="popup__feature popup__feature--' + descriptionPin.offer.features[i] + '"></li>';
    if (i === 0) {
      cardElement.querySelector('.popup__features').innerHTML = featuresElement;
    } else {
      cardElement.querySelector('.popup__features').insertAdjacentHTML('beforeend', featuresElement);
    }
  }

  for (var j = 0; j < descriptionPin.offer.photos.length; j++) {
    var photosElement = '<img src="' + descriptionPin.offer.photos[j] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">';
    if (j === 0) {
      cardElement.querySelector('.popup__photos').innerHTML = photosElement;
    } else {
      cardElement.querySelector('.popup__photos').insertAdjacentHTML('beforeend', photosElement);
    }
  }

  cardElement.querySelector('.popup__avatar').src = descriptionPin.author.avatar;

  return cardElement;
};


var fillMap = function () {
  var listElement = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  var descriptionOffers = generateRandomOffers();

  for (var i = 0; i < COUNT_DESCRIPTIONS; i++) {
    fragment.appendChild(renderPin(descriptionOffers[i]));
    fragment.appendChild(renderCard(descriptionOffers[i]));
  }
  listElement.appendChild(fragment);
};

document.querySelector('.map').classList.remove('map--faded');
fillMap();
