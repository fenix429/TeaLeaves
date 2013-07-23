/* global $ */

'use strict';

angular.module('TeaLeavesApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
			.when('/app/:id', {
				templateUrl: 'views/app.html',
				controller: 'AppCtrl'
			})
			.when('/leaf/:id', {
				templateUrl: 'views/leaf.html',
				controller: 'LeafCtrl'
			})
      .otherwise({
        redirectTo: '/'
      });
  })
	.run(function ($rootScope) {
		$rootScope.isWorking = false;

		$rootScope.$on('$viewContentLoaded', function () {
			$(document).foundation();
		});

		$rootScope.$on('brew:start', function () {
			$rootScope.isWorking = true;
		});

		$rootScope.$on('brew:done', function () {
			$rootScope.isWorking = false;
		});
	});
