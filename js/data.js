'use strict';
(function () {
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var CHECKIN = ['12:00', '13:00', '14:00'];
  var CHECKOUT = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var WIDTH_MAP = document.querySelector('.map').clientWidth;
  var PIN_Y_MIN = 130;
  var PIN_Y_MAX = 630;
  var PIN_HEIGHT = 70;
  var PIN_WIDTH = 50;


  var getArrayRandomLength = function (arr) {
    return arr.filter(function () {
      return Math.floor(Math.random() * 2);
    });
  };

  window.data = {
    COUNT_DESCRIPTIONS: 8,

    generateRandomOffers: function () {
      var descriptions = [];
      for (var i = 0; i < window.data.COUNT_DESCRIPTIONS; i++) {
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
    },
  };
})();
