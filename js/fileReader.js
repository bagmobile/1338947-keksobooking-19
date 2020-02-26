'use strict';

(function (w) {

  var updateImages = function (elements, files) {

    elements.forEach(function (element, index) {
      var reader = new FileReader();
      var file = files[index];
      if (file) {
        reader.addEventListener('load', function () {
          element.src = reader.result;
        });
        reader.readAsDataURL(file);
      }
    });
  };

  w.fileReader = {
    updateImages: updateImages,
  };

})(window);
