'use strict';

(function () {

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

  window.card = {
    renderCard: function (descriptionPin) {
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
    },
  };
})();
