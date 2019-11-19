'use strict';

(function () {
  window.pin = {
    renderPin: function (descriptionPin) {
      var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
      var pinElement = pinTemplate.cloneNode(true);
      var pinImg = pinElement.querySelector('img');

      pinElement.style.left = descriptionPin.location.x + 'px';
      pinElement.style.top = descriptionPin.location.y + 'px';
      pinImg.alt = descriptionPin.offer.title;
      pinImg.src = descriptionPin.author.avatar;
      return pinElement;
    },
  };
})();
