'use strict';

angular.module('TeaLeavesApp')
  .controller('MainCtrl', ['$scope', 'brew', function ($scope, brew) {
		$scope.appsLoaded = false;
		$scope.showError = false;
		$scope.newApp = {};

		$scope.registerApp = function (newApp) {
			if((!/\S/.test(newApp.name)) || newApp.name === undefined) {
				$scope.showError = true;
				return false;
			}

			$scope.showError = false;

			brew.app.create(newApp, function(data) {
				$scope.apps.push(data.app);
				$scope.newApp = {};
			});
		};

		$scope.init = function() {
			// fetch the app list from the server
			brew.app.list(function(data) {
				$scope.apps = data.apps;
				$scope.appsLoaded = true;
	    });
		};

  }]);