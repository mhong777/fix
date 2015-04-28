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
