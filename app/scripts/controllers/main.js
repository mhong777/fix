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
