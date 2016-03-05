(function() {

  'use strict';

  angular
    .module('app', [
      'app.common',
      'app.core',
      'app.index',
      'app.templates'
    ])
    .value('googleApiKey', '....')
    .run(run);

  function run(browser) {
    if (browser.isMobileDevice()) {
      FastClick.attach(document.body);
    }
  }

})();

