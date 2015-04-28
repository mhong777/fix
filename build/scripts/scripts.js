'use strict';

/**
 * @ngdoc overview
 * @name fixApp
 * @description
 * # fixApp
 *
 * Main module of the application.
 */
angular
  .module('fixApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

'use strict';

/**
 * @ngdoc function
 * @name fixApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fixApp
 */
angular.module('fixApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

'use strict';

/**
 * @ngdoc function
 * @name fixApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the fixApp
 */
angular.module('fixApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
