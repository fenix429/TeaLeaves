'use strict';

angular.module('TeaLeavesApp')
  .controller('LeafCtrl', ['$scope', '$routeParams', 'brew', 'utils', function ($scope, $routeParams, brew, utils) {
		$scope.leafLoaded = false;
		$scope.hasExtra = false;

		$scope.formatTime = function (timestamp) {
			return utils.formatTime(timestamp);
		};

		$scope.init = function () {
			// fetch the leaf from the server
			brew.leaf.get($routeParams.id, function(data){
				$scope.leaf = data.leaf;
				$scope.leafLoaded = true;
				$scope.hasExtra = (data.leaf.extra !== null)? true : false;
			});
		};

  }]);
